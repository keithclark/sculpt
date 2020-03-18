# Sculpt

This project is a work in progress.

## Modelling with bindings

Bindings are used to describe the properties of your class to sculpt. They are used for property validation and are passed to data providers so they can execute commands against a datastore (SQL statements, for example).

```js
// Import sculpt
const sculpt = require('sculpt');

// Import the bindings
const {identifier, string, integer} = require('sculpt/bindings');

// Our class
class User {}

// Define the class bindings
let userBindings = {
  id: identifier(),
  name: string(),
  email: string(),
  age: integer()
};

// Model the class
sculpt.model(User, userBindings);
```

## Property validation

Once a class has been modeeled sculpt can validate property values:

```js
const sculpt = require('sculpt');
const {string} = require('sculpt/bindings');

// Our class
class User {}

sculpt.model(User, {
  name: string({required: true}),
  email: string(),
});

let testUser = new User();

// This will throw an error because name is required.
sculpt.validate(testUser);
```

## Data providers

Data providers allow you to create instances of your applications classes directly from a datasource (mysql, mongoDB, a REST API etc.) and write any changes you make back. You can set a data provider for a model using `sculpt.provider()`:

```js
const sculpt = require('sculpt');
const mysqlProvider = require('@sculpt/provider-mysql');

// We'll be connecting to a mysql database
const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

// Tell sculpt that data will be provided through the `users` table
sculpt.provider(mysql.table('users'), User);

// Fetch a user by ID.
const user = await sculpt.find(User, {id: 1});

// Update the user
user.name = 'bob'
await sculpt.commit(user);

// Delete the user
await sculpt.delete(user);
```

You can also specify a provider when modelling a class by passing it as an option to `sculpt.model()`:

```js
sculpt.model(User, userBindings, {
  provider: mysqlProvider.table('users')
});
```


## Extend your classes with sculpt helpers:

```js
sculpt.decorate(User);

// Now you can call `find()` direcly on the instance
let user = await User.find({id: 1});
username = 'Mary';

// And save changes...
await user.save();

// You can also delete...
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
const sculpt = require('sculpt')();
const {identity, integer, string} = require('sculpt/bindings');
const githubProvider = require('./github-provider');

// Create the provider
const github = githubProvider({user: 'keithclark'});

// The Github Repo class
class Repository {
  info() {
    return `* ${this.name} -- ${this.watchers} watchers\n  ${this.description}\n`;
  }
}

// Model the class
sculpt.model(Repository, {
  id: identity(),
  name: string(),
  description: string(),
  watchers: integer()
});

// Decorate the class
sculpt.decorate(Repository);

// Set the provider
sculpt.provider(github.repo(), Repository);

// Fetch repos from github, sort by watchers and log to the console
Repository.find().then(repos => {
  repos.sort((a, b) => a.watchers > b.watchers ? -1 : 1).forEach(repo => {
    console.log(repo.info())
  });
});
```

`github-provider.js`:

```js
const https = require('https');
const Provider = require('sculpt/Provider');

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


