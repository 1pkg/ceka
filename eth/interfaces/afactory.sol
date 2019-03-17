pragma solidity 0.5.6;

import "./aceka.sol";

/// @title abstract factory interface
interface AFactory {
    /**
     * @title create ceka instance depends on name preset
     * @param name name preset
     * @return ackea instance
     */
    function create(bytes32 name) external returns(ACEKA);
}