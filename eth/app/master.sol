pragma solidity 0.5.7;

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
    function __create(bytes4 name) private view returns(ACEKA) {
        if (name == "s_u") { // 1
            return CEKA(
                now,
                now + 1800_00, // 50 hours
                360, // 0.1 hours
                10_000_000_000_000, // 0.00001 eth
                1_000_000_000_000_000_000, // 1 eth
                4, // 25 %
                5,
                25,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "s_e") { // 2
            return CEKA(
                now,
                now + 900_00, // 25 hours
                360, // 0.1 hours
                10_000_000_000_000, // 0.00001 eth
                1_000_000_000_000_000_000, // 1 eth
                4, // 25 %
                5,
                25,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "n_s") { // 3
            return CEKA(
                now,
                now + 3600_00, // 100 hours
                360, // 0.1 hours
                100_000_000_000_000, // 0.0001 eth
                10_000_000_000_000_000_000, // 10 eth
                4, // 25 %
                5,
                25,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "n_u") { // 4
            return CEKA(
                now,
                now + 3600_00, // 100 hours
                360, // 0.1 hours
                100_000_000_000_000, // 0.0001 eth
                10_000_000_000_000_000_000, // 10 eth
                10, // 10 %
                10,
                100,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "n_n") { // 5
            return CEKA(
                now,
                now + 3600_00, // 100 hours
                360, // 0.1 hours
                100_000_000_000_000, // 0.0001 eth
                10_000_000_000_000_000_000, // 10 eth
                10, // 10 %
                10,
                100,
                2,  // 50 % / 50 %
                cowner
            );
        } else if (name == "n_l") { // 6
            return CEKA(
                now,
                now + 18000_00, // 500 hours
                360, // 0.1 hours
                100_000_000_000_000, // 0.0001 eth
                10_000_000_000_000_000_000, // 10 eth
                10, // 10 %
                10,
                100,
                2,  // 50 % / 50 %
                cowner
            );
        } else if (name == "n_e") { // 7
            return CEKA(
                now,
                now + 18000_00, // 500 hours
                360, // 0.1 hours
                100_000_000_000_000, // 0.0001 eth
                10_000_000_000_000_000_000, // 10 eth
                4, // 25 %
                25,
                250,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "l_n") { // 8
            return CEKA(
                now,
                now + 36000_00, // 1000 hours
                3600, // 1 hours
                1_000_000_000_000_000, // 0.001 eth
                100_000_000_000_000_000_000, // 100 eth
                4, // 25 %
                25,
                250,
                4, // 75 % / 25 %
                cowner
            );
        } else if (name == "l_s") { // 9
            return CEKA(
                now,
                now + 36000_00, // 1000 hours
                3600, // 1 hours
                1_000_000_000_000_000, // 0.001 eth
                100_000_000_000_000_000_000, // 100 eth
                10, // 10 %
                10,
                100,
                2,  // 50 % / 50 %
                cowner
            );
        } else if (name == "l_i") { // 10
            return CEKA(
                now,
                now + 180000_00, // 5000 hours
                3600, // 1 hours
                1_000_000_000_000_000, // 0.001 eth
                100_000_000_000_000_000_000, // 100 eth
                20, // 5 %
                50,
                500,
                8, // 87.5 % / 12.5 %
                cowner
            );
        } else {
            require(false, "Invalid name preset specified");
        }
    }
}
