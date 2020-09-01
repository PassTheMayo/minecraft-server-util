import assert from 'assert';
import Description from '../structure/Description';
import parseDescription, { RawResponse, ModInfo } from './parseDescription';
import { SRVRecord } from './resolveSRV';

interface SamplePlayer {
	name: string,
	id: string
}

interface Response {
	host: string;
	port: number;
	srvRecord: {
		host: string,
		port: number
	} | null,
	version: string | null;
	protocolVersion: number | null;
	onlinePlayers: number | null;
	maxPlayers: number | null;
	samplePlayers: SamplePlayer[] | null;
	description: Description | null;
	favicon: string | null;
	modInfo: ModInfo | null;
}

function formatResult(host: string, port: number, srvRecord: SRVRecord | null, result: RawResponse): Response {
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

export { Response };
export default formatResult;