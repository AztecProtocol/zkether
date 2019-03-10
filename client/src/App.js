import React, { Component } from 'react';

import Block from './components/layout/Block/Block';
import FlexBox from './components/layout/FlexBox/FlexBox';
import BalanceRow from './components/BalanceRow';
import ExchangeRow from './components/ExchangeRow';
import Icon from './components/general/Icon/Icon';
import Text from './components/general/Text/Text';
import zkDaiIcon from './assets/aztec.png';
import daiIcon from './assets/dai.jpg';
import './App.css';

import ConfidentialToken from './contracts/ZKERC20.json';
import NoteRegistry from './contracts/NoteRegistry.json';
import Wrapper from './contracts/Wrapper.json';
import getWeb3 from './utils/getWeb3';
import { toWei } from 'web3-utils'

const joinSplitAddress = '0x666267C5a149e8076D5CC2e5B223b39f7e638355';

class App extends Component {
    state = {
        accounts: null,
        balances: {
            ether: 0,
            zkether: 0
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
                dai: '0',
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
        this.hideDai = this.hideDai.bind(this);
        this.sendZkdai = this.sendZkdai.bind(this);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, accounts, or contracts. Check console for details.`);
        console.error(error);
      }
    };
    
    hideDai = async () => {
        const {
            confidentialToken,
            noteRegistry,
            wrapper
        } = this.state.contracts;

        // Move money to WETH
        await wrapper.methods.deposit().send({ 
            from: this.state.accounts[0],
            value: toWei('1')
        });
        console.log('Moved money to WETH...');
        
        // Generate a bunch of random AZTEC notes
        const aztecAccount = {
            address: '0x957C322bB708A0F0fe6B994D51D27fC3f68beFFc',
            privateKey: '0x152fe2688c1524df8992262ddeecbbbda567c969e3e7ba89be136d99b2518f57',
            publicKey: '0x049b798cd1f549403716beaf138b108fe3d427db5feaf94979e75f5afb8782f11378df08335eaf01218d4abc185af0f4d3305ebc809ed5a81edc6d33ac5d78b498'
        };

        const myNote = window.aztec.note.create(aztecAccount.publicKey, 1);
        console.log('myNote', myNote);

        // Create dem proofs
        const myProof = window.aztec.proof.joinSplit.encodeJoinSplitTransaction({
            inputNotes: [],
            outputNotes: [myNote],
            senderAddress: aztecAccount.address,
            inputNoteOwners: [],
            publicOwner: aztecAccount.address,
            kPublic: -1,
            validatorAddress: joinSplitAddress,
        });

        // Generate proof outputs and hashes
        const proofOutput = window.aztec.abiEncoder.outputCoder.getProofOutput(myProof.expectedOutput, 0)
        const proofHash = window.aztec.abiEncoder.outputCoder.hashProofOutput(proofOutput);
 
        // Approve AZTEC spending
        await noteRegistry.methods.publicApprove(proofHash, 10).send({
            from: this.state.accounts[0],
        });
        
        // Move money from WETH to ZKERC20
        console.log('Making a confidential token transfer...');
        let receipt = confidentialToken.methods.confidentialTransfer(myProof.proofData).send({
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
          <Block
            padding="xxl l"
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
          <Block padding="xxl xl">
            <Block
              styleName="App-content"
              padding="xl"
              background="white"
              rounded="default"
              hasBorder
            >
              <BalanceRow
                icon={zkDaiIcon}
                name="zkDai"
                value={0.01}
                symbol="$"
                onSend={({ amount, address }) => console.log(amount, address)}
                allowToSend
              />
              <ExchangeRow
                isChangingDaiToZkdai={false}
                isChangingZkDaiToDai={false}
                onChangeDaiToZkdai={this.hideDai}
                onChangeZkDaiToDai={() => {}}
              />
              <BalanceRow
                icon={daiIcon}
                name="Dai"
                value={1.0}
                symbol="$"
              />
            </Block>
          </Block>
        </div>
      );
    }
}

export default App;
