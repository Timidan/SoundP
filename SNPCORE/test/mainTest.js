const {
    sha3_256
} = require("js-sha3");
const {
    equal
} = require("assert");

const rewarder = artifacts.require("TrackRewarder");
const truffleAssert = require('truffle-assertions');
const assert = require("chai").assert;
const {expectRevert}=require('@openzeppelin/test-helpers');
const { expect } = require("chai");



let timestamp;
let blockNum;
let block;
const addr = "0x52cb68556dcD235153eA6ED31270dbb3F0F19daB";
const sampleHash= "0xdd365b8b15d5d78ec041b851b68c8b985bee78bee0b87c4acf261024d8beabab";
contract('TrackRewarder', (accounts) => {

it('should revert if not activated to upload songs', async function () {
    const rewardInstance = await rewarder.deployed();
await expectRevert(
    rewardInstance.addTrack(addr,sampleHash, {from: accounts[1]}), 'you have not been activated to upload songs'
);
});

it ('should approve a song uploader only by the admin', async () => {
const rewardInstance=await rewarder.deployed();
const newUploaders=await rewardInstance.addUploader(accounts[0]);
truffleAssert.eventEmitted(newUploaders, 'uploaderAdded', (ev) => {
            return ev.newUploader===accounts[0];
        });

});

    it('should return track metadata given uploader address', async () => {
        blockNum = await web3.eth.getBlockNumber();
        block = await web3.eth.getBlock(blockNum);
        timestamp = block['timestamp'];
        var hash = web3.utils.soliditySha3({
            type: 'uint',
            value: timestamp
        }, {
            type: 'address',
            value: addr
        });
        const rewardInstance = await rewarder.deployed();
        const metadata = await rewardInstance.addTrack(addr,sampleHash,{from: accounts[0]},);
       

        truffleAssert.eventEmitted(metadata, 'trackAdded', (ev) => {
            return ev.uploader === addr && ev.songMeta === hash;
        });

    });
it ('should increment uploader token by 1 after successful upload', async() => {
const rewardInstance= await rewarder.deployed();
const bal=await rewardInstance.checkPendingTokens({from: accounts[0]});
expect((await rewardInstance.checkPendingTokens()).toString()).to.equal('1000000000000000000');
});

});