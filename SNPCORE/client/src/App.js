import React, { Component } from "react";
import TrackRewarderABI from "./contracts/TrackRewarder.json";
import SNPTokenABI from "./contracts/SNPTOKEN.json";
import getWeb3 from "./getWeb3";
import ChooseSong from './Component/ChooseSong';
import Nav from './Component/Nav';
import AddTrack from './Component/AddTrack';
import Enroll from './Component/Enroll';
import ClaimToken from './Component/ClaimToken';
import classNames from 'classnames';
import Buffers from './Component/BuffersList';
import Logo from './soundP-logo.jpg';
import bs58 from 'bs58';

import "./App.css";



class App extends Component {
  state = { 
    storageValue: 0,
     web3: null,
     accounts: null, 
     contract: null, 
     snpToken: null,
     userAccount:null,
     currentInterface: 'enroll',
     unClaimedToken: null,
     tokenBalance: null,
     buffers: []
    };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const userAccount = accounts[0];
      this.setState({
        userAccount
      })

      const TrackRewarderAddress = '0xF3C182514f320ae484AF1ceBFC6AD7EAA9D169C0';
       //an instance of trackrewarder
      const myContractInstance = new web3.eth.Contract(TrackRewarderABI, TrackRewarderAddress);
      

      //an instance of snptoken
      const snpAddress = '0xa74C32F9Ab9462e140068aDC104eEc9a80E48a00';
      const tokenContract = new web3.eth.Contract(SNPTokenABI, snpAddress);
      const tokenBal = await tokenContract.methods.balanceOf(this.state.userAccount).call();
      const actualTokenBal = web3.utils.fromWei(tokenBal);
      console.log(this.state.userAccount)
      

      // Set web3, accounts, and contract to the state, and instantly load tokenBalance
      this.setState({ web3, accounts,userAccount, contract: myContractInstance, tokenBalance: actualTokenBal}, this.unClaimedTokenHandler)

      
      
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //function to check unclaimed token
  //loads upon 
  unClaimedTokenHandler = async () => {
    
    
    const unClaimedToken = await this.state.contract.methods.checkPendingTokens().call({
      from: this.state.userAccount
    });
    const unClaimedTk = this.state.web3.utils.fromWei(unClaimedToken, 'ether')
    // Update state with the result.
    this.setState({ unClaimedToken: unClaimedTk});
  };

  //function to check register address

  registerAddressHandler = async (addressEnroll)=> {
    try{
      await this.state.contract.methods.addUploader(addressEnroll).send({
      });
    }
    catch(error){
      console.log(error)
    }
    
  }
  //function to convert ipfs CID to bytes32
  getBytes32FromIpfsHash(CID) {
    return "0x"+bs58.decode(CID).slice(2).toString('hex')
  }

  addTrackHandler = async (uploaderAddress, CID) => {
    const bytes32Hash = this.getBytes32FromIpfsHash(CID);
    try {
      await this.state.contract.methods.addTrack(uploaderAddress, bytes32Hash).send({
        from: this.state.userAccount
      })
      alert('Track successfully added')
    }catch(error){
      alert('something doesnt seem right')
      console.error(error);
    }
  
  }
 


  claimTokenHandler = async(addressTo)=> {
    try{
     await this.state.contract.methods.getTokens(addressTo).send({
      from: this.state.userAccount
    })
      
      alert('Token claimed, check your balance')
    }
    catch(error){
      alert('something doesnt seem right')
      console.error(error);
    }
  }

  buffersListHandler = async(e)=> {
    const buffersResult = await this.state.contract.methods.checkMyBuffers().call({
      from: this.state.userAccount
    });

    this.setState({
      buffers: buffersResult
    })
    
  
  } 
  
 

  

  
  


  



  render() {
    // displaing interface conditionally
    let currentInterface;
   
    if(this.state.currentInterface === 'enroll'){
      currentInterface = < Enroll
      enrollAdrress={this.registerAddressHandler}/>
    }
    else if(this.state.currentInterface === 'choose song'){
      currentInterface = < ChooseSong />
    }
    else if(this.state.currentInterface === 'add track'){
      currentInterface = < AddTrack 
      addTrack={this.addTrackHandler}
      userAddress={this.state.userAccount}/>
      
    }
    else if(this.state.currentInterface === 'buffers'){
      currentInterface = <Buffers 
      buffers={this.state.buffers}/>
    }
    else{
      currentInterface = < ClaimToken 
      claim={this.claimTokenHandler}
      />
      
    }

    //styling button conditionally 
    const activeButton1 = classNames('switchBtn',{
      'activeBtn': this.state.currentInterface === 'enroll'
    })
    const activeButton2 = classNames('switchBtn', {
      'activeBtn': this.state.currentInterface === 'choose song'
    })
    const activeButton3 = classNames('switchBtn', {
      'activeBtn': this.state.currentInterface === 'add track'
    })
    const activeButton4 = classNames('switchBtn', {
      'activeBtn': this.state.currentInterface === 'claim token'
    })

    const activeButton5 = classNames('switchBtn', {
      'activeBtn': this.state.currentInterface === 'buffers'
    })


    
    
    return (
      <div className="App">
        <Nav img={Logo} userAccount={this.state.userAccount} 
        unClaimedToken={this.state.unClaimedToken}
        tokenBalance={this.state.tokenBalance}/> 
        <div className="switchForm-btns">
          <button className={activeButton1}
          onClick={(e)=> {
            this.setState({
              currentInterface: 'enroll'
            })
          }}>Enroll Address</button>
          <button className={activeButton2}
          onClick={(e)=> {
            this.setState({
              currentInterface: 'choose song'
            })
          }}>Upload Song-Get CID</button>
          <button className={activeButton3}
          onClick={(e)=> {
            this.setState({
              currentInterface: 'add track'
            })
          }}>Add Track</button>
          <button className={activeButton4}
          onClick={(e)=> {
            this.setState({
              currentInterface: 'claim token'
            })
          }}>Redeem Tokens</button>

        <button className={activeButton5}
          onClick={(e)=> {
            this.setState({
              currentInterface: 'buffers'
            });
            this.buffersListHandler()

          }} >My Song CIDs</button>

          
        </div>
        
        {currentInterface} 
        
        
      </div>
    );
  }
}

export default App;
