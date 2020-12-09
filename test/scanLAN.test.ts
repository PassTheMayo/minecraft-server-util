import { assert } from 'chai';
import 'mocha';

import util from '../src';
import Description from '../src/structure/Description';

describe('scanLAN()', () => {
	it('should scan without error', (done) => {
		util.scanLAN({ scanTime: 5000 })
			.then((result) => {
				assert(typeof result === 'object', `Expected 'result' to be an object, got ${typeof result}`);
				assert(Array.isArray(result.servers), `Expected 'result.servers' to be an array, got ${Object.getPrototypeOf(result.servers)}`);

				for (let i = 0; i < result.servers.length; i++) {
					assert(typeof result.servers[i] === 'object', `Expected 'result.servers[${i}]' to be an object, got ${typeof result.servers[i]}`);
					assert(typeof result.servers[i].host === 'string', `Expected 'result.servers[${i}].host' to be a string, got ${typeof result.servers[i].host}`);
					assert(result.servers[i].host.length > 0, `Expected 'result.servers[${i}].host' to have a length greater than 0, got ${result.servers[i].host.length}`);
					assert(typeof result.servers[i].port === 'number', `Expected 'result.servers[${i}].port' to be a number, got ${typeof result.servers[i].port}`);
					assert(result.servers[i].port > 0, `Expected 'result.servers[${i}].port' to be greater than 0, got ${result.servers[i].port}`);
					assert(result.servers[i].port < 65536, `Expected 'result.servers[${i}].port' to be less than 65536, got ${result.servers[i].port}`);
					assert(Number.isInteger(result.servers[i].port), `Expected 'result.servers[${i}].port' to be an integer, got ${result.servers[i].port}`);
					assert(typeof result.servers[i].description === 'object', `Expected 'result.servers[${i}].description' to be an object, got ${typeof result.servers[i].description}`);
					assert(result.servers[i].description instanceof Description, `Expected 'result.servers[${i}].description' to be an instance of Description, got ${Object.getPrototypeOf(result.servers[i].description)}`);
					assert(typeof result.servers[i].description.descriptionText === 'string', `Expected 'result.servers[${i}].description.descriptionText' to be a string, got ${typeof result.servers[i].description.descriptionText}`);
					assert(typeof result.servers[i].description.toRaw === 'function', `Expected 'result.servers[${i}].description.toRaw' to be a function, got ${typeof result.servers[i].description.toRaw}`);
					assert(typeof result.servers[i].description.toRaw() === 'string', `Expected 'result.servers[${i}].description.toRaw()' to be a string, got ${typeof result.servers[i].description.toRaw()}`);
					assert(typeof result.servers[i].description.toANSI === 'function', `Expected 'result.servers[${i}].description.toANSI' to be a function, got ${typeof result.servers[i].description.toANSI}`);
					assert(typeof result.servers[i].description.toANSI() === 'string', `Expected 'result.servers[${i}].description.toANSI()' to be a string, got ${typeof result.servers[i].description.toANSI()}`);
					assert(typeof result.servers[i].description.toString === 'function', `Expected 'result.servers[${i}].description.toString' to be a function, got ${typeof result.servers[i].description.toString}`);
					assert(typeof result.servers[i].description.toString() === 'string', `Expected 'result.servers[${i}].description.toString()' to be a string, got ${typeof result.servers[i].description.toString()}`);
				}

				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});