import assert from 'assert';
import parseDescription from './parseDescription';
import { SRVRecord } from './resolveSRV';
import { StatusResponse } from '../model/StatusResponse';
import { RawStatusResponse } from '../model/RawStatusResponse';

function formatResult(host: string, port: number, srvRecord: SRVRecord | null, result: RawStatusResponse): StatusResponse {
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof result === 'object', 'Expected object, got ' + (typeof result));

	const version = result?.version?.name ?? null;
	const protocolVersion = result?.version?.protocol ?? null;
	const onlinePlayers = result?.players?.online ?? null;
	const maxPlayers = result?.players?.max ?? null;
	const samplePlayers = result?.players?.sample ?? null;
	const description = typeof result.description !== 'undefined' ? parseDescription(result.description) : null;
	const favicon = result?.favicon ?? null;
	const modInfo = result?.modinfo ?? null;

	return {
		host,
		port,
		srvRecord,
		version,
		protocolVersion,
		onlinePlayers,
		maxPlayers,
		samplePlayers,
		description,
		favicon,
		modInfo
	};
}

export default formatResult;