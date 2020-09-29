# minecraft-server-util
A Node.js library for Minecraft servers that can retrieve status, perform queries, and RCON into servers.

[![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)](https://www.npmjs.com/package/minecraft-server-util)
[![License](https://img.shields.io/npm/l/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/blob/master/LICENSE)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
[![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/issues)
[![Discord server](https://img.shields.io/discord/758533537095090206?label=discord)](https://discord.gg/e7jgDYY)

## Installation
`npm i minecraft-server-util`

## Status Methods

There are several protocol changes over the years of Minecraft that require different implementations in order to get the status of the server. All of the methods below are exported from the package as a property (or module if using ESM).

Minecraft Version | `status()` | `statusFE01FA()` | `statusFE01()` | `statusFE()`
----------------- | -------- | -------------- | ------------ | ----------
1.7.2 - Latest    | **Yes**  | **Yes**        | **Yes**      | Maybe
1.6.1 - 1.6.4     | No       | **Yes**        | **Yes**      | **Yes**
1.4.2 - 1.5.2     | No       | No             | **Yes**      | **Yes**
Beta 1.8 - 1.3.2  | No       | No             | No           | **Yes**

## Examples

### Status
```js
const util = require('minecraft-server-util');

util.status('play.hypixel.net', { port: 25565 }) // port is optional, defaults to 25565
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Query
```js
const util = require('minecraft-server-util');

util.query('play.hypixel.net', { port: 25565 }) // port is optional
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### RCON
```js
const util = require('minecraft-server-util');

const client = new util.RCON('play.hypixel.net', { port: 25575, password: 'abc123' });

client.on('output', (message) => console.log(message));

client.connect()
    .then(async () => {
        await client.run('list');

        client.close();
    })
    .catch((error) => {
        throw error;
    });
```

There are more examples within the `examples/` folder.

## API
The entire API of this library is documented within the [wiki](https://github.com/PassTheMayo/minecraft-server-util/wiki).

## Discord
[https://discord.gg/e7jgDYY](https://discord.gg/e7jgDYY)

## License
[MIT License](https://github.com/PassTheMayo/minecraft-server-util/blob/master/LICENSE)