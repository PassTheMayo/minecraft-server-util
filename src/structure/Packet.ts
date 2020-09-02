class Packet {
	public data: number[] = [];

	writeByte(...values: number[]): void {
		this.data.push(...values);
	}

	writeShort(value: number): void {
		this.writeByte((value >> 8) & 0xFF, value & 0xFF);
	}

	writeInt(value: number): void {
		this.writeByte((value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF);
	}

	writeLong(value: number): void {
		this.writeByte((value >> 56) & 0xFF, (value >> 48) & 0xFF, (value >> 40) & 0xFF, (value >> 32) & 0xFF, (value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF);
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

	writeString(value: string, writeLength: boolean): void {
		if (writeLength) this.writeVarInt(value.length);

		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}
	}
}

export default Packet;