# Sculpt

Install with:

```
npm install sculpt
```

Example:

```js
const sculpt = require('sculpt');
const {identifier, string} = require('sculpt/bindings');
const mysqlProvider = require('sculpt/provider-mysql');

class User {}

// hook up to mysql backend
sculpt.provider(mysqlProvider({
  user: 'user',
  pass: 'pass',
  db: 'test'
}));

// Model the class
sculpt.model(User, {
  id: identity(),
  name: string()
});

// Find user id=1
User.find({id: 1}).then(console.log)
```

## Tutorial

### Installation

```
npm install sculpt
```

### Hello world

```js
const sculpt = require('sculpt');
const {identity, string} = require('sculpt/bindings');

const appData = sculpt();

// An object from our application.
class User {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

// Model the object
appData.model(User, {
  'id': identity(),
  'firstname': string(),
  'lastname': string()
});

let user = new User('Fred', 'Bloggs');
user.validate();
```


### Working with multiple instances

In most applications you'll usually only require a single sculpt but – if you need to – you can create multiple sculpt instances, each with their own set of models, bindings and providers.


```js
const sculpt = require('sculpt');

// sculpt some data
const sculptData1 = sculpt();
sculpt1.provider(mySql);

// sculpt some different data
const sculptData2 = sculpt();
sculpt2.provider(myFileSystem);
```


## Walkthrough

blah blah

### 1) Define the class

```js
// Our class
class User {
  get fullname() {
    return `${this.firstname} ${this.lastname}`;
  }
}
```

### 2) Create Bindings

```js
const {identifier, string} = require('sculpt/bindings');

let userBindings = {
  id: identifier(),
  firstname: string(),
  lastname: string(),
  email: string()
};
```

### 3) Model the class

```js
const sculpt = require('sculpt');

// Model the class
sculpt.model(User, userBindings);
```

### 4) Add a data provider

```js
// import the provider
const mysqlProvider = require('sculpt/provider-mysql');

// create the provider
const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

// Register this as the default provider
sculpt.provider(mysql);
```

### 5) Store

```js
let user = new User();
user.firstname = 'Fred';
user.lastname = 'Bloggs';
user.email = 'fred.bloggs@somedomain.com';

sculpt.commit(user).then(success => {
  if (success) {
    console.log(user);
  }
});
```

## Bindings

Bindings are used to describe the properties of your class to sculpt. They are used for property validation and are passed to data providers so they execute commands against a data store (SQL statements, for example). They are imported thus:

import everything:

```js
const bindings = require('sculpt/bindings');
```

or just import what you need:

```js
const {identity, string} = require('sculpt/bindings');
```

Bindings are defined using a key/value pair. The key represents a class property and the value holds the sculpt binding:

```js
let userBindings = {
  id: identity(),
  name: string(),
  age: integer()
}

sculpt.model(User, userBindings);
```

### Common options

All bindings share a common set of options:

Option  | Description                 | Default
--------|-----------------------------|-------------
`alias` | provider alias   |
`required` | provider alias   |

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Luctus venenatis lectus magna fringilla. Venenatis lectus magna fringilla urna. In hac habitasse platea dictumst. Orci eu lobortis elementum nibh tellus molestie nunc non blandit.

Venenatis lectus magna fringilla urna. In hac habitasse platea dictumst.

### Identity

The identity binding is used to uniquely identify a model instance to a data provider so it can be recalled at a later date. Without an identity binding, sculpt will not be able to commit changes to a data provider.


```js
const {identity} = require('sculpt/bindings');

sculpt.model(User, {
  id: identity()
});
```

The binding treats the bound instance property as _read-only_, therefore you shouldn't modify the instance property as this could lead to storage issues with the data provider. Sculpt will guard against external modification, throwing an error if the value has changed. The following example demonstrates this:

```js
let user = await User.find({id: 1});
user.id = 5;
user.save();

// Error: Identity binding values cannot be set externally
```

### Integer

```js
const {integer} = require('sculpt/bindings');

sculpt.model(User, {
  age: integer({min: 18})
});
```

#### Options

Option | Description                 | Default
-------|-----------------------------|-------------
`min`  | The minimum allowed value   | `Number.MIN_VALUE`
`max`  | The maximum allowed value   | `Number.MAX_VALUE`

### Url

```js
const {url} = require('sculpt/bindings');

sculpt.model(User, {
  website: url({fullyQualified: true})
});
```

### String

```js
const {string} = require('sculpt/bindings');

sculpt.model(User, {
  name: string({maxLength: 50})
});
```

#### Options

Option | Description                 | Default
-------|-----------------------------|-------------
`allowEmpty` | Can this value be an empty string | `true`
`maxLength` | The minimum length value   | `Number.MIN_VALUE`


### Custom bindings (Proposed)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Luctus venenatis lectus magna fringilla. Venenatis lectus magna fringilla urna. In hac habitasse platea dictumst. Orci eu lobortis elementum nibh tellus molestie nunc non blandit.

Venenatis lectus magna fringilla urna. In hac habitasse platea dictumst.

Here's an example password binding:

```js
// We're extending the string binding
const StringBinding = require('sculpt/bindings/string');

// Our binding with a custom validator
class PasswordBinding extends StringBinding {
  validate(value) {
    super.validate(value);

    if (this.options.requireUppercase && !value.test(/[A-Z]/)) {
      throw new Error('Must contain a uppercase letter');
    }
    if (this.options.requireNumber && !value.test(/[0-9]/)) {
      throw new Error('Must contain a number');
    }
  }
}

// Use the binding when we model our User object
sculpt.model(User, {
  password: new PasswordBinding({
    requireUppercase: true,
    requireNumber: true
  })
});
```


## Data Providers

Providers allow you to connect your models to a data store.

A provider is a function that either returns a Provider signature or an interface for creating signatures:

method|arguments|description
-|-|-
`find`||
`delete`||
`create`||
`update`||

```js
const myProvider = options => {
  return {
    find: (type, bindings, filters) => {},
    update: (type, bindings, values, filters) => {},
    create: (type, bindings, values) => {},
    delete: (type, bindings, filters) => {},
  }
}

sculpt.provider(myProvider, User);
```

or

```js
const myProvider = options => {
  const context = name => {
    return {
      find: (type, bindings, filters) => {},
      update: (type, bindings, values, filters) => {},
      create: (type, bindings, values) => {},
      delete: (type, bindings, filters) => {},
    }
  };

  return { context };
}

sculpt.provider(myProvider.context('user'), User);
```

### Configuring a provider


```js
const sculpt = require('sculpt');
const mysqlProvider = require('@sculpt/provider-mysql');

const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});
```

Data providers can be set on a global or per-object level. You can set a global data provider using `sculpt.provider()`:

```js
sculpt.provider(mysql);
```

To set a provider for a specific class, you can pass it as an option when modelling:

```js
sculpt.model(Myclass, myBindings, {
  provider: mysql
})
```



### Multiple providers

```js
const sculpt = require('sculpt');
const mysqlProvider = require('@sculpt/provider-mysql');
const fileSystemProvider = require('@sculpt/provider-fs');

const mysql = mysqlProvider();
const file = fileSystemProvider();

sculpt.model(App, bindings, {provider: mysql});
sculpt.model(User, bindings, {provider: file});
```



### MySQL Provider

```js
const mysqlProvider = require('@sculpt/provider-mysql');

const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

class Resource {}

mysql.table(Resource, 'resources');
```


#### options

Option | Description                 | Default
-------|-----------------------------|-------------
`host` | The minimum length value   | `Number.MIN_VALUE`
`user` | The minimum length value   | `Number.MIN_VALUE`
`pass` | The minimum length value   | `Number.MIN_VALUE`






### JSON Provider

```js
const jsonProvider = require('@sculpt/provider-json');

const json = jsonProvider({
  path: 'path/to/db/dir'
});
```

#### options

Option | Description                 | Default
-------|-----------------------------|-------------
`path` | The minimum length value   | `Number.MIN_VALUE`


### Temp Provider

```js
const tempProvider = require('@sculpt/provider-temp');

const temp = tempProvider);
```



### Custom data providers

`githubProvider.js`

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
const sculpt = require('sculpt')();
const {identity, integer, string} = require('sculpt/bindings');
const githubProvider = require('./githubProvider');


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

## API

### sculpt()

Create a new sculpt

#### Syntax
```
instance = sculpt()
```

#### Example
```js
const sculpt = require('sculpt');
const myData = sculpt();
```

### Sculpt.decorate

Add sculpt syntactic sugar to an object exposing the following methods

* `Class.find(filters)` - Same as `sculpt.find(Class, filters)`
* `instance.save()` - Same as `sculpt.commit(Class, instance)`
* `instance.delete()` - Same as `sculpt.delete(Class, instance)`

#### Syntax
```
sculpt.decorate(class);
```

#### Example
```js
// Without decoration
class UserA {}

let user = await sculpt.find(UserA, {id: 1});
sculpt.commit(UserA, user);
sculpt.delete(UserA, user);


// With decoration
class UserB {}

sculpt.decorate(UserB);

let user = await UserB.find({id: 1});
user.save();
user.delete();
```


### Sculpt.provider

Sets the [data provider](#data-providers) for a specific model or, if no model is passed, sets the default provider.

#### Syntax
```
sculpt.provider(provider)
```
```
sculpt.provider(type, provider)
```

##### Arguments

Name | Type | Description
-|-|-
`provider` | Provider | The data provider to set
`type` | Class | The model the provider will use

#### Examples

##### Setting the default provider
```js
const mysqlProvider = require('@sculpt/provider-mysql');

const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

sculpt.provider(mysql);
```


##### Setting a class-specific provider
```js
const mysqlProvider = require('@sculpt/provider-mysql');

const mysql = mysqlProvider({
  host: 'localhost',
  user: 'user',
  pass: 'pass'
});

class User {}

sculpt.provider(User, mysql);
```


### Sculpt.model

Register a class and it's [bindings](#bindings) with sculpt

#### Syntax
```
sculpt.model(class, bindings, [options])
```

##### Arguments

Name | Description
-------|----------------------------
`class` | The data class to model
`bindings` | Key/Value pair of property bindings for this class
`options` | Object

##### Options

Option | Description
-------|----------------------------
`provider` | The data provider to use for this class - same as calling `sculpt.provider(class, provider)`
`decorate` | Add helper methods to the modelled class - same as calling `sculpt.decorate(class)`

#### Example

```js
class User {}

const bindings = {
  id: identity(),
  name: string()
}

sculpt.model(User, bindings);
```


### Sculpt.find

Query the data provider for a list of instances. Returns a promise. If no data provider has been specified an error will be thrown.

#### Syntax
```
sculpt.find(class, [filters])
```

#### Example

```js
let user = await sculpt.find(User, {id: 1});
```

### Sculpt.commit

Commit an instance to the data provider. If no data provider has been specified an error will be thrown.

#### Syntax
```
sculpt.commit(instance)
```

#### Example

```js
let user = new User();

// Create a new user
user.name = 'Ken';
await sculpt.commit(user);

// Modify the user
user.name = 'Barbie';
await sculpt.commit(user);
```


### Sculpt.delete

Delete an instance to the data provider. If no data provider has been specified an error will be thrown.

#### Syntax
```
sculpt.delete(instance)
```

#### Example

```js
let user = await User.find({id: 1})
let ok = await sculpt.delete(user);
```


### Sculpt.validate

Validates property values against the model bindings. Throws an error if an invalid value is found.

#### Syntax
```
sculpt.validate(instance)
```

#### Example

```js
sculpt.validate(user);
```



## Integration

### ExpressJS

#### Error handling

```js
const InvalidBindingValueError = require('sculpt/errors/InvalidBindingValueError')

app.use(function (err, req, res, next) {
  if (err instanceof InvalidBindingValueError) {
    res.status(400).json({
      error: {
        property: e.property,
        reason: e.reason
      }
    });
  }
})
```

```js
const express = require('express');

const sculpt = require('sculpt')();
const {identity, integer, string} = require('sculpt/bindings');
const {InvalidBindingValueError} = require('sculpt/errors');

class User {}

let app = express();

sculpt.model(User, {
  id: identity(),
  name: string(),
  age: integer()
});

app.get('/users', async(req, res) => {
  let users = await User.find();
  res.json(users);
});

app.post('/users', async(req, res) => {
  let user = new User();
  user.name = req.body.name;
  await user.save();
  res.status(201).end();
});

// Error handling
app.use(function (err, req, res, next) {
  if (err instanceof InvalidBindingValueError) {
    res.status(400).json({
      error: {
        property: e.property,
        reason: e.reason
      }
    });
  }
  next();
});
```
