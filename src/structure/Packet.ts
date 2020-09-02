class Packet {
	private data: number[] = [];

	writeByte(...values: number[]): void {
		this.data.push(...values);
	}

	writeVarInt(value: number): void {
		do {
			let temp = value & 0b01111111;

			value >>>= 7;

			if (value != 0) {
				temp |= 0b10000000;
			}

			this.writeByte(temp);
		} while (value != 0);
	}

	writeString(value: string): void {
		this.writeVarInt(value.length);

		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}
	}

	writeUnsignedShort(value: number): void {
		this.writeByte((value >> 8) & 0xFF, value & 0xFF);
	}

	finish(): Buffer {
		const newPacket = new Packet();
		newPacket.writeVarInt(this.data.length);
		newPacket.writeByte(...this.data);

		return Buffer.from(newPacket.data);
	}
}

export default Packet;