interface PingOptions {
    port?: number,
    protocolVersion?: number,
    pingTimeout?: number,
    enableSRV?: boolean
}

interface QueryOptions {
    port?: number,
    queryTimeout?: number,
    enableSRV?: boolean,
    sessionID?: number
}

interface RCONOptions {
    port?: number,
    password?: string,
    connectTimeout?: number,
    enableSRV?: boolean
}

export { PingOptions, QueryOptions, RCONOptions };