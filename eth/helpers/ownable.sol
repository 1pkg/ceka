pragma solidity 0.5.6;

/// @title ownable contract has an owner address, and provides basic authorization control
contract Ownable {
    /// @title current owner address
    address payable public cowner;
 
    /// @title initialze owner of the contract to the sender
    constructor() public {
        cowner = msg.sender;
    }
 
    /// @title check if called by any account other than the owner
    modifier owner() {
        require(msg.sender == cowner, "You're not the owner of this contract");
        _;
    }
 
    /**
     * @title allow the current owner to transfer control of the contract to a new owner
     * @param nowner address to transfer ownership to
     */
    function transfer(address payable nowner) public owner {
        require(nowner != address(0), "Invalid new owner address specified");      
        cowner = nowner;
    }
}