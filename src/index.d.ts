interface Options {
    protocolVersion?: number,
    connectTimeout?: number,
    enableSRV?: boolean
}

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
    descriptionText: string | null;
    favicon: string | null;
    modList: any[] | null;
}

type ErrorType = Error | null;
type PingCallback = (error: ErrorType, response: Response | null) => void;

declare function ping(host: string, port?: number | Options | PingCallback, options?: Options | PingCallback, callback?: PingCallback): Promise<Response>;

export = ping;