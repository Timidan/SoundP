import React from 'react';
import "../App.css";

const Nav = (props)=> {

    return(
        <div className="navBar">
            <img src={props.img} className="soundP-logo"/>
            <h2 className="brandName">SOUNDP</h2>
            <span className="unClaimedToken">UnClaimedTokens: <span className="token">{props.unClaimedToken} SNP</span></span>
            <span className="TokenBalance">TokenBalance: <span className="balance">{props.tokenBalance} SNP</span></span>
            <span className="userAddress">Your address: <span className="address">{props.userAccount} </span></span>    
        </div>
    )
}

export default Nav;