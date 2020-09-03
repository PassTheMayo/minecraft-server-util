import util from 'minecraft-server-util';

// Note: The `enable-query` setting has to be set to `true` within your server.properties file in order for it to work.

// Perform a basic query on a server.
const queryExample = async () => {
	try {
		const result = await util.query('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// Perform a full query on a server and retrieve more info than `query()`.
const queryFullExample = async () => {
	try {
		const result = await util.queryFull('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

queryExample();
queryFullExample();