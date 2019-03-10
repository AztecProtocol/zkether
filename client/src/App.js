import React, { Component } from 'react';

import Block from './components/layout/Block/Block';
import FlexBox from './components/layout/FlexBox/FlexBox';
import BalanceRow from './components/BalanceRow';
import ExchangeRow from './components/ExchangeRow';
import Icon from './components/general/Icon/Icon';
import Text from './components/general/Text/Text';
import zkDaiIcon from './assets/aztec.png';
import daiIcon from './assets/ethereum.png';
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
        const myProof = {    
            proofData: '0x0000000000000000000000000000000000000000000000000000000000000000027e42a2b7abb32c0b3cfcfc04e20a0a600b4b24c3ccb1d4a70f2978fa17117f000000000000000000000000363f87d1580c6d4a0f765ae6e5cf1c579223deaf000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000000130644e72e131a029b85045b68181585d2833e84879b9709143e1f593f000000023a279dcffb85a11900f0238c932253ac090cab434a065b243912bc5fbdb02fe226ac6cc883277e62f636dce2ca9cc0f9de26caea2d9cddd36bb89acb5e183c12355f6162734c020dbf1b4539d74e5c39be269f8c6d8edae3e39df7fd1ebb7701f24a7207af9603b69ff68ced23d570323f38c7cfab2260ef1a90638f1e3c8e50eef3f5cdf4f4f1799df65a377408fbb0ed96c92a31118040590a972df73926300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000363f87d1580c6d4a0f765ae6e5cf1c579223deaf0000000000000000000000000000000000000000000000000000000000000081000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000021260fd14485e523840248d9fce3bf006b287c47917d9dce9748d174229625d08d01',
            expectedOutput: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000020100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000363f87d1580c6d4a0f765ae6e5cf1c579223deafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001210000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c1000000000000000000000000363f87d1580c6d4a0f765ae6e5cf1c579223deaf29547282843086dc49e2ba977f50be5b95777466ab238a90976348aa1d4bf9220000000000000000000000000000000000000000000000000000000000000061226ac6cc883277e62f636dce2ca9cc0f9de26caea2d9cddd36bb89acb5e183c19f24a7207af9603b69ff68ced23d570323f38c7cfab2260ef1a90638f1e3c8e5260fd14485e523840248d9fce3bf006b287c47917d9dce9748d174229625d08d01'
        };

        // Generate proof outputs and hashes
        const proofHash = '0xc1a5021017410f69c894424d3d3db9379e60bc7a71e18616dfa21ccbdbc60b6f';

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
                name="zkEther"
                value={0}
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
                name="Ether"
                value={250}
                symbol="$"
              />
            </Block>
          </Block>
        </div>
      );
    }
}

export default App;
