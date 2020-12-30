import React, { Component } from "react";
import "../App.css";



class AddTrack extends Component {
  state = { 
    userAddress: this.props.userAddress,
    CID: null
   };

   handleAddress = (e)=> {
      this.setState({
        userAddress: e.target.value
      })
      
   }

   handleCID = (e)=> {
    this.setState({
      CID: e.target.value
    })
    
 }

 handleSubmit = (e)=> {
   e.preventDefault();
   this.props.addTrack(this.state.userAddress, this.state.CID);
   
 }

  render() {
    
    return (
      <div className="addTrack"> 
        <form className="addTrackForm form" onSubmit={this.handleSubmit}>
          <h3>Add Track</h3>

            <input type="text" 
            placeholder="address 0x00...."
            className="addTrackInput"
            onChange={this.handleAddress} required value={this.state.userAddress}/>
            <input type="text" 
            placeholder="Input the CID you copied QmVbbYG......"
            className="addTrackInput"
            onChange={this.handleCID} required/>
            <button type="submit" className="form-button addTrackSubmit">Add Track</button>

        </form>
      
        
      </div>
    );
  }
}

export default AddTrack;
