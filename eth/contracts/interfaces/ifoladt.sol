pragma solidity 0.5.7;

/**
 * @title fixed ordered list abstract data type keep limited elements number with specific payload order 
 * @dev each elements [key element identifier => payload element value]
 */
interface IFOLADT {
    /**
     * @dev get fol size
     * @return fol size
     */
    function size() external view returns(uint32);

    /**
     * @dev get fol capacity aka max size
     * @return fol capacity
     */
    function capacity() external view returns(uint32);

    /**
     * @dev check fol for emptinesslist
     * @return fol emptinesslist
     */
    function empty() external view returns(bool);

    /**
     * @dev push element to fol, if element already exists update it
     * @dev consider size constraints
     * @param key element identifier
     * @param value element value
     */
    function push(address key, uint256 value) external;

    /**
     * @dev search element index in fol, if element not exists return 0
     * @dev consider size constraints
     * @param key element identifier
     */
    function index(address key) external view returns(uint32);

    /**
     * @dev get fol element at specific index, if element not exists return address(0)
     * @dev consider size constraints
     * @param idx specific index
     * @return element identifier
     */
    function at(uint32 idx) external view returns(address);

    /**
     * @dev remove element from fol at specific index, if elemnt already exists
     * @dev update size constraints
     * @param idx specific index
     */
    function remove(uint32 idx) external;

    /**
     * @dev get fol elements slice between start and finish
     * @dev consider size constraints
     * @param start slice start index
     * @param finish slice end index
     * @return element identifiers
     */
    function slice(uint32 start, uint32 finish) external view returns(address[] memory);
}