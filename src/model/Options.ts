interface BaseOptions {
    port?: number,
    enableSRV?: boolean,
    timeout?: number
}

interface StatusOptions extends BaseOptions {
    protocolVersion?: number
}

interface QueryOptions extends BaseOptions {
    sessionID?: number
}

interface RCONOptions extends BaseOptions {
    password?: string
}

export { StatusOptions, QueryOptions, RCONOptions };