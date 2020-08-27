# Minecraft Server Util
A Node.js library that retrieves information about a Minecraft server.

![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)
![License](https://img.shields.io/npm/l/minecraft-server-util)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/Minecraft-Ping)

## Installation
`npm i minecraft-server-util`

## Example
```js
const ping = require('minecraft-server-util');
// or
import ping from 'minecraft-server-util';

// Callback
ping('play.hypixel.net', 25565, (error, response) => {
    if (error) throw error;

    console.log(response);
});

// Promise
ping('play.hypixel.net', 25565)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });

// Callback - with options
ping('play.hypixel.net', 25565, { protocolVersion: 498, pingTimeout: 1000 * 10, enableSRV: true }, (error, response) => {
    if (error) throw error;

    console.log(response);
});

// Promise - with options
ping('play.hypixel.net', 25565, { protocolVersion: 498, pingTimeout: 1000 * 10, enableSRV: true })
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