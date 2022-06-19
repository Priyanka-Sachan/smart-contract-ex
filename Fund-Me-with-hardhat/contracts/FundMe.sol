// As per solidity style guide : https://docs.soliditylang.org/en/v0.8.14/style-guide.html
// SPDX-License-Identifier:MIT

// Pragma
pragma solidity >=0.8.1 <0.9.0;

// Imports
import "./PriceConvertor.sol";
// For debugging
// import "hardhat/console.sol";

// Error codes
error FundMe__NotOwner();

// Inerfaces,Libraries

// Contracts
// Based on doxygen, can generate documentation using
// solc --userdoc --devodc FundMe.sol
/** @title A contract for crowd funding
 * @author Priyanka Sachan
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type declarations
    using PriceConvertor for uint256;

    // State variables
    uint256 public constant MIN_FUND_USD = 50 * 10**18;

    address[] private s_funders;
    mapping(address => uint256) public s_fundMapping;

    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier authenticate() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Adding arguemnts to get s_priceFeed according to network we are on
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        require(
            msg.value.getUsdValue(s_priceFeed) >= MIN_FUND_USD,
            "Didn't send enough fund!"
        );
        s_funders.push(msg.sender);
        s_fundMapping[msg.sender] += msg.value;
    }

    function withdraw() public authenticate {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_fundMapping[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Payment failed.");
    }

    // Gas Optimization
    function cheaperWithdraw() public authenticate {
        // Mappings cannot be on memory
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_fundMapping[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Payment failed.");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getFundMapping(address funderAddress)
        public
        view
        returns (uint256)
    {
        return s_fundMapping[funderAddress];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
