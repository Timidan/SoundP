import React, { Component } from "react";
import "../App.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: "ipfs.infura.io", port: 5001, protocol:"https"})
const controller= new AbortController()

class ChooseSong extends Component {
    state = {
        buffer: null,
        fileCID: null,
        loading: null,
        cidCopied: false
    }
    
    captureFile = (e)=>{
        e.preventDefault();
        console.log('file captured')
        //process file for ipfs
        //first fetch file from event
        const userFile = e.target.files[0];
        const reader = new window.FileReader();
        
        reader.readAsArrayBuffer(userFile);
        reader.onloadend = () => {
            this.setState({
                buffer: Buffer(reader.result)
            })
            console.log(this.state.buffer);
           
        }

    }
    //https://ipfs.infura.io/ipfs/QmVbbYGaCoJa4rMgw41GkGPXQa8184ioLwcipmvb2D926f
    //push file to ipfs using file buffer
    onSubmit = async (e)=> {
        e.preventDefault();
        console.log('submitting form')
        if(this.state.buffer){
            try{
                this.setState({
                    loading: 'Please wait for CID....This might take a minute or 2.Ensure to copy it.'
                })
            
                const result = await ipfs.add(this.state.buffer)
                const fileCID = result.cid.string;
                console.log('result', result);
                this.setState({
                    fileCID
                })
                
            }
            catch(e){
                console.log('error', e)
            }
        
        } else{
            alert('choose a valid file');
        }

    }
    onCopy=(e)=> {
        this.setState({cidCopied: true}, () => {
            setTimeout( () => {
              this.setState({cidCopied: false})
          }, 2000)
          })
    }

    render(){
        let response;
        

        if(!this.state.fileCID){
            response= this.state.loading 
        }
        else{
            response= <div className="displayedCid">
            {this.state.fileCID}<img className="copy-icon" 
            src="https://cdn0.iconfinder.com/data/icons/user-interface-line-style-2/32/User_Interface_icon_line_style_32px_for_sale_copy__paste-512.png"
            >
            </img> </div> 
        }

    
        return(
            <div className="main-page">
                <h4 className="brandDescription">Choose a Song File</h4>
                <CopyToClipboard text={this.state.fileCID} onCopy={this.onCopy} >
                <p className="fileCID"> {response}
                {this.state.cidCopied && <small>copied</small> }
                </p>
                </CopyToClipboard>
                
                <form className="upload-form" onSubmit={this.onSubmit}>
    
                    <input type="file" 
                    accept=".mp3" 
                    id="file" className="file-input" 
                    size="60"
                    onChange={this.captureFile}/>

                    <button><i class="material-icons">
                        cloud_upload
                    </i> &nbsp;Upload </button>
    
                   
    
                </form>
            </div>
        )

    }

   
}

export default ChooseSong;