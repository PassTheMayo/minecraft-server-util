class Packet {
	constructor() {
		this.data = [];
	}

	writeByte(...byte) {
		this.data.push(...byte);
	}

	readVarInt(offset = 0) {
		let numRead = 0;
		let result = 0;
		let read, value;

		do {
			if (numRead + offset >= this.data.length) throw new Error('VarInt exceeds data bounds');

			read = this.data[numRead + offset];
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;
			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
	}

	readVarIntSplice() {
		let numRead = 0;
		let result = 0;
		let read, value;

		do {
			read = this.data.splice(0, 1)[0];
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;
			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
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