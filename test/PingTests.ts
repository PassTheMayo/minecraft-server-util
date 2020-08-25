/* eslint-disable @typescript-eslint/ban-ts-comment */
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ping, pingCallback } from '../src/index';
import { Response } from '../src/model/api';

chai.use(chaiAsPromised);

describe('Invalid Arguments', () => {

    it('Callback', (done) => {
        // @ts-ignore
        pingCallback(25565, (error, data) => {
            expect(error).to.not.be.null;
            expect(data).to.be.null;
            done();
        });
    });

    it('Promise', async () => {
        // @ts-ignore
        await expect(ping(25565)).to.be.rejected;
    });

});

describe('Invalid IP Address', () => {

    it('Callback', (done) => {
        pingCallback('a', (error, data) => {
            expect(error).to.not.be.null;
            expect(data).to.be.null;
            done();
        }, { port: 25565 });
    });

    it('Promise', async () => {
        
        await expect(ping('abc', { port: 25565 })).to.be.rejected;
    });

});

const servers = [
    'hub.mcs.gg',
    'mc.hypixel.net',
    'mccentral.org'
];

function verifyDataBody(server: string, data: Response) {

    expect(data.host).to.equal(server);
    expect(data.port).to.equal(25565);
    expect(data.version).to.be.a('string');
    expect(data.protocolVersion).to.be.a('number');
    expect(data.onlinePlayers).to.be.a('number');
    expect(data.maxPlayers).to.be.a('number');
    expect(data.samplePlayers).to.be.an('array');
    expect(data.descriptionText).to.be.a('string');
    if (data.favicon != null) expect(data.favicon).to.be.a('string');

    if (data.modList != null) {
        expect(data.modList).to.be.an.instanceOf(Array);
    }

    expect(data.onlinePlayers).to.be.gte(0);
    expect(data.maxPlayers).to.be.gte(0);
    
}

for (let i = 0; i < servers.length; i++) {

    describe(servers[i], () => {

        it('Ping Test - Callback', (done) => {

            pingCallback(servers[i], (error, data) => {
                expect(error).to.be.null;
                expect(data).to.not.be.null;
                verifyDataBody(servers[i], data!);
                done();
            });

        });

        it('Ping Test - Promise', (done) => {
            expect(ping(servers[i])
                .then((data) => {
                    verifyDataBody(servers[i], data);
                    done();
                })).to.not.be.rejected;
        });

        it('Ping Test - Callback - Port', (done) => {
            pingCallback(servers[i], (error, data) => {
                expect(error).to.be.null;
                expect(data).to.not.be.null;
                verifyDataBody(servers[i], data!);
                done();
            }, { port: 25565 });
        });

        it('Ping Test - Promise - Port', (done) => {
            expect(ping(servers[i], { port: 25565 })
                .then((data) => {
                    verifyDataBody(servers[i], data);
                    done();
                })).to.not.be.rejected;
        });

        it('Ping Test - Callback - Options', (done) => {
            pingCallback(servers[i], (error, data) => {
                expect(error).to.be.null;
                expect(data).to.not.be.null;
                verifyDataBody(servers[i], data!);
                done();
            }, { protocolVersion: 47 });
        });

        it('Ping Test - Promise - Options', (done) => {
            expect(ping(servers[i], { protocolVersion: 47 })
                .then((data) => {
                    verifyDataBody(servers[i], data);
                    done();
                })).to.not.be.rejected;
        });

        it('Ping Test - Callback - Options - Port', (done) => {
            pingCallback(servers[i], (error, data) => {
                expect(error).to.be.null;
                expect(data).to.not.be.null;
                verifyDataBody(servers[i], data!);
                done();
            }, { port: 25565, protocolVersion: 47 });
        });

        it('Ping Test - Promise - Options - Port', (done) => {
            expect(ping(servers[i], { port: 25565, protocolVersion: 47 })
                .then((data) => {
                    verifyDataBody(servers[i], data);
                    done();
                })).to.not.be.rejected;
        });

    });

}