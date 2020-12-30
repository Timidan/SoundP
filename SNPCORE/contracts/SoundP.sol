// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.6.2;

//pragma experimental ABIEncoderV2;
//import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//import "../node_modules/@opengsn/gsn/contracts/BaseRelayRecipient.sol";
//import "../node_modules/@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
}}

contract TrackRewarder is SafeMath,ReentrancyGuard{




IERC20 private _token;
    address public owner;
    uint _bal;

event trackAdded(address indexed uploader,bytes32 songMeta,uint now);
event payed(address indexed beneficiary, uint256 amountPayed);
event uploaderAdded(address indexed newUploader);
constructor (IERC20 token) public {
    owner = msg.sender;
    _token = token;
}




struct track{
bytes32 metadata;
address  owner;
uint timeUploaded;
}

modifier onlyOwner{
    require(msg.sender == owner, "you are not the owner");
        _;
}

modifier notUploader(address target){
    require(Uploaders[target].active==false,"you are already an uploader");
    _;
}

modifier anUploader(address _targ){
    require(Uploaders[msg.sender].active==true,'you have not been activated to upload songs');
    _;
}

modifier notEmpty(address _targ){
    require(unclaimedTokens[msg.sender].earned>=1,"you do not have any tokens to redeem");
    _;
}




struct Uploader{
    uint _tracks;
    address _add;
    bool active;
    uint earned;
    bytes32[] buffers;
}


address[] public uploaders;
bytes32[] public metadatas;
bytes32[] songBuffers;

//mapping(uint=>Uploader) tokenBalance;
mapping(address=>Uploader) Uploaders;
mapping(address=>track) trackOwners;
mapping(bytes32=>track) TrackMetas;
mapping(address=>Uploader) unclaimedTokens;

function toDecimal(uint _tokens) internal pure returns(uint){
     uint decimalss = 18;
      uint  _totalSupplys = (_tokens)*10**uint(decimalss);
      return _totalSupplys;
}

function addUploader(address newUploader) public onlyOwner notUploader(newUploader) returns(address){
    Uploaders[newUploader]._add=newUploader;
    Uploaders[newUploader].active=true;
    
    uploaders.push(newUploader);
    emit uploaderAdded(newUploader);
    return newUploader;
    
}

function removeUploader(address uploader) public onlyOwner returns(address){
     Uploaders[uploader].active=false;
     
     
     
}


//allows an authorized uploader to upload songs
//songBuffer is the ipfs cid that will be returned in the frontend
//meta is a precalculated hash that will be stored on the contract
function addTrack(address uploader,bytes32 songBuffer) public anUploader(msg.sender) nonReentrant returns(bytes32 meta){
    meta = (keccak256 (abi.encodePacked (now ,uploader)));
    trackOwners[(msg.sender)].owner = uploader;
    TrackMetas[meta].metadata = meta;
    emit trackAdded (uploader,meta,now);
    metadatas.push(meta);
    Uploaders[msg.sender]._tracks++;
    unclaimedTokens[msg.sender].earned=safeAdd(unclaimedTokens[msg.sender].earned,toDecimal(1));
    Uploaders[msg.sender].buffers.push(songBuffer);
    return(meta);
   
}
    
    //internal function that allows the uploader to redeem his unclaimed tokens
    function redeem(address _artist) internal notEmpty(_artist) nonReentrant returns(bool){
        uint toSend=checkPendingTokens();
        _token.transfer(_artist,toSend);
         unclaimedTokens[msg.sender].earned=0;
         emit payed(_artist,toSend);
        
        
    }
    
    function checkPendingTokens() public view returns(uint){
        
        return unclaimedTokens[msg.sender].earned;
    }
    
    function remAllowance(address tokenOwner) public view returns(uint256){
      return  _token.allowance(tokenOwner,address(this));
    }
    
    function getTokens(address _to) public  returns(uint) {
        redeem(_to);
       
    }
    
   

  /*	function versionRecipient() external virtual view override returns (string memory) {
		return "1.0";
	}
   function getTrustedForwarder() public view override returns(address) {
		return trustedForwarder;
	}
    */
}

