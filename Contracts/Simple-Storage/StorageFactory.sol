// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

// Composibility
import "./SimpleStorage.sol";

contract StorageFactory{
    SimpleStorage[] public simpleStorages;

    function addSimpleStorage () public {
        simpleStorages.push(new SimpleStorage());
    }

    function setFavouriteNumber (uint256 _index,uint256 _allFavouriteNumber) public {
        // Deal with other contracts using
        // Address
        // & ABI-> Application Binary Interface
        simpleStorages[_index].setAllFavouriteNumber(_allFavouriteNumber);
    }

    function getFavouriteNumber (uint256 _index) public view returns (uint256) {
        return simpleStorages[_index].getAllFavouriteNumber();
        // OR since allFavouriteNumber is a public variable
        // return simpleStorages[_index].allFavouriteNumber();
    }
}