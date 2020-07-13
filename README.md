# Minecraft Server Util
A library to get information about a Minecraft server.

## Installation
`npm i minecraft-server-util`

## Example
```js
const ping = require('minecraft-server-util');

// Callback
ping('play.hypixel.net', 25565, (error, response) => {
    if (error) throw error;

    console.log(response);
});

// Promise
ping('play.hypixel.net', 25565)
    .then((response) => {
        console.log(data);
    })
    .catch((error) => {
        throw error;
    });

// Callback - with options
ping('play.hypixel.net', 25565, { protocolVersion: 498, connectTimeout: 1000 * 10 }, (error, response) => {
    if (error) throw error;

    console.log(response);
});

// Promise - with options
ping('play.hypixel.net', 25565, { protocolVersion: 498, connectTimeout: 1000 * 10 })
    .then((response) => {
        console.log(data);
    })
    .catch((error) => {
        throw error;
    });
```

## License
[MIT License](https://github.com/PassTheMayo/Minecraft-Ping/blob/master/LICENSE)

## Contributing
You can contribute in any way possible, either by opening an issue or doing a pull request.
