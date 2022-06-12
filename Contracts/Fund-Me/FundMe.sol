// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

// Importing library
import "./PriceConvertor.sol";

error NotOwner();

contract FundMe {

    // Using library
    using PriceConvertor for uint256;

    // 10**18 for correct decimal computation
    // Gas Optimization : Constant - Initialization at complile time
    uint256 public constant MIN_FUND_USD=50*10 **18; 

    address[] public funders;
    mapping (address=>uint256) public fundMapping;

    // Gas Optimization : Immutable 
    address public immutable i_owner;

    constructor(){
        i_owner=msg.sender;
    }

    // Payable keyword to transact values
    function fund() public payable{
        // Require checks the conditions, terminates and reverts computation done if condition wrong.
        require(msg.value.getUsdValue()>=MIN_FUND_USD,"Didn't send enough fund!");
        funders.push(msg.sender);
        fundMapping[msg.sender]+=msg.value;
    }

    function withdraw() public authenticate{

        // Replaced with modifier authenticate
        // require(msg.sender==i_owner,"You are not i_owner.");

        for(uint256 funderIndex=0;funderIndex<funders.length;funderIndex++){
            address funder=funders[funderIndex];
            fundMapping[funder]=0;
        }
        // Reset the array
        funders=new address[](0);

        // Withdraw the funds

        // Transfer (2300 gas, throws error & reverts) - transfer all balance of this address (contract) to the one calling the function.
        // payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);

        // Send (2300 gas, returns bool)
        // bool sendSuccess=payable(msg.sender).send(address(this).balance);
        // require(sendSuccess,"Payment failed.");

        // Call (forward all gas or set gas, returns bool) - Lower level function
        (bool callSuccess,bytes memory dataReturned)=payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"Payment failed.");

    }

    modifier authenticate(){
        require(msg.sender==i_owner,"You are not owner.");
        // Gas Optimization
        // if(msg.sender!=i_owner){
        //     revert NotOwner();
        // }
        _;
    }

    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
