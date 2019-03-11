pragma solidity ^0.5;

// main contract
contract Ceka {
    // participiant related data
    struct Participant {
        // participiant amount
        uint256 amount;
        // participiant last put time_stamp
        uint256 ts;
        // participiant get processed already
        bool processed;
    }

    // contract start time_stamp
    uint256 public tsStart;
    // contract finish time_stamp
    uint256 public tsFinish;

    // contract initial amount
    uint256 public amntInit;
    // contract total amount
    uint256 public amntTotal;

    // contract put delta time_stamp
    uint256 public putTsDelta;
    // contract put amount min
    uint256 public putAmntMin;
    // contract put amount max
    uint256 public putAmntMax;

    // contract return to hold rate
    uint256 public rthRate;
    // contract return to hold adress
    address public rthAdress;

    // contract last successor adress
    address private lsAdress;

    // contract participants Map
    mapping (address => Participant) private participantsMap;

    // todo implement
    // contract contruct
    constructor(
        uint256 tsStart,
        uint256 tsFinish,
        uint256 amntInit,
        uint256 putTsDelta,
        uint256 putAmntMin,
        uint256 putAmntMax,
        uint256 rthRate,
        address rthAdress,
        address lsAdress
    ) public {}
    // todo implement
    // contract method send eth for participiant to address
    function get(address) public payable checkGetFin checkGetPrcsd {}
    // todo implement
    // contract method take eth from participiant to hold
    function put(address, uint256) public payable checkPutTs checkPutAmnt {}
    // todo implement
    // contract method list participiant values in asc order
    function list(uint256 count) public pure {}

    // todo implement
    // contract check put time_stamp
    modifier checkPutTs {_;}
    // todo implement
    // contract check put amount
    modifier checkPutAmnt {_;}
    // todo implement
    // contract check get finished already
    modifier checkGetFin {_;}
    // todo implement
    // contract check get proccessed already
    modifier checkGetPrcsd {_;}

    // contract finished ready to get
    event finished(uint256 tsFinish, uint256 amntTotal);
}