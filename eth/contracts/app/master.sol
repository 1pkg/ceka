pragma solidity 0.5.7;

import "./../interfaces/ifactory.sol";
import "./../helpers/wiped.sol";
import "./ceka.sol";

/**
 * @title master contract of whole app controls contract creation
 * inheritdoc
 */
contract Master is IFactory, Wiped {
    /// @title tracked contracts list
    mapping (bytes4 => ICEKA[]) public contracts;

    /// @title name preset
    bytes4 constant NAME_SU = 's_u'; // 1. small ususal
    /// @title name preset
    bytes4 constant NAME_SE = 's_e'; // 2. small extra
    /// @title name preset
    bytes4 constant NAME_NS = 'n_s'; // 3. normal small
    /// @title name preset
    bytes4 constant NAME_NU = 'n_u'; // 4. normal ususal
    /// @title name preset
    bytes4 constant NAME_NC = 'n_c'; // 5. normal common
    /// @title name preset
    bytes4 constant NAME_NL = 'n_l'; // 6. normal large
    /// @title name preset
    bytes4 constant NAME_NE = 'n_e'; // 7. normal extra
    /// @title name preset
    bytes4 constant NAME_LN = 'l_n'; // 8. large normal
    /// @title name preset
    bytes4 constant NAME_LU = 'l_u'; // 9. large ususal
    /// @title name preset
    bytes4 constant NAME_LE = 'l_i'; // 10. large extra

    /// @title presets collection
    bytes4[10] public presets = [
        NAME_SU,
        NAME_SE,
        NAME_NS,
        NAME_NU,
        NAME_NC,
        NAME_NL,
        NAME_NE,
        NAME_LN,
        NAME_LU,
        NAME_LE
    ];
    
     /// inheritdoc
    function create(bytes4 name) external owner returns(ICEKA) {
        ICEKA instance = __create(name);
        contracts[name].push(instance);
        return instance;
    }

    /// inheritdoc
    function get(bytes4 name, bool active) external owner returns(ICEKA[] memory) {
        ICEKA[] memory pcontracts = contracts[name];
        ICEKA[] memory result = new ICEKA[](pcontracts.length);
        for (uint32 pidx = 0; pidx < pcontracts.length; pidx++) {
            ICEKA pcontract = pcontracts[pidx];
            // if any contracts wasn't got already
            if (active && pcontract.finish()) {
                continue;
            }
            result[pidx] = pcontract;
        }
        return result;
    }

    /// inheritdoc
    function canwipe() public returns(bool) {
        for (uint32 idx = 0; idx < presets.length; idx++) {
            ICEKA[] memory pcontracts = contracts[presets[idx]];
             for (uint32 pidx = 0; pidx < pcontracts.length; pidx++) {
                ICEKA pcontract = pcontracts[pidx];
                // if any contracts wasn't got already
                if (pcontract.finish()) {
                    return false;
                }
            }
        }

        // call parent implementation
        return Wiped.canwipe();
    }

    /**
     * @dev create ceka instance depends on name preset
     * @param name name preset
     * @return ackea instance
     */
    function __create(bytes4 name) private returns(ICEKA) {
        if (name == NAME_SU) {
            return new CEKA(
                now, // from now
                now + 50 hours, // 50 hours
                6 minutes, // 0.1 hours
                10 szabo, // 0.00001 eth
                1 ether, // 1 eth
                4, // rth 25%
                5, // main successors
                25, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_SE) {
            return new CEKA(
                now, // from now
                now + 25 hours, // 25 hours
                6 minutes, // 0.1 hours
                10 szabo, // 0.00001 eth
                1 ether, // 1 eth
                4, // rth 25%
                5, // main successors
                25, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_NS) {
            return new CEKA(
                now, // from now
                now + 100 hours, // 100 hours
                6 minutes, // 0.1 hours
                100 szabo, // 0.0001 eth
                10 ether, // 10 eth
                4, // rth 25%
                5, // main successors
                25, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_NU) {
            return new CEKA(
                now, // from now
                now + 100 hours, // 100 hours
                6 minutes, // 0.1 hours
                100 szabo, // 0.0001 eth
                10 ether, // 10 eth
                4, // rth 25%
                10, // main successors
                100, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_NC) {
            return new CEKA(
                now, // from now
                now + 100 hours, // 100 hours
                6 minutes, // 0.1 hours
                100 szabo, // 0.0001 eth
                10 ether, // 10 eth
                10, // rth 10%
                10, // main successors
                100, // all successors
                2,  // ssr 50% / 50%
                cowner // ss address
            );
        } else if (name == NAME_NL) {
            return new CEKA(
                now, // from now
                now + 500 hours, // 500 hours
                6 minutes, // 0.1 hours
                100 szabo, // 0.0001 eth
                10 ether, // 10 eth
                10, // rth 10%
                10, // main successors
                100, // all successors
                2,  // ssr 50% / 50%
                cowner // ss address
            );
        } else if (name == NAME_NE) {
            return new CEKA(
                now, // from now
                now + 500 hours, // 500 hours
                6 minutes, // 0.1 hours
                100 szabo, // 0.0001 eth
                10 ether, // 10 eth
                4, // rth 25%
                25, // main successors
                250, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_LN) {
            return new CEKA(
                now, // from now
                now + 1000 hours, // 1000 hours
                1 hours, // 1 hours
                1 finney, // 0.001 eth
                100 ether, // 100 eth
                4, // rth 25%
                25, // main successors
                250, // all successors
                4, // ssr 75% / 25%
                cowner // ss address
            );
        } else if (name == NAME_LU) {
            return new CEKA(
                now, // from now
                now + 1000 hours, // 1000 hours
                1 hours, // 1 hours
                1 finney, // 0.001 eth
                100 ether, // 100 eth
                10, // rth 10%
                10, // main successors
                100, // all successors
                2,  // ssr 50% / 50%
                cowner // ss address
            );
        } else if (name == NAME_LE) {
            return new CEKA(
                now, // from now
                now + 5000 hours, // 5000 hours
                1 hours, // 1 hours
                1 finney, // 0.001 eth
                100 ether, // 100 eth
                20, // rth 5%
                50, // main successors
                500, // all successors
                8, // ssr 87.5% / 12.5%
                cowner // ss address
            );
        } else {
            require(false, "Invalid name preset specified");
        }
    }
}
