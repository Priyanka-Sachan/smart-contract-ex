// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getConversionRate(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        // Access contract on rinkeby network using its contract address on that network & ABI/interface class from npm
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        return uint256(price * 10**10);
    }

    function getUsdValue(uint256 _value, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        return (getConversionRate(priceFeed) * _value) / 1e18;
    }
}
