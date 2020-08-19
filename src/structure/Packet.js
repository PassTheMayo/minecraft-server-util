class Packet {
	constructor() {
		this.data = [];
	}

	writeByte(...byte) {
		this.data.push(...byte);
	}

	writeVarInt(value) {
		do {
			let temp = value & 0b01111111;

			value >>>= 7;

			if (value != 0) {
				temp |= 0b10000000;
			}

			this.writeByte(temp);
		} while (value != 0);
	}

	writeString(string) {
		this.writeVarInt(string.length);

		for (let i = 0; i < string.length; i++) {
			this.writeByte(string.codePointAt(i));
		}
	}

	writeUnsignedShort(short) {
		const buf = Buffer.alloc(2);
		buf.writeUInt16BE(short, 0);

		this.writeByte(...buf);
	}

	finish() {
		const newPacket = new Packet();
		newPacket.writeVarInt(this.data.length);
		newPacket.writeByte(...this.data);

		return Buffer.from(newPacket.data);
	}
}

module.exports = Packet;