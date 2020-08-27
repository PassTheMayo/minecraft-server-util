# Minecraft Server Util
A Node.js library that retrieves information about a Minecraft server.

![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)
![License](https://img.shields.io/npm/l/minecraft-server-util)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/Minecraft-Ping)

## Installation
`npm i minecraft-server-util`

## Example

### Using Promises
```ts

import { ping } from 'minecraft-server-util';

// Async/Await
try {
    const response = await ping('play.hypixel.net');
} catch(error) {
    console.log('Error', error);
}

// With Options
try {
    const response = await ping('play.hypixel.net', {
        port: 25565,
        protocolVersion: 498,
        connectTimeout: 1000 * 10,
        enableSRV: true
    });
} catch(error) {
    console.log('Error', error);
}

// Then/Catch
ping('play.hypixel.net', { port: 25565 })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        throw error;
    });

```

### Using Callbacks
```ts
import { pingCallback } from 'minecraft-server-util';

pingCallback('play.hypixel.net', (error, response) => {
    if (error) throw error;

    console.log(response);
});

// With Options
pingCallback('play.hypixel.net', (error, response) => {
    if (error) throw error;

    console.log(response);
}, { port: 25565, protocolVersion: 498, connectTimeout: 1000 * 10, enableSRV: true });

```

## Building

```
npm run build
```

## Testing

```
npm run test
```

Please note that this package is not suitable for compilation to a browser module. Raw TCP sockets are unsupported in the browser environment. This package will only work within Node.js.

## License
[MIT License](https://github.com/PassTheMayo/Minecraft-Ping/blob/master/LICENSE)

## Contributing
You can contribute in any way possible, either by opening an issue or doing a pull request.