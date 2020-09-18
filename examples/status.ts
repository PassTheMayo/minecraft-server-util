import util from 'minecraft-server-util';

// This will retrieve the status of any server with version 1.7 and up.
const statusExample = async () => {
	try {
		const result = await util.status('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will retrieve the status of any server using versions 1.6.1 and up.
const statusFE01FAExample = async () => {
	try {
		const result = await util.statusFE01FA('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will retrieve the status of any server using versions 1.4.2 and up.
const statusFE01Example = async () => {
	try {
		const result = await util.statusFE01('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

// This will retrieve the status of any server using versions beta 1.8 and up.
const statusFEExample = async () => {
	try {
		const result = await util.statusFE('play.hypixel.net');

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

statusExample();
statusFE01FAExample();
statusFE01Example();
statusFEExample();