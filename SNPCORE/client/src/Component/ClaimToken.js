import React, { Component } from "react";
import "../App.css";


class ClaimToken extends Component {
  state = { 
      userAddress: null
  };
  handleAddress = (e)=> {
    this.setState({
      userAddress: e.target.value
    }) 
  }
  handleSubmit=(e)=> {
    e.preventDefault();
    this.props.claim(this.state.userAddress)
  }

  render() {
    
    return (
      <div className="enroll"> 
        <form className="claimToken-form form" onSubmit={this.handleSubmit}>
          <h3>Claim Token</h3>

            <input type="text" 
            placeholder="address 0x00...."
            className="metaInput"
            onChange={this.handleAddress}/>
            <button type="submit" className="form-button">Claim Token</button>

        </form>
      
        
      </div>
    );
  }
}

export default ClaimToken;