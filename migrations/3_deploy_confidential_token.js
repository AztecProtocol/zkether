/* global artifacts */
const BN = require('bn.js');
const contractAddresses = require('../libs/@aztec/contract-addresses');

const Wrapper = artifacts.require('./Wrapper.sol');
const ConfidentialToken = artifacts.require('./ConfidentialToken.sol');

const XDAI_SIDECHAIN_ID = 100;
const ERC20_SCALING_FACTOR = new BN('100000000000000000', 10).toString(10);

module.exports = (deployer) => {
    // Cannot deploy locally because we need the ACE and the ERC20Mintable
    // If you want to do that, go to https://github.com/AztecProtocol/AZTEC/tree/master/packages/protocol
    if (deployer.network_id !== XDAI_SIDECHAIN_ID) {
        console.log('This tutorial only works with the xDai sidechain');
        return true;
    }
    if (!Wrapper.address) {
        console.log('Please deploy the Wrapper contract first');
        return true;
    }

    const aceAddress = contractAddresses.ace;
    const wrapperAddress = Wrapper.address;

    // Cocoa beans were used as money by Aztec people
    const name = 'Cocoa';

    // We're pairing the confidential token with an ERC20, so we cannot mint or burn within this contract
    const canMint = false;
    const canBurn = false;
    const canConvert = true;

    return deployer.deploy(
        ConfidentialToken,
        name,
        canMint,
        canBurn,
        canConvert,
        ERC20_SCALING_FACTOR,
        wrapperAddress,
        aceAddress
    );
};
