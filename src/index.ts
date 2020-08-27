import assert from 'assert';
import { Packet } from './structure/Packet';
import { Socket } from './structure/Socket';
import { getVarIntSize } from './util/GetVarIntSize';
import { formatResult, verifyHost, verifyPort } from './util/DataUtil';
import { resolveSRV } from './util/ResolveSRV';
import { PingOptions, PingCallback, Response } from './model/api';

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

function getEffectiveOptions(options?: PingOptions): Required<PingOptions> {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25565,
        callback: undefined,
        protocolVersion: 47,
        pingTimeout: 1000 * 5,
        enableSRV: true
    } as Required<PingOptions>, options);
}

function verifyInput(host: string, effectiveOptions: Required<PingOptions>): void {

    // Validate all arguments to ensure they are the correct type

    assert(typeof effectiveOptions === 'object', `Options must be an object, got ${typeof effectiveOptions}`);
    verifyHost(host);
    verifyPort(effectiveOptions.port);

}

async function doServerPull(host: string, options?: PingOptions): Promise<Response> {

    const effectiveOptions: Required<PingOptions> = getEffectiveOptions(options);
    verifyInput(host, effectiveOptions);

    // Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
    let srvRecord;
    if (effectiveOptions.enableSRV && !ipAddressRegEx.test(host)) {
        srvRecord = await resolveSRV(host);
    }

    // Create a new TCP connection to the specified address
    // Wait until the connection is established
    const socket = await Socket.buildSocket(srvRecord ? srvRecord.host : host, srvRecord ? srvRecord.port : effectiveOptions.port, effectiveOptions.pingTimeout);

    // Create a new Handshake packet and sent it to the server
    const handshakePacket = new Packet();
    handshakePacket.writeVarInt(0x00); // Handshake packet ID
    handshakePacket.writeVarInt(effectiveOptions.protocolVersion); // Protocol version
    handshakePacket.writeString(host); // Host
    handshakePacket.writeUnsignedShort(effectiveOptions.port); // Port
    handshakePacket.writeVarInt(1); // Next state - status
    socket.writeBytes(handshakePacket.finish());

    // Create a new Request packet and send it to the server
    const requestPacket = new Packet();
    requestPacket.writeVarInt(0x00); // Request packet ID
    socket.writeBytes(requestPacket.finish());

    let result;
    let iterations = 0;

    // Loop over each packet returned and wait until it receives a Response packet
    // TODO vvv
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const packetLength = await socket.readVarInt();
        const packetType = await socket.readVarInt();

        if (packetType !== 0) {

            // Server did not send correct packet within the first three packets sent
            if (iterations >= 3) {
                throw new Error('Server did not send correct packet in time');
            }

            // Packet was unexpected type, ignore the rest of the data in this packet
            const readSize = packetLength - getVarIntSize(packetType);

            if (readSize > 0) await socket.readBytes(readSize);

            ++iterations;

            continue;
        }

        // Packet was expected type, read the contents of the packet for the ping data
        result = await socket.readString();

        break;
    }

    // Destroy the socket, it is no longer needed
    socket.destroy();

    let data;

    try {
        data = JSON.parse(result);
    } catch (e) {
        new Error('Response from server is not valid JSON');
    }

    // Convert the data from raw Minecraft ping payload format into a more human readable format and resolve the promise
    return formatResult(host, effectiveOptions.port, srvRecord, data);
}

/*
    Exported Functions
 */

export function pingCallback(host: string, callback: PingCallback, options?: PingOptions): void {

    doServerPull(host, options)
        .then((...args) => callback(null, ...args))
        .catch((error) => callback(error, null));

}


export function ping(host: string, options?: PingOptions): Promise<Response> {

    return doServerPull(host, options);

}

export * from './model/api';