pragma solidity 0.5.7;

/// @title abstract crypto e(ethereum)-redistribution kind application interface
interface ICEKA {
    /**
     * @dev put obtained amount to participiant accordingly with contract constraints
     * @dev may emit egot
     */
    function get() external;

    /**
     * @dev take deposit amount from participiant to contract balance accordingly with contract constraints
     * @dev may emit eput
     */
    function put() external payable;

    /**
     * @dev return half of deposit amount to participiant accordingly with contract constraints [note that action shouldn't update participiant ordered list]
     * @dev may emit eleave
     */
    function leave() external;

    /**
     * @dev check that contract exceed
     * @return finished flag
     */
    function finish() external returns(bool);

    /// @dev emit on success get action
    event egot(address addr, uint256 amnt);

    /// @dev emit on success put action
    event eput(address addr, uint256 amnt);

    /// @dev emit on success leave action
    event eleave(address addr, uint256 amnt);

    /// @dev emit on constract finish
    event efinished(uint256 tsFinish);
}