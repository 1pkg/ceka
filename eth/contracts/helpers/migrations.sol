pragma solidity 0.5.7;

import './ownable.sol';

/// @title used only for truffle
contract Migrations is Ownable {
    /// @dev truffle specific member
    uint public last_completed_migration;

    /// @dev truffle specific member
    function setCompleted(uint completed) public owner {
        last_completed_migration = completed;
    }

    /// @dev truffle specific member
    function upgrade(address new_address) public owner {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
