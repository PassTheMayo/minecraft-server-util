import assert from 'assert';
import parseDescription from './parseDescription';
import { SRVRecord } from './resolveSRV';
import { StatusResponse } from '../model/StatusResponse';

function formatResult(host: string, port: number, srvRecord: SRVRecord | null, protocolVersion: number, version: string, motd: string, onlinePlayers: number, maxPlayers: number): StatusResponse {
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(Number.isInteger(protocolVersion), 'Expected integer, got ' + protocolVersion);
	assert(protocolVersion >= 0, 'Expected protocolVersion >= 0, got ' + protocolVersion);
	assert(version.length > 0, 'Expected version.length > 0, got ' + version.length);
	assert(Number.isInteger(onlinePlayers), 'Expected integer, got ' + onlinePlayers);
	assert(Number.isInteger(maxPlayers), 'Expected integer, got ' + maxPlayers);

	const description = parseDescription(motd);

	return {
		host,
		port,
		srvRecord,
		version,
		protocolVersion,
		onlinePlayers,
		maxPlayers,
		samplePlayers: null,
		description,
		favicon: null,
		modInfo: null
	};
}

export default formatResult;