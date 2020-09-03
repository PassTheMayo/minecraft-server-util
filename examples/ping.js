const { ping, pingFE01FA, pingFE01, pingFE } = require('minecraft-server-util');

// This will ping any server with version 1.7 and up.
const pingExample = async () => {
	try {
		const result = await ping('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will ping any server using versions 1.6.1 and up.
const pingFE01FAExample = async () => {
	try {
		const result = await pingFE01FA('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will ping any server using versions 1.4.2 and up.
const pingFE01Example = async () => {
	try {
		const result = await pingFE01('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will ping any server using versions beta 1.8 and up.
const pingFEExample = async () => {
	try {
		const result = await pingFE('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

pingExample();
pingFE01FAExample();
pingFE01Example();
pingFEExample();