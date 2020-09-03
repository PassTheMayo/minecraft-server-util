const { RCON } = require('minecraft-server-util');

// Note: The `enable-rcon` setting has to be set to `true` in your server.properties file in order for this to work.
// It is also recommended you use a secure password to prevent unauthorized use.

const rconExample = async () => {
	const client = new RCON('play.hypixel.net');

	await client.connect();

	client.on('output', (output) => {
		console.log(output);
	});

	await client.run('list'); // Lists all players on the server
	await client.run('say Hello, world!'); // Tells all players in the server "Hello, world!"

	return client.close(); // Make sure to close the connection after use
};

rconExample();