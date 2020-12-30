import React, { Component } from "react";
import "../App.css";


class Enroll extends Component {
  state = { 
      userAddress: null
  };

  handleUserAddress =(e)=> {
    this.setState({
      userAddress: e.target.value
    })
    
  }

  submitEnroll = (e)=> {
    e.preventDefault();
    this.props.enrollAdrress(this.state.userAddress)
  }

  render() {
    
    return (
      <div className="enroll"> 
        <form className="enroll-form form" onSubmit={this.submitEnroll}>
          <h3>Enroll Address</h3>

            <input type="text" 
            placeholder="address 0x00...."
            className="metaInput"
            onChange={this.handleUserAddress} required/>
            <button type="submit" className="form-button" disabled>Add Uploader</button>

        </form>
      
        
      </div>
    );
  }
}

export default Enroll;
