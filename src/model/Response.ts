import { ModInfo } from './RawResponse';
import Description from '../structure/Description';

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

export { Response, SamplePlayer };