// SPDX-License-Identifier:MIT
pragma solidity >=0.8.1 <0.9.0;

contract SimpleStorage{

    uint256 public allFavouriteNumber;

    struct Person{
        string name;
        uint256 favouriteNumber;
    }

    Person[] public people;

    mapping(string => uint256) public peopleMapping;

    // public/virtual...?
    // function name (<parameter types>) {internal|external} [pure|view|payable] [returns (<return types>)]
    function setAllFavouriteNumber (uint256 _allFavouriteNumber) public virtual{
        allFavouriteNumber=_allFavouriteNumber;
    }

    function getAllFavouriteNumber () public view returns (uint256){
        return allFavouriteNumber;
    }

    // Calldata - Store temporarily , don't change 
    // Memory - Store temporarily , change
    // Storage - Store permanentaly , change  
    function addPerson (string calldata _name,uint256 _favouriteNumber) public{
        people.push(Person({name:_name,favouriteNumber:_favouriteNumber}));
        peopleMapping[_name]=_favouriteNumber;
    }

    // View - Function doesn't change state
    function getFavouriteNumberByName(string calldata _name) public view returns (uint256){
        return peopleMapping[_name];
    }
}


