import 'mocha';

import util from '../src';

const servers: string[] = [
	// 'localhost'
];

describe('queryBasic()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i], (done) => {
			util.query(servers[i])
				.then(() => {
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});

describe('queryFull()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i], (done) => {
			util.queryFull(servers[i])
				.then(() => {
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});