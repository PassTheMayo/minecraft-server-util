import assert from 'assert';
import { createConnection, Socket as NodeSocket } from 'net';

export class Socket {

    private socket!: NodeSocket;
    private buffer: number[];

    protected constructor(host: string, port: number, timeout: number) {

        assert(typeof host === 'string', 'Expected string, got ' + (typeof host));
        assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
        assert(typeof port === 'number', 'Expected number, got ' + (typeof port));
        assert(Number.isInteger(port), 'Expected integer, got ' + port);
        assert(port > 0, 'Expected port > 0, got ' + port);
        assert(port < 65536, 'Expected port < 65536, got ' + port);
        assert(typeof timeout === 'number', 'Expected number, got ' + (typeof timeout));
        assert(timeout > 0, 'Expected timeout > 0, got ' + timeout);

        this.buffer = [];
    }

    public static buildSocket(host: string, port: number, timeout: number): Promise<Socket> {

        return new Promise((resolve, reject) => {
            const socket = new Socket(host, port, timeout);

            socket.socket = createConnection({ host, port }, () => resolve(socket));
    
            socket.socket.setTimeout(timeout, () => {
                socket.socket.destroy();
                reject(new Error(`Socket timeout (${host}:${port})`));
            });
    
            socket.socket.on('data', (data) => {
                socket.buffer.push(...data);
            });

            socket.socket.on('error', (error) => {
                socket.socket.end();
                reject(error);
            });
        });
        
    }

    public readByte(): Promise<number> {
        if (this.buffer.length > 0) return Promise.resolve(this.buffer.shift()!);

        return new Promise((resolve) => {
            let read = false;

            this.socket.on('data', () => {
                if (read) return;

                process.nextTick(() => {
                    if (this.buffer.length > 0) {
                        read = true;

                        return resolve(this.buffer.shift());
                    }
                });
            });
        });
    }

    public readBytes(length: number): Promise<number[]> {
        if (this.buffer.length >= length) {
            const value = this.buffer.slice(0, length);
            this.buffer.splice(0, length);
            return Promise.resolve(value);
        }

        return new Promise((resolve) => {
            let read = false;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dataHandler = this.socket.on('data', () => {
                if (read) return;

                process.nextTick(() => {
                    if (this.buffer.length >= length) {
                        read = true;

                        const value = this.buffer.slice(0, length);
                        this.buffer.splice(0, length);
                        return resolve(value);
                    }
                });
            });
        });
    }

    public writeByte(value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.write(Buffer.from([value]), (error) => {
                if (error) return reject(error);

                resolve();
            });
        });
    }

    public writeBytes(buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.write(buffer, (error) => {
                if (error) return reject(error);

                resolve();
            });
        });
    }

    public async readVarInt(): Promise<number> {
        let numRead = 0;
        let result = 0;
        let read, value;

        do {
            if (numRead >= 5) {
                throw new Error('VarInt exceeds data bounds');
            }

            read = await this.readByte();
            value = (read & 0b01111111);
            result |= (value << (7 * numRead));

            numRead++;

            if (numRead > 5) {
                throw new Error('VarInt is too big');
            }
        } while ((read & 0b10000000) != 0);

        return result;
    }

    public async readString(): Promise<string> {
        const length = await this.readVarInt();
        const data = await this.readBytes(length);

        let value = '';

        for (let i = 0; i < data.length; i++) {
            value += String.fromCharCode(data[i]);
        }

        return Promise.resolve(value);
    }

    public destroy(): void {
        this.socket.removeAllListeners();
        this.socket.destroy();
    }
}
