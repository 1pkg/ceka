pragma solidity ^0.5;

/// @title ownable contract has an owner address, and provides basic authorization control
contract Finite {
    /// @title contract start time_stamp
    uint256 public tsStart;
    /// @title contract finish time_stamp
    uint256 public tsFinish;

    /// @title emit on contract start
    event estart(uint256 tsStart);
    /// @title emit on constract finish
    event efinished(uint256 tsFinish);

    /**
     * @title initialize finite
     * @param ptsStart max start time_stamp
     * @param ptsFinish finish time_stamp
     */
    constructor(uint256 ptsStart, uint256 ptsFinish) public {
        tsStart = ptsStart;
        tsFinish = ptsFinish;

        // emit event
        emit estart(now);
    }

    /**
     * @title check that now exceed now and cache it
     * @return finished flag
     */
    function finish() public returns(bool) {
        // in case finish has been already processed
        // and contract now in get phase
        if (_finished) {
            return true;
        }

        // in case contract still in put phase
        if (now < tsFinish) {
            return false;
        }

        // set finished flag
        _finished = true;

         // emit event
        emit efinished(now);

        return true;
    }

    /// @title internal finish cache
    bool internal _finished;
}