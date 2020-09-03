import { ModInfo } from './RawStatusResponse';
import Description from '../structure/Description';

interface SamplePlayer {
	name: string,
	id: string
}

interface StatusResponse {
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

export { StatusResponse, SamplePlayer };