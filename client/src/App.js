import React, { Component } from 'react';

import Block from './components/layout/Block/Block';
import FlexBox from './components/layout/FlexBox/FlexBox';
import BalanceRow from './components/BalanceRow';
import ExchangeRow from './components/ExchangeRow';
import Icon from './components/general/Icon/Icon';
import Text from './components/general/Text/Text';
import zkdaiIcon from './assets/aztec.png';
import zdaiIcon from './assets/xdai.jpg';
import './App.css';

import ConfidentialToken from './contracts/ConfidentialToken.json';
import NoteRegistry from './contracts/NoteRegistry.json';
import Wrapper from './contracts/Wrapper.json';
import getWeb3 from './utils/getWeb3';

import aztec from './aztec.bundle.js';
import { toWei } from 'web3-utils'

class App extends Component {
    state = { 
        accounts: null,
        balances: {
            xdai: 0,
            zkdai: 0
        },
        contracts: {
            confidentialToken: null,
            noteRegistry: null,
            wrapper: null
        },
        keys: {
            viewing: [],
            spending: []
        },
        web3: null
    };

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instances.
        const networkId = await web3.eth.net.getId();
        let deployedNetwork = ConfidentialToken.networks[networkId];
        const confidentialToken = new web3.eth.Contract(
            ConfidentialToken.abi,
            deployedNetwork && deployedNetwork.address,
        );
        deployedNetwork = Wrapper.networks[networkId];
        const wrapper = new web3.eth.Contract(
            Wrapper.abi,
            deployedNetwork && deployedNetwork.address,
        );
        const noteRegistryAddress = await confidentialToken.methods.noteRegistry().call();
        const noteRegistry = new web3.eth.Contract(
            NoteRegistry.abi,
            noteRegistryAddress
        );
  
        // Set web3, accounts, contracts etc.
        this.setState({ 
            accounts: accounts,
            balances: {
                xdai: '0',
                zkdai: '0'
            },
            contracts: {
                confidentialToken: confidentialToken,
                noteRegistry: noteRegistry,
                wrapper: wrapper
            },
            keys: {
                viewing: [],
                spending: []
            },
            web3: web3
        });

        // Set bindings
        this.hideXdai = this.hideXdai.bind(this);
        this.sendZkdai = this.sendZkdai.bind(this);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, accounts, or contracts. Check console for details.`);
        console.error(error);
      }
    };
    
    hideXdai = async () => {
        const {
            confidentialToken,
            noteRegistry,
            wrapper
        } = this.state.contracts;
        console.log('wrapper.options.address', wrapper.options.address);
        process.exit(0);

        // Move money to WXDAI
        await wrapper.methods.deposit().send({ 
            from: this.state.accounts[0],
            value: toWei('0.01')
        });
        console.log('Moved money to WXDAI...');

        // Generate a bunch of random AZTEC notes
        const aztecAccount = {
            address: '0x957C322bB708A0F0fe6B994D51D27fC3f68beFFc',
            privateKey: '0x152fe2688c1524df8992262ddeecbbbda567c969e3e7ba89be136d99b2518f57',
            publicKey: '0x9b798cd1f549403716beaf138b108fe3d427db5feaf94979e75f5afb8782f11378df08335eaf01218d4abc185af0f4d3305ebc809ed5a81edc6d33ac5d78b498'
        };
        
        const note = aztec.note.create(aztecAccount.publicKey, 1);
        console.log('note', note);
        process.exit(0);

        // Create dem proofs
        const proof = aztec.proof.joinSplit.encodeJoinSplitTransaction({
            inputNotes: [],
            outputNotes: [note],
            senderAddress: aztecAccount.address,
            inputNoteOwners: [],
            publicOwner: aztecAccount.address,
            kPublic: -1,
            aztecAddress: aztecAccount.options.address,
        });

        // Generate proof outputs and hashes
        const proofOutput = aztec.abiEncoder.outputCoder.getProofOutput(proof.expectedOutput, 0)
        const proofHash = aztec.abiEncoder.outputCoder.hashProofOutput(proofOutput);
 
        // Approve AZTEC spending
        await noteRegistry.methods.publicApprove(proofHash, 10).send({
            from: this.state.accounts[0],
        });
        
        // Move money from WXDAI to ZKERC20
        console.log('Making a confidential token transfer...');
        let receipt = confidentialToken.methods.confidentialTransfer(proof.proofData).send({
            from: this.state.accounts[0]
        });
        console.log('Mined confidential token transfer! receipt = ', JSON.stringify(receipt));
    };
    
    sendZkdai = async () => {
        console.log('Bar');

        // Approve AZTEC to spend notes
        
        // Generate dem notes buddy
    };

    render() {
        return (
        <div className="App">
            <Block padding="xxl xl">
            <Block
                styleName="App-content"
                padding="xl"
                background="white"
                rounded="default"
                hasBorder
            >
                <BalanceRow
                icon={zkdaiIcon}
                name="zkDai"
                value={"$" + this.state.zkdai}
                />
                <ExchangeRow
                isChangingXDaiToZkdai={true}
                isChangingZkDaiToXdai={false}
                onChangeXDaiToZkdai={this.hideXdai}
                onChangeZkDaiToXdai={() => {}}
                />
                <BalanceRow
                icon={zdaiIcon}
                name="xDai"
                value={"$" + this.state.xdai}
                />
            </Block>
            </Block>
            <Block
            styleName="disclaimer"
            padding="xl l"
            >
            <FlexBox
                align="center"
                valign="center"
            >
                <Block right="s">
                <Icon
                    name="warning"
                    size="l"
                    color="yellow"
                />
                </Block>
                <Text
                text="Users may lose all of their money"
                color="white"
                />
            </FlexBox>
            </Block>
        </div>
        );
    }
}

export default App;
