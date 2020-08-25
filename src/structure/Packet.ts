export class Packet {

    private data: number[];

    constructor() {
        this.data = [];
    }

    public writeByte(...byte: number[]): void {
        this.data.push(...byte);
    }

    public writeVarInt(value: number): void {
        do {
            let temp = value & 0b01111111;

            value >>>= 7;

            if (value != 0) {
                temp |= 0b10000000;
            }

            this.writeByte(temp);
        } while (value != 0);
    }

    public writeString(string: string): void {
        this.writeVarInt(string.length);

        for (let i = 0; i < string.length; i++) {
            this.writeByte(string.codePointAt(i)!);
        }
    }

    public writeUnsignedShort(short: number): void {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(short, 0);

        this.writeByte(...buf);
    }

    public finish(): Buffer {
        const newPacket = new Packet();
        newPacket.writeVarInt(this.data.length);
        newPacket.writeByte(...this.data);

        return Buffer.from(newPacket.data);
    }
	
}