pragma solidity ^0.5;

/**
 * @title abstract chart interface
 */
interface AChart {
    /**
     * @title return top elemens from the chart
     * @param count max elements to return
     * @return elements in form [keys, values]
     */
    function top(uint32 count) external view returns(address[] memory, uint256[] memory);

    /// @title emit on success chart update action
    event eupdate(address addr, uint256 amnt, uint32 index);
}