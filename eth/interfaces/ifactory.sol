pragma solidity 0.5.7;

import "./iceka.sol";

/// @title abstract factory interface
interface IFactory {
    /**
     * @title create ceka instance depends on name preset
     * @param name name of preset
     * @return ickea instance
     */
    function create(bytes32 name) external returns(ICEKA);

    /**
     * @param name name of preset
     * @param bool collect only anctive contracts
     * @return ickea[] instances
     */
    function get(bytes4 name, bool active) external returns(ICEKA[] memory);
}