pragma solidity 0.5.7;

/// @title abstract chart interface
interface IChart {
    /**
     * @dev return top elemens from the chart
     * @param count max elements to return
     * @return elements in form [keys, values]
     */
    function top(uint32 count) external returns(address[] memory, uint256[] memory);

    /// @dev emit on success chart update action
    event eupdate(address addr, uint256 amnt, uint32 index);
}