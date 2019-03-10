require('dotenv').config();
const { toWei, toHex } = require('web3-utils');
const HDWalletProvider = require('truffle-hdwallet-provider');

// You must specify MNEMONIC and INFURA_API_KEY in your .env file
function createProvider(network) {
    if (!process.env.MNEMONIC) {
        console.log('Please set either your PRIVATE_KEY or MNEMONIC in a .env file');
        process.exit(1);
    }
    if (!process.env.INFURA_API_KEY) {
        console.log('Please set your INFURA_API_KEY');
        process.exit(1);
    }
    return () => {
        return new HDWalletProvider(
            process.env.PRIVATE_KEY || process.env.MNEMONIC,
            `https://${network}.infura.io/v3/` + process.env.INFURA_API_KEY
        );
    };
}

module.exports = {
    compilers: {
        solc: {
            version: '0.5.5',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    },
    mocha: {
        enableTimeouts: false,
        reporter: 'spec',
    },
    networks: {
        development: {
            host: '127.0.0.1',
            gas: 4700000,
            gasPrice: toHex(toWei('1', 'gwei')),
            network_id: '*', // eslint-disable-line camelcase
            port: 8545,
        },
        rinkeby: {
            provider: createProvider('rinkeby'),
            gas: 4700000,
            gasPrice: toHex(toWei('10', 'gwei')),
            network_id: '4',
        },
        xdai: {
            provider: () => { return new HDWalletProvider(process.env.MNEMONIC, 'https://dai.poa.network'); },
            gas: 7000000,
            network_id: 100,
        },
    },
};
