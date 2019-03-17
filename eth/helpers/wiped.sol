pragma solidity 0.5.6;

import "./ownable.sol";

/// @title contract that can be wiped out by owner
contract Wiped is Ownable {
    /// @title transfer all funds to the owner and wipe out the contract
    function wipe() public owner {
        require(canwipe(), "Invalid canwipe breaks"); 
        selfdestruct(cowner);
    }

    /// @title check that contract can be wiped out
    function canwipe() public returns(bool) {
        // can be wiped out anyway
        return true;
    }
}