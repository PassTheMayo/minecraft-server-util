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

## Frequently Asked Questions

**1. Does this module have support for pinging Bedrock servers?**

No, this module is made specifically for pinging Java edition servers only.

**2. What server versions can I ping?**

Currently, you can ping any server with version 1.6 and above. Support for earlier versions may be added in a future release.

**3. What Node.js versions do this module support?**

This package has been thoroughly tested with Node.js 10+. Most versions are likely to work but not guaranteed.

**4. How can I contribute to this project?**

You can contribute in any way you can think of. Opening an issue to report a bug or making a pull request to add a new feature is definitely appreciated.

## License
[MIT License](https://github.com/PassTheMayo/Minecraft-Ping/blob/master/LICENSE)