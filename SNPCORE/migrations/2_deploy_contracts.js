//var Paymaster=artifacts.require('NaivePaymaster');
var mainContract=artifacts.require('TrackRewarder');
var ERC20=artifacts.require('SNPTOKEN');
module.exports=function(deployer){
    deployer.deploy(ERC20).then(function(){
        return deployer.deploy(mainContract, ERC20.address)
    });
    
        
    
};
