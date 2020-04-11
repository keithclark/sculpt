# Sculpt

This project is a work in progress.

## Modelling with bindings

Bindings are used to describe the properties of your class to sculpt. They are used for property validation and are passed to data providers so they can execute commands against a datastore (SQL statements, for example).

```js
// Import sculpt
import sculpt from 'sculpt';

// Import the bindings we need
import { identifier, string, integer } from 'sculpt/bindings';

// A class from our application
class User {}

// create a new sculpt
const mySculpt = sculpt();

// Model the class
mySculpt.model(User, {
  id: identifier(),
  name: string(),
  email: string(),
  age: integer()
);
```

## Property validation

Once a class has been modelled sculpt can validate property values:

```js
import sculpt from 'sculpt';
import { string } from 'sculpt/bindings';

// Our class
class User {}

const mySculpt = sculpt();

mySculpt.model(User, {
  name: string({required: true}),
  email: string()
});

let testUser = new User();

// This will throw an error because name is required.
mySculpt.validate(testUser);
```

## Data providers

Data providers allow you to create instances of your applications classes directly from a datasource (mysql, mongoDB, a REST API etc.) and write any changes you make back. You can set a data provider for a model using `sculpt.provider()`:

```js
import mysqlProvider from '@sculpt/provider-mysql';

// We'll be connecting to a mysql database
const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

// Sculpt setup code ommited for brevity

// Tell sculpt that `User` data will be provided through the `users` table
mySculpt.provider(mysql.table('users'), User);

// Fetch a `User` isntance by ID.
const user = await mySculpt.find(User, {id: 1});

// Update an existing `User` instance
user.name = 'bob';
let success = await mySculpt.commit(user);

// Delete an existing `User` instance
let success = await mySculpt.delete(user);
```

You can also specify a provider when modelling a class by passing it as an option to `sculpt.model()`:

```js
sculpt.model(User, userBindings, {
  provider: mysqlProvider.table('users')
});
```

Models can only be connected to a datastore if they have an `identity` binding.

### Finding data

In addition to passing the class you wish to retrive, `sculpt.find()` accepts a second argument - an object literal - which is used to filter data. The object's key should be the binding name you wish to filter on and the value should be the value you wish to match. For example, to find a `User` with an `id` of `1`:

```js
const user = await mySculpt.find(User, {id: 1});
```

Sculpt providers can perform more complex searching using filters:

```js
import { greaterThan, includes } from 'sculpt/filters';

const user = await mySculpt.find(User, {age: between(18, 30)});
const user = await mySculpt.find(User, {level: includes(['admin', 'sysop'])});
```

Sculpt provides the following filters out of the box:

Filter | Description
-|-
`equals(value)` | Returns data if the binding value is equal to `value`
`notEquals(value)` | Returns data if the binding value is not equal to `value`
`lessThan(value)` | Returns data if the binding value is less than `value`
`lessThanOrEqualTo(value)` | Returns data if the binding value is less than or equal to `value`
`greaterThan(value)` | Returns data if the binding value is greater than `value`
`greaterThanOrEqualTo(value)` | Returns data if the binding value is greater than or equal to `value`
`includes([value, ...])` | Returns data if the binding value is included in the array `value`
`excludes([value, ...])` | Returns data if the binding value is not included in the array `value`
`between(min, max)` | Returns data if the binding value is greater than `min` and less than `max`
`notBetween(min, max)` | Returns data if the binding value is less than `min` or greater than `max`



## Extend your classes with sculpt helpers:

```js
sculpt.decorate(User);

// Now you can call `find()` statically...
let user = await User.find({id: 1});

// ...and save changes to an instance...
await user.save();

// ...and also delete an instance...
await user.delete();
```

You can also decorate a claess when modelling it by passing the `decorate` option to `sculpt.model()`:

```js
sculpt.model(User, userBindings, {
  decorate: true
});
```


## Writing custom data providers

Data providers must extend the sculpt `Provider` class and shold provide method bodies for `find()`, `create()`, `update()` and `delete()`. Here's an example of a github provider:

`app.js`

```js
import sculpt from 'sculpt';
import {identity, integer, string} from 'sculpt/bindings';
import githubProvider from './github-provider.js';

// Create the provider
const github = githubProvider({user: 'keithclark'});

// The Github Repo class
class Repository {
  info() {
    return `* ${this.name} -- ${this.watchers} watchers\n  ${this.description}\n`;
  }
}

const mySculpt = sculpt();

// Model the class
mySculpt.model(Repository, {
  id: identity(),
  name: string(),
  description: string(),
  watchers: integer()
});

// Decorate the class
mySculpt.decorate(Repository);

// Set the provider
mySculpt.provider(github.repo(), Repository);

// Fetch repos from github, sort by watchers and log to the console
Repository.find().then(repos => {
  repos.sort((a, b) => a.watchers > b.watchers ? -1 : 1).forEach(repo => {
    console.log(repo.info())
  });
});
```

`github-provider.js`:

```js
import https from 'https';
import Provider from 'sculpt/objects/Provider.js';

// Internal method to make HTTP request to the Github API.
const request = (path) => {
  const headers = {'User-Agent': 'sculpt demo'};
  return new Promise((resolve, reject) => {
    https.request(`https://api.github.com${path}`, {headers}, res => {
      let body = '';
      res.on('data', data => {body += data});
      res.on('end', () => resolve(JSON.parse(body)));
    }).end();
  })
}

// Our custom provider class
class GithubProvider extends Provider {
  constructor(url) {
    super();
    this.url = url;
  }
  async find(filters = [], bindings) {
    return request(this.url);
  }
}

// Export the API
module.exports = options => {
  const repo = () => {
    return new GithubProvider(`/users/${options.user}/repos`);
  }
  return {repo};
};
```


