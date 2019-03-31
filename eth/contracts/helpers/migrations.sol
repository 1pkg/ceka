pragma solidity 0.5.7;

import './ownable.sol';

/// @title used only for truffle
contract Migrations is Ownable {
  uint public last_completed_migration;

  function setCompleted(uint completed) public owner {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public owner {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
