[![NPM](https://nodei.co/npm/get-config.png?downloads=false&stars=false)](https://npmjs.org/package/get-config) [![NPM](https://nodei.co/npm-dl/get-config.png?months=6)](https://npmjs.org/package/get-config)


# get-config

`get-config` is a [Node.js](http://nodejs.org/) library automagically building a config object used throughout an application.

```js
// Asynchronous (Async/Await)
try {
  const config = await require('get-config').load(`${__dirname}/config`);
} catch (err) {...}

// Asynchronous (Promise)
require('get-config').load(`${__dirname}/config`)
  .then(config => {...})
  .catch(err => {...});

// Asynchronous (Callback)
require('get-config').load(`${__dirname}/config`, (err, config) => {...});

// Synchronous
try {
  const config = require('get-config').loadSync(`${__dirname}/config`);
} catch (err) {...}
```

* Both **promises** and **callback** (via [Bluebird](https://github.com/petkaantonov/bluebird)) styles are supported.
* Synchronous version is also supported. (`.loadSync()`)
* [get-env](https://github.com/pilwon/node-get-env) is used to parse `process.env.NODE_ENV`.


## Supported Formats

* [INI](http://en.wikipedia.org/wiki/INI_file): `.ini`, `.cfg`, `.conf` → (requires `npm install ini`)
* [JS](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules): `.js`
* [JSON](http://json.org/): `.json`
* [TOML](https://github.com/toml-lang/toml): `.toml` → (requires `npm install toml`)
* [XML](http://www.w3.org/XML/): `.xml` → (requires `npm install xml2json`)
* [YAML](http://yaml.org/): `.yaml`, `.yml` → (requires `npm install js-yaml`)


## How It Works

Take a look at the [example structure](https://github.com/pilwon/node-get-config/tree/master/example).

It assumes you have a separate directory somewhere in your project that is devoted to static config values that are further manipulated and used by an application. It reads all files ending with one of the supported format extensions then constructs a config object for you using filenames with their extension dropped (ex: `server.json` or `server.yaml` becomes `server`) as the key and the loaded content from the file as value during the construction of the config object. You can have one or more of these files with any choice of file format among the supported list, and you can mix them as well.

For example, if you placed both `client.json` and `server.yaml` files in `config/`, it would return a config object looking like this:

```
{
  client: <content-from-client.json>,
  server: <content-from-server.yaml>
}
```

It also assumes you have an optional override directory (usually to override default values with environment-specific values based on `process.env.NODE_ENV`). The override directory path is a relative path to the (default) config directory. If you pass `dev` as the override directory, the library will read all the config files under `config/dev/` in the same way explained above for the (default) config directory, then the values will be merged with the default config object.

For example, if you placed both `client.json` and `server.yaml` files in `config/` and `client.xml` in `config/dev`, it would return a config object looking like this when you run your application in the `dev` environment (it would return the object same as the above example for the rest of environments):

```
{
  client: <content-from-client.json merged with content-from-config/client.xml>,
  server: <content-from-server.yaml>
}
```

Imagine you defined multiple environment names within your application and you created override directories for each of these environments under `config/` with environment-specific config values organized into separate files (using the environment name as the override directory name). All you need to do now is to let the library know what environment you are in by passing the environment name as override directory path to let the library take care of environment-specific config object loading.

Check out [get-env](https://github.com/pilwon/node-get-env) library for delegating `NODE_ENV` environment variable loading and environment definitions.


## Installation

    $ npm install get-config

You also need to install parser for your choice of formats:

* INI: `npm install ini`
* JSON: included
* TOML: `npm install toml`
* XML: `npm install xml2json`
* YAML: `npm install js-yaml`


## Usage

```js
const getConfig = require('get-config');
const env = getConfig.env();  // alias to "get-env"

// Option 1: Async/Await
try {
  const config = await getConfig.load(`${__dirname}/config`, env);
} catch (err) {...}

// Option 2: Promise
getConfig.load(`${__dirname}/config`, env)
  .then(config => {...})
  .catch(err => {...});

// Option 3: Callback
getConfig.load(`${__dirname}/config`, env, (err, config) => {...});

// Option 4: Synchronous
try {
  const config = getConfig.loadSync(`${__dirname}/config`, env);
} catch (err) {...}
```

`env` is an optional parameter. If you do not pass the `env` value, it internally calls `getConfig.env()` (alias to "get-env") then uses that value for you.

It is recommended to stay with [get-env](https://github.com/pilwon/node-get-env) library's convention (`dev` and `prod`) to structure your config directory.


## Credits

Special thanks to:

* [get-env](https://github.com/pilwon/node-get-env): `NODE_ENV` parser
* [ini](https://github.com/isaacs/ini): INI parser
* [js-yaml](https://github.com/nodeca/js-yaml): YAML parser
* [toml](https://github.com/BinaryMuse/toml-node): TOML parser
* [xml2json](https://github.com/buglabs/node-xml2json): XML parser

See the [contributors](https://github.com/pilwon/node-get-config/graphs/contributors).


## License

<pre>
The MIT License (MIT)

Copyright (c) 2014-2016 Pilwon Huh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

[![Analytics](https://ga-beacon.appspot.com/UA-47034562-24/node-get-config/readme?pixel)](https://github.com/pilwon/node-get-config)
