# Minecraft Server Util
A Node.js library that retrieves information about a Minecraft server.

![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)
![License](https://img.shields.io/npm/l/minecraft-server-util)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/Minecraft-Ping)

## Installation
`npm i minecraft-server-util`

## Methods
Use the following table to figure out what methods are compatible with what Minecraft servers. Each method is exported as a property or a module.

✅ - The method can be used to ping the specified server versions.

❌ - The method cannot be used to ping the specified server versions.

❓ - Unknown compatability, please open a pull request.

Versions          | `ping()` | `pingFE01FA()` | `pingFE01()` | `pingFE()`
----------------- | -------- | -------------- | ------------ | -----------
Java 1.7+         | ✅       | ❓             | ❓           | ❓
Java 1.6          | ❌       | ✅             | ❓           | ❓
Java 1.4-1.5      | ❌       | ❓             | ✅           | ❓
Java Beta 1.8-1.3 | ❌       | ❌             | ❌           | ✅

## Example
```js
const ping = require('minecraft-server-util');
// or
import ping from 'minecraft-server-util';

// Default options
ping('play.hypixel.net')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });

// Modified options
ping('play.hypixel.net', { port: 25565, protocolVersion: 498, pingTimeout: 1000 * 10, enableSRV: true })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

Please note that this package is not suitable for compilation to a browser module. Raw TCP sockets are unsupported in the browser environment. This package will only work within Node.js.

## License
[MIT License](https://github.com/PassTheMayo/Minecraft-Ping/blob/master/LICENSE)

## Contributing
You can contribute in any way possible, either by opening an issue or doing a pull request.