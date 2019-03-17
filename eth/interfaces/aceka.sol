pragma solidity ^0.5;

/**
 * @title abstract crypto e-redistribution kindly application interface
 */
interface ACEKA {
    /**
     * @title withdraw obtained amount to participiant accordingly with contract constraints
     * @dev may emit efinished, egot
     */
    function get() external payable;

    /**
     * @title take amount from participiant to contract balance accordingly with contract constraints
     * @dev may emit efinished, eput
     */
    function put() external payable;

    /// @title emit on contract start
    event estart(uint256 tsFinish, uint256 amntInit);
    /// @title emit on constract finish
    event efinished(uint256 tsFinish, uint256 amntTotal);
    /// @title emit on success get action
    event egot(address addr, uint256 amnt);
    /// @title emit on success put action
    event eput(address addr, uint256 amnt);
}