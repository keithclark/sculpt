# Sculpt

```js
// Import sculpt
const sculpt = require('sculpt');
const {identifier, url, string} = require('sculpt/bindings');

// Our class
class App {

}

// Model the class
sculpt.model(App, {
  id: identifier(),
  url: url(),
  email: string()
});
```

## Bindings

```js
const {identifier, string} = require('sculpt/bindings');

let userBindings = {
  id: identifier(),
  name: string(),
  email: string()
};

// Model the class
sculpt.model(App, userBindings);
```

* Identifier
* String
* Integer
* Url


## Set a data provider

You can set a global data provider using `scuplt.provider()`:
```js
const sculpt = require('sculpt');
const mysqlProvider = require('@sculpt/provider-mysql');

const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

sculpt.provider(mysql);
```

### Using mutliple providers

```js
const sculpt = require('sculpt');
const mysqlProvider = require('@sculpt/provider-mysql');
const fileSystemProvider = require('@sculpt/provider-fs');

const mysql = mysqlProvider();
const file = fileSystemProvider();

sculpt.model(App, bindings, {provider: mysql});
sculpt.model(User, bindings, {provider: file});
```


## Extend your class with sculpt helpers:

```js
sculpt.model(App, myBindings, {classExtensions: true});

let myApp = App.find({id: 1});
myApp.save();
myApp.delete();
```


## Custom Providers

`provider.js`

```js
const https = require('https');


module.exports = options => {
  const headers = {'User-Agent': 'sculpt demo'};

  const get = (path) => {
    return new Promise((resolve, reject) => {
      const req = https.request(`https://api.github.com${path}`, {headers}, res => {
        let body = '';
        res.on('data', data => {body += data});
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.end();
    })
  }

  const find = () => {
    return get(`/users/${options.user}/repos`);
  }
  return {find};
};
```

`index.js`

```js
const sculpt = require('../../src');
const {identity, integer, string} = require('../../src/bindings');
const githubProvider = require('./provider');


const github = githubProvider({user: 'keithclark'});


class Repository {}


// Model some data
sculpt.model(Repository, {
  id: identity(),
  name: string(),
  description: string(),
  watchers: integer()
}, {
  provider: github,
  classExtensions: true
});


// Fetch the data and log it to the console
Repository.find().then(repos => {
  repos.forEach(repo => {
    console.log(`${repo.name} -- ${repo.watchers} watchers`)
  })
});
```