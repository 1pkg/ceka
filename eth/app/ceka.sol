pragma solidity ^0.5;

import "./../interfaces/aceka.sol";
import "./../fol/fobll.sol";

/**
 * @title crypto e-redistribution kindly application implementation of aceka
 * @inheritdoc
 */
contract CEKA is ACEKA {
    /// @title contract start time_stamp
    uint256 public tsStart;
    /// @title contract finish time_stamp
    uint256 public tsFinish;

    /// @title contract initial amount
    uint256 public amntInit;
    /// @title contract total amount
    uint256 public amntTotal;
    /// @title contract clean amount
    uint256 public amntClean;
    /// @title contract current amount
    uint256 public amntCurrent;

    /// @title contract put delta time_stamp constraint
    uint256 public putTsDelta;
    /// @title contract put amount min constraint
    uint256 public putAmntMin;
    /// @title contract put amount max constraint
    uint256 public putAmntMax;

    /// @title contract return to hold rate
    uint32 public rthRate;
    /// @title contract return to hold address
    address payable public rthAddress;

    /// @title contract successors main count
    uint32 public smCount;
    /// @title contract successors all count
    uint32 public saCount;
    /// @title contract successors split rate
    uint32 public ssRate;

    /**
     * @title initialize ceka
     * @param ptsStart max start time_stamp
     * @param ptsFinish finish time_stamp
     * @param pputTsDelta put delta time_stamp constraint
     * @param pputAmntMin put amount min constraint
     * @param pputAmntMax put amount max constraint
     * @param prthRate return to hold rate
     * @param prthAddress return to hold rate
     * @param pssAddress sub successor adress
     * @param psmCount successors main count
     * @param psaCount successors all count
     * @param pssRate successors split rate
     */
    constructor(
        uint256 ptsStart,
        uint256 ptsFinish,
        uint256 pputTsDelta,
        uint256 pputAmntMin,
        uint256 pputAmntMax,
        uint32 prthRate,
        address payable prthAddress,
        address payable pssAddress,
        uint32 psmCount,
        uint32 psaCount,
        uint32 pssRate
    ) public {
        // init ctor params
        tsStart = ptsStart;
        tsFinish = ptsFinish;
        putTsDelta = pputTsDelta;
        putAmntMin = pputAmntMin;
        putAmntMax = pputAmntMax;
        rthRate = prthRate;
        rthAddress = prthAddress;
        ssAddress = pssAddress;
        psmCount = smCount;
        psaCount = saCount;
        pssRate = ssRate;

        // init amounts
        amntInit = amntTotal = amntClean = amntCurrent = msg.value;

        // init fobll
        __fobll = new FOBLL(psaCount);
    }

    /// @inheritdoc
    function get() public payable {
        // in case get time_stamp breaks expiration contract constraint
        require(__finish(), "Invalid get now, time_stamp breaks expiration contract constraint");

        // update participant contract data
        Participant memory participant = __get(msg.sender, false);
        // in case get address breaks known participiant get contract constraint
        require(participant.addr != address(0), "Invalid get addr, address breaks known participiant get contract constraint");
        // in case get processed breaks single get contract constraint
        require(!participant.prcsd, "Invalid get prcsd flag, processed breaks single get contract constraint");
        participant.prcsd = true;
        __participants[participant.addr] = participant;

        // calculate participant amount
        uint256 amnt = __calc(participant.addr);
        // in case get processed breaks single get contract constraint
        require(amnt > 0 && amnt <= amntCurrent, "Invalid get amnt, calculated amount breaks limits get contract constraint");
        // update contract data
        amntCurrent -= amnt;
        // transfer funds and emit event
        msg.sender.transfer(amnt);
        emit egot(participant.addr, amnt);
    }

    /// @inheritdoc
    function put() public payable {
        // in case put time_stamp breaks expiration contract constraint
        require(!__finish(), "Invalid put now, time_stamp breaks expiration contract constraint");
        // in case put amount breaks min/max contract constraint
        require(putAmntMin <= msg.value && msg.value <= putAmntMax, "Invalid put value, amount breaks min/max contract constraint");

        // update participant contract data
        Participant memory participant = __get(msg.sender, true);
        // in case put time_stamp breaks min put delta constraint
        require(now - participant.ts > putTsDelta, "Invalid put now, time_stamp breaks min put delta constraint");
        participant.ts = now;
        participant.amnt += msg.value;
        __participants[participant.addr] = participant;

        // update contract data
        amntTotal += msg.value;
        amntClean += msg.value;
        amntCurrent += msg.value;

        // update fobll and emit event
        __fobll.push(participant.addr, participant.amnt);
        emit eput(participant.addr, participant.amnt);
    }

    /**
     * @title calculate get amount for participiant with addr
     * @param addr address of participant
     * @return finished flag
     */
    function __finish() private returns(bool) {
        // in case finish has been already processed
        // and contract now in get phase
        if (finished) {
            return true;
        }

        // in case contract still in put phase
        if (now < tsFinish) {
           return false;
        }

        // set finished flag
        finished = true;

        // transfer return to hold funds and update contract data
        uint256 rthAmnt = amntTotal / rthRate;
        amntClean -= rthAmnt;
        rthAddress.transfer(rthAmnt);

        // transfer sub succesor funds and update contract data
        uint32 ssIdx = smCount + 1;
        uint256 ssAmnt = amntClean - (amntClean / ssRate);
        for (uint32 idx = 1; idx <= ssIdx; idx++) {
            ssAmnt /= 2;
        }
        amntClean -= rthAmnt;
        ssAddress.transfer(rthAmnt);

        // emit event
        emit efinished(now, amntClean);

        // finis is done now
        // contract is swithched in get phase
        return true;
    }

    /**
     * @title calculate get amount for participiant with addr
     * @param addr address of participant
     * @return amount
     */
    function __calc(address addr) private returns(uint256) {
        uint32 index = __fobll.index(addr);
        if (index == 0) {
            return 0;
        }

        uint256 amntCalc = 0;
        uint amntSplit = amntClean / ssRate;
        uint256 amntBase = amntClean - amntSplit;
        if (index <= smCount) {
            amntCalc = amntBase;
            for (uint32 idx = 1; idx <= index; idx++) {
                amntCalc /= 2;
            }
        }
        amntCalc += (amntSplit / smCount);
        return amntCalc;
    }

    /**
     * @title find existed participant by addr, if no participant were found add empty one
     * @param addr address of participant
     * @return participiant
     */
    function __get(address addr, bool nonex) private returns(Participant memory) {
        Participant memory participant = __participants[addr];
        // in case participant not found
        if (nonex && participant.addr == address(0)) {
            // new participant hasn't done any action yet and have zero amount
            participant = Participant({
                addr: addr,
                amnt: 0,
                ts: 0,
                prcsd: false
            });
        }
        return participant;
    }

    // participiant related data
    struct Participant {
        // participiant get address
        address addr;
        // participiant put amount
        uint256 amnt;
        // participiant put time_stamp
        uint256 ts;
        // participiant get processed flag
        bool prcsd;
    }
    // contract participants map
    mapping (address => Participant) private __participants;

    // fobll order participiants by amount
    FOBLL private __fobll;

    // contract finished flag
    bool private finished;

    // contract sub successor adress
    address payable private ssAddress;
}