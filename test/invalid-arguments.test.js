jest.setTimeout(8000);

const { ping } = require('../build');

test('no arguments', (done) => {
	ping()
		.then(() => {
			done.fail('ping() accepted no arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid host type', (done) => {
	ping(4)
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('host string empty', (done) => {
	ping('')
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid options type', (done) => {
	ping('play.hypixel.net', 'foobar')
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid options.port type', (done) => {
	ping('play.hypixel.net', { port: 'foobar' })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.port < 0', (done) => {
	ping('play.hypixel.net', { port: -100 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.port > 65536', (done) => {
	ping('play.hypixel.net', { port: 143531 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.port not an integer', (done) => {
	ping('play.hypixel.net', { port: 25565.143545 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid options.protocolVersion type', (done) => {
	ping('play.hypixel.net', { protocolVersion: 'foobar' })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.protocolVersion < 0', (done) => {
	ping('play.hypixel.net', { protocolVersion: -3 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.protocolVersion not an integer', (done) => {
	ping('play.hypixel.net', { port: 47.1295 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid options.pingTimeout type', (done) => {
	ping('play.hypixel.net', { pingTimeout: 'foobar' })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('options.pingTimeout < 0', (done) => {
	ping('play.hypixel.net', { pingTimeout: -100 })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});

test('invalid options.enableSRV type', (done) => {
	ping('play.hypixel.net', { enableSRV: 'foobar' })
		.then(() => {
			done.fail('ping() accepted invalid arguments');
		})
		.catch(() => {
			done();
		});
});