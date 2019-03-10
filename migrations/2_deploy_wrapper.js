/* global artifacts */
const web3Utils = require('web3-utils');

const Wrapper = artifacts.require('./Wrapper.sol');

module.exports = (deployer, network, accounts) => {
    deployer.deploy(Wrapper).then(async (wrapper) => {
        await wrapper.deposit({
            from: accounts[0],
            value: web3Utils.toWei('10', 'ether'),
        });
    });
};
