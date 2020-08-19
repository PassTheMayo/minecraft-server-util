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

declare function ping(host: string, port: number, options?: Options, callback?: (error: ErrorType, response: Response | null) => void): Promise<Response | null>;

export = ping;