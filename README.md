# Sculpt

This project is a work in progress.

## Bindings

```js
// Import sculpt
const sculpt = require('sculpt');
const {identifier, string, integer} = require('sculpt/bindings');

// Our class
class User {

}

let userBindings = {
  id: identifier(),
  name: string(),
  email: string(),
  age: integer()
};

sculpt.model(User, userBindings);
```


## Data providers

You can set a data provider for a model using `sculpt.provider()`:

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
```

You can also specify a provider when modelling a class by passing it as an option to `sculpt.model()`:

```js
sculpt.model(User, userBindings, {
  provider: mysqlProvider.table('users')
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



## Extend your classes with sculpt helpers:

```js
sculpt.decorate(User);

let user = await User.find({id: 1});
username = 'Mary';

// Save changes
await user.save();

// You can also delete
await user.delete();
```


