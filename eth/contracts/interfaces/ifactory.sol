pragma solidity 0.5.7;

import "./iceka.sol";

/// @title abstract factory interface
interface IFactory {
    /**
     * @dev create ceka instance depends on name preset
     * @param name name of preset
     * @return ickea instance
     */
    function create(string calldata name) external returns(ICEKA);

    /**
     * @dev return ceka instances created before
     * @param name name of preset
     * @param active collect only anctive contracts
     * @return ickea[] instances
     */
    function get(string calldata name, bool active) external returns(ICEKA[] memory);
}