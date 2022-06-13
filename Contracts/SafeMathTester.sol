// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract SafeMathTester{
    uint8 public bigNumber=255;

    function add() public{
        // In <0.8.0 , bigNumber 255+1 -> 0
        // From 0.8.0, bigNumber 255+1 -> error
        // bigNumber=bigNumber+1;
        // To get previous behavior (unchecked-> which saves gas), use
        unchecked{bigNumber=bigNumber+1;}
    }
}