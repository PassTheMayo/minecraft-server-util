# minecraft-server-util

[![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)](https://www.npmjs.com/package/minecraft-server-util)
[![License](https://img.shields.io/npm/l/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/blob/master/LICENSE)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
[![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/issues)
[![Discord server](https://img.shields.io/discord/758533537095090206?label=discord)](https://discord.gg/e7jgDYY)

A Node.js library for Minecraft servers that can retrieve status, perform queries, and RCON into servers. It uses modern Minecraft protocols to support the latest servers and also includes backward compatibility for older versions. This library supports both Java Edition and Bedrock Edition servers, as long as the correct method is used.

## Table of Contents

- [Installation](#installation)
- [Java Edition status methods](#java-edition-status-methods)
- [API documentation](#api-documentation)
- [Examples](#examples)
    - [Get the status of a Java server](#get-the-status-of-a-java-server)
    - [Get the status of a Java server with options](#get-the-status-of-a-java-server-with-options)
    - [Get the status of a Bedrock server](#get-the-status-of-a-bedrock-server)
    - [Get the status of a Bedrock server with options](#get-the-status-of-a-bedrock-server-with-options)
    - [Query a server](#query-a-server)
    - [Query a server with options](#query-a-server-with-options)
    - [Full query a server](#full-query-a-server)
    - [Full query a server with options](#full-query-a-server-with-options)
    - [Execute console commands with RCON](#execute-console-commands-with-rcon)
- [Discord server](#discord-server)
- [License](#license)

## Installation

`npm i minecraft-server-util`

## Java Edition Status Methods

There are several protocol changes over the years of Minecraft that require different implementations to get the status of a Java Edition server. If you are looking to get the status of a Bedrock Edition server, use the `statusBedrock()` method instead. All of the methods below are exported from the package as a property.

Minecraft Version | `status()`         | `statusFE01FA()`   | `statusFE01()`     | `statusFE()`
----------------- | ------------------ | ------------------ | ------------------ | ----------
1.7.2 - Latest    | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :question:
1.6.1 - 1.6.4     | :x:                | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
1.4.2 - 1.5.2     | :x:                | :x:                | :heavy_check_mark: | :heavy_check_mark:
Beta 1.8 - 1.3.2  | :x:                | :x:                | :x:                | :heavy_check_mark:

:heavy_check_mark: &ndash; This status method will work with this Minecraft version.

:x: &ndash; This status method will NOT work with this Minecraft version.

:question: &ndash; This status method MAY work with this Minecraft version, but is not guaranteed to.

## API Documentation

The entire API of this library is documented within the [wiki](https://github.com/PassTheMayo/minecraft-server-util/wiki).

## Examples

### Get the status of a Java server

```js
const util = require('minecraft-server-util');

util.status('play.hypixel.net') // port is default 25565
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Get the status of a Java server with options

```js
const util = require('minecraft-server-util');

util.status('play.hypixel.net', { port: 25565, enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Get the status of a Bedrock server

Please note that retrieving the status of a Bedrock Edition server is an experimental API that may not work in specific scenarios. If you find any issues, please submit a [new issue](https://github.com/PassTheMayo/minecraft-server-util/issues/new).

```js
const util = require('minecraft-server-util');

util.statusBedrock('play.hypixel.net') // port is default 19132
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Get the status of a Bedrock server with options

Please note that retrieving the status of a Bedrock Edition server is an experimental API that may not work in specific scenarios. If you find any issues, please submit a [new issue](https://github.com/PassTheMayo/minecraft-server-util/issues/new).

```js
const util = require('minecraft-server-util');

util.statusBedrock('play.hypixel.net', { port: 19132, enableSRV: true, timeout: 5000 }) // These are the default options, `clientGUID` is set to random bytes
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Query a server

`enable-query` needs to be enabled in the server.properties file for this to work.

```js
const util = require('minecraft-server-util');

util.query('play.hypixel.net')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Query a server with options

`enable-query` needs to be enabled in the server.properties file for this to work.

```js
const util = require('minecraft-server-util');

util.query('play.hypixel.net', { port: 25565, enableSRV: true, timeout: 5000, sessionID: 0 }) // These are the default options
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Full query a server

`enable-query` needs to be enabled in the server.properties file for this to work. The server will cache the result every 5 seconds.

```js
const util = require('minecraft-server-util');

util.queryFull('play.hypixel.net')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Full query a server with options

`enable-query` needs to be enabled in the server.properties file for this to work. The server will cache the result every 5 seconds.

```js
const util = require('minecraft-server-util');

util.queryFull('play.hypixel.net', { port: 25565, enableSRV: true, timeout: 5000, sessionID: 0 }) // These are the default options
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

### Execute console commands with RCON

`rcon.enable` needs to be enabled in the server.properties file and the port and password must be known for this to work.

```js
const util = require('minecraft-server-util');

const client = new util.RCON('play.hypixel.net', { port: 25575, enableSRV: true, timeout: 5000, password: 'abc123' }); // These are the default options

client.on('output', (message) => console.log(message));

client.connect()
    .then(async () => {
        await client.run('list'); // List all players online

        client.close();
    })
    .catch((error) => {
        throw error;
    });
```

## Discord Server
[https://discord.gg/e7jgDYY](https://discord.gg/e7jgDYY)

## License
[MIT License](https://github.com/PassTheMayo/minecraft-server-util/blob/master/LICENSE)