// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

import "./SimpleStorage.sol";

// Inheritance
contract ExtraStorage is SimpleStorage{
    
    // Override virtual functions
    function setAllFavouriteNumber (uint256 _allFavouriteNumber) public override{
        allFavouriteNumber=_allFavouriteNumber+5;
    }
}