// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

// Importing interface class from npm repo
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor{

    function getConversionRate() internal view returns(uint256){
        // Access contract on rinkeby network using its contract address on that network & ABI/interface class from npm
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        // Here price in int no decimla -> weird value...
        // 8 decimal places used according to priceFeed.decimal()
        // Just for good computation
        return uint256(price*10**10);
    }

    function getUsdValue(uint256 _value) internal view returns(uint256){
        return (getConversionRate()*_value)/1e18;
    }
}