import 'mocha';

import util from '../src';

const servers: string[] = [
	// ['localhost', 'abc123']
];

describe('new RCON()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i], (done) => {
			const client = new util.RCON(servers[i][0], { password: servers[i][1] });

			client.on('output', async () => {
				await client.close();

				done();
			});

			client.connect()
				.then(async () => {
					await client.run('list');
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});