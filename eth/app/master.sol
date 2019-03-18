pragma solidity 0.5.6;

import "./../interfaces/afactory.sol";
import "./../helpers/wiped.sol";
import "./ceka.sol";

/**
 * @title master contract of whole app controls contract creation
 * @inheritdoc
 */
contract Master is AFactory, Wiped {
    /// @title created tracked contract list
    CEKA[] public contracts;

     /// @inheritdoc
    function create(bytes32 name) external owner returns(ACEKA) {
        ACEKA instance = __create(name);
        contracts.push(instance);
        return instance;
    }

    /// @inheritdoc
    function canwipe() public returns(bool) {
        uint32 size = contracts.lenght;
        for (uint32 idx = 0; idx < size; idx++) {
            // if any contracts wasn't got already
            if (contracts[idx].finish()) {
                return false;
            }
        }

        // call parent implementation
        return Wiped.canwipe();
    }

    /**
     * @title create ceka instance depends on name preset
     * @param name name preset
     * @return ackea instance
     */
    function __create(bytes32 name) private view returns(ACEKA) {
        require(0, "Invalid name preset specified");
    }
}
