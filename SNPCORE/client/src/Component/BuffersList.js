import React from 'react';
import "../App.css";
import bs58 from 'bs58';


const BuffersList = (props) =>{
  var hashStr;
  const buffers = props.buffers;
  const buffersList = buffers.map(buffer => {
    // Return base58 encoded ipfs hash from bytes32 hex string,

  function ipfsFromBytes32(buffer) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + buffer.slice(2)
  const hashBytes = Buffer.from(hashHex, "hex")
  hashStr = bs58.encode(hashBytes)
  return hashStr
}

ipfsFromBytes32(buffer);

    return (
     
        <a className="buffer-link"
        href={'https://ipfs.io/ipfs/'+hashStr} target="_blank">{'https://ipfs.io/ipfs/'+hashStr}
        </a>
    )
  })
  

  return(
    <div className="buffers-list">
        {buffersList}
    </div>
  )

}

export default BuffersList;