# Minecraft Server Util
A Node.js library that retrieves information about a Minecraft server.

![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)
![License](https://img.shields.io/npm/l/minecraft-server-util)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/Minecraft-Ping)

## Installation
`npm i minecraft-server-util`

## Methods

There are several protocol changes over the years of Minecraft that require different implementations in order to get the status of the server. All of the methods below are exported from the package as a property (or module if using ESM).

Minecraft Version | `ping()` | `pingFE01FA()` | `pingFE01()` | `pingFE()`
----------------- | -------- | -------------- | ------------ | ----------
1.7.2 - Latest    | **Yes**  | **Yes**        | **Yes**      | **Yes**
1.6.1 - 1.6.4     | No       | **Yes**        | **Yes**      | **Yes**
1.4.2 - 1.5.2     | No       | No             | **Yes**      | **Yes**
Beta 1.8 - 1.3.2  | No       | No             | No           | **Yes**

## Example
```js
const { ping } = require('minecraft-server-util');
// or
import { ping } from 'minecraft-server-util';

ping('play.hypixel.net', { port: 25565 }) // port is optional, defaults to 25565
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });
```

Please note that this package is not suitable for compilation to a browser module. Raw TCP sockets are unsupported in the browser environment. This package will only work within Node.js.

## Options

The options object is always the second argument in the ping method, represented as an object with the following properties:

Property          | Type    | Default value | Note
----------------- | ------- | ------------- | ----
`port`            | Number  | `25565`       | -
`protocolVersion` | Number  | `47`          | [Protocol version numbers](https://wiki.vg/Protocol_version_numbers)
`pingTimeout`     | Number  | `15000`       | Time in milliseconds before the ping times out
`enableSRV`       | Boolean | `true`        | Enables an SRV record lookup if a domain is provided as a host

## Frequently Asked Questions

**1. Does this module have support for pinging Bedrock servers?**

No, this module is made specifically for pinging Java edition servers only. This may be a consideration in the future.

**2. What server versions can I ping?**

You can ping all Minecraft servers, as long as you are using the correct ping format as specified in the methods table above.

**3. Why are the method named what they are?**

The protocol that Minecraft uses to communicate between the client and server is always changing. The `ping()` method is the most recent format used for servers 1.6+ and up. All other formats use `ping<hex>()` where `<hex>` is the first few bytes of the payload. There was no good way to name each of these methods in a human readable way, so the hex bytes were used. More information can be found on the [Minecraft protocol wiki](https://wiki.vg/Server_List_Ping) about how this works.

**4. What Node.js versions do this module support?**

This package has been thoroughly tested with Node.js 10+. Earlier versions are likely to work but not guaranteed.

**5. How can I contribute to this project?**

You can contribute in any way you can think of. Opening an issue to report a bug or making a pull request to add a new feature is definitely appreciated.

## License
[MIT License](https://github.com/PassTheMayo/Minecraft-Ping/blob/master/LICENSE)