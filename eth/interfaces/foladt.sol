pragma solidity ^0.5;

/**
 * @title fixed ordered list abstract data type keep limited elements number each [key element identifier => payload element value] with specific payload order 
 * @dev contain methods: size, capacity, empty, push, index, at, remove, clear, slice
 */
contract FOLADT {
    /**
     * @title get fol size
     * @return fol size
     */
    function size() public view returns(uint32);

    /**
     * @title get fol capacity aka max size
     * @return fol capacity
     */
    function capacity() public view returns(uint32);

    /**
     * @title check fol for list
     * @return fol emptinesslist
     */
    function empty() public view returns(bool);

    /**
     * @title push element to fol, if element already exists update it
     * @dev consider size constraints
     * @param key element identifier
     * @param value element value
     */
    function push(address key, uint256 value) public;

    /**
     * @title search element index in fol, if element not exists return 0
     * @dev consider size constraints
     * @param key element identifier
     * @param value element value
     */
    function index(address key) public returns(uint32);

    /**
     * @title get fol element at specific index, if element not exists return address(0)
     * @dev consider size constraints
     * @param idx specific index
     * @return element identifier
     */
    function at(uint32 idx) public view returns(address);

    /**
     * @title remove element from fol at specific index, if elemnt already exists
     * @dev update size constraints
     * @param idx specific index
     */
    function remove(uint32 idx) public;

    /**
     * @title clear fol completly
     * @dev use carefuly
     */
    function clear() public;

    /**
     * @title get fol elements slice between start and finish
     * @dev consider size constraints
     * @param start slice start index
     * @param finish slice end index
     * @return element identifiers
     */
    function slice(uint32 start, uint32 finish) public view returns(address[] memory);
}