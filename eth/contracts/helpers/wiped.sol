pragma solidity 0.5.7;

import "./ownable.sol";

/// @title contract that can be wiped out by owner
contract Wiped is Ownable {
    /// @dev emit on contract start
    event ewipe(uint256 ts);

    /// @dev transfer all funds to the owner and wipe out the contract
    function wipe() public owner {
        require(canwipe(), "Invalid flag breaks canwipe constraint"); 
        selfdestruct(cowner);
        emit ewipe(now);
    }

    /// @dev check that contract can be wiped out
    function canwipe() public returns(bool) {
        cowner = cowner; // to shut up warn
        // can be wiped out anyway
        return true;
    }
}