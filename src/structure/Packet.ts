import TCPSocket from './TCPSocket';

class Packet {
	public data: number[] = [];

	// Automatically reads the packet length from the TCP stream and converts it into a packet
	// Only works with the netty rewrite (1.7+)
	static async from(socket: TCPSocket): Promise<Packet> {
		const length = await socket.readVarInt();
		if (length < 1) {
			return new Packet();
		}

		const data = await socket.readBytes(length);

		const packet = new Packet();
		packet.data = data;
		return packet;
	}

	// Reads a byte (uint8) from the packet data
	readByte(): number {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.shift() || 0;
	}

	// Reads multiple bytes (uint[]) from the packet data
	readBytes(length: number): number[] {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.splice(0, length);
	}

	// Writes multiple bytes (uint8[]) to the packet data
	writeByte(...values: number[]): void {
		this.data.push(...values);
	}

	// Reads a short (int16) from the packet data
	readShortBE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShort() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16BE();
	}

	// Writes a short (int16) to the packet data
	writeShortBE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16BE(value);
		this.writeByte(...buf);
	}

	// Reads a short (int16, little endian) from the packet data
	readShortLE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShortLE() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16LE();
	}

	// Writes a short (int16, little endian) from the packet data
	writeShortLE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16LE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned short (int16) from the packet data
	readUShortBE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShort() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readUInt16BE();
	}

	// Writes an unsigned short (int16) to the packet data
	writeUShortBE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeUInt16BE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned short (int16, little endian) from the packet data
	readUShortLE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readUShortLE() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readUInt16LE();
	}

	// Writes an unsigned short (int16, little endian) from the packet data
	writeUShortLE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeUInt16LE(value);
		this.writeByte(...buf);
	}

	// Reads an int (int32) from the packet data
	readIntBE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32BE();
	}

	// Writes an int (int32) to the packet data
	writeIntBE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32BE(value);
		this.writeByte(...buf);
	}

	// Reads an int (int32, little endian) from the packet data
	readIntLE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32LE();
	}

	// Writes an int (int32, little endian) to the packet data
	writeIntLE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32LE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned int (int32) from the packet data
	readUIntBE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readUInt32BE();
	}

	// Writes an unsigned int (int32) to the packet data
	writeUIntBE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeUInt32BE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned int (int32, little endian) from the packet data
	readUIntLE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readUInt32LE();
	}

	// Writes an unsigned int (int32, little endian) to the packet data
	writeUIntLE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeUInt32LE(value);
		this.writeByte(...buf);
	}

	// Reads a long (int64) from the packet data
	readLongBE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64BE();
	}

	// Writes a long (int64) to the packet data
	writeLongBE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64BE(value);
		this.writeByte(...buf);
	}

	// Reads a long (int64, little endian) from the packet data
	readLongLE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64LE();
	}

	// Writes a long (int64, little endian) to the packet data
	writeLongLE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64LE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned long (int64) from the packet data
	readULongBE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigUInt64BE();
	}

	// Writes an unsigned long (int64) to the packet data
	writeULongBE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigUInt64BE(value);
		this.writeByte(...buf);
	}

	// Reads an unsigned long (int64, little endian) from the packet data
	readULongLE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigUInt64LE();
	}

	// Writes an unsigned long (int64, little endian) to the packet data
	writeULongLE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigUInt64LE(value);
		this.writeByte(...buf);
	}

	// Reads a varint (variable sized integer) from the packet data
	readVarInt(): number {
		let numRead = 0;
		let result = 0;
		let read: number, value: number;

		do {
			if (numRead > 4) { throw new Error('VarInt exceeds data bounds'); }

			read = this.readByte();
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;

			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
	}

	// Writes a varint (variable sized integer) to the packet data
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

	// Reads a string from the packet data
	readString(): string {
		const length = this.readVarInt();

		return String.fromCodePoint(...this.data.splice(0, length));
	}

	// Writes a string to the packet data
	writeString(value: string, writeLength: boolean): void {
		if (writeLength) {
			this.writeVarInt(value.length);
		}

		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}
	}

	// Reads a string (NULL terminated) from the packet data
	readStringNT(): string {
		let read, result = '';

		while ((read = this.readByte()) !== 0) {
			result += String.fromCodePoint(read);
		}

		return result;
	}

	// Writes a string (NULL terminated) to the packet data
	writeStringNT(value: string): void {
		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}

		this.writeByte(0);
	}
}

export default Packet;