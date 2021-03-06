pragma solidity 0.5.7;

import "./../interfaces/iceka.sol";
import "./../interfaces/ichart.sol";
import "./../helpers/finite.sol";
import "./../cdt/fobll.sol";

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title crypto e(ethereum)-redistribution kind application implementation of iceka
 * inheritdoc
 */
contract CEKA is ICEKA, IChart, Finite {
    // using SafeMath for calculation
    using SafeMath for uint256;

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
    /// @title contract sub successor address
    address payable public ssAddress;

    /// @dev emit on success funds return
    event ereturn(address addr, uint256 amnt);

    /**
     * @dev initialize ceka
     * @param ptsStart max start time_stamp
     * @param ptsFinish finish time_stamp
     * @param pputTsDelta put delta time_stamp constraint
     * @param pputAmntMin put amount min constraint
     * @param pputAmntMax put amount max constraint
     * @param prthRate return to hold rate
     * @param psmCount successors main count
     * @param psaCount successors all count
     * @param pssRate successors split rate
    * @param pssAddress sub successor address
     */
    constructor(
        uint256 ptsStart,
        uint256 ptsFinish,
        uint256 pputTsDelta,
        uint256 pputAmntMin,
        uint256 pputAmntMax,
        uint32 prthRate,
        uint32 psmCount,
        uint32 psaCount,
        uint32 pssRate,
        address payable pssAddress
    ) public payable Finite(ptsStart, ptsFinish) {
        // init ctor params
        putTsDelta = pputTsDelta;
        putAmntMin = pputAmntMin;
        putAmntMax = pputAmntMax;
        rthRate = prthRate;
        smCount = psmCount;
        saCount = psaCount;
        ssRate = pssRate;

        rthAddress = msg.sender;
        ssAddress = pssAddress;

        // init amounts
        amntInit = amntTotal = amntClean = amntCurrent = msg.value;

        // init fobll
        __fobll = new FOBLL(psaCount);
    }

    /// inheritdoc
    function get() external {
        // in case get time_stamp breaks expiration contract constraint
        require(finish(), "Invalid get now, time_stamp breaks expiration contract constraint");

        // update participant contract data
        Participant storage participant = __get(msg.sender, false);
        // in case get address breaks known participiant get contract constraint
        require(participant.addr != address(0), "Invalid get addr, address breaks known participiant get contract constraint");
        // in case get processed breaks single get contract constraint
        require(!participant.prcsd, "Invalid get prcsd flag, processed breaks single get contract constraint");
        participant.prcsd = true;

        // calculate participant amount
        uint256 amnt = __calc(participant.addr);
        // in case get processed breaks single get contract constraint
        require(amnt > 0 && amnt <= amntCurrent, "Invalid get amnt, calculated amount breaks limits get contract constraint");
        // transfer funds and emit event
        // in case of transfer failed
        if (!msg.sender.send(amnt)) {
            participant.prcsd = false;
            return;
        }
        // update contract data
        amntCurrent = amntCurrent.sub(amnt);
        emit egot(participant.addr, amnt);
    }

    /// inheritdoc
    function put() external payable {
        // in case put time_stamp breaks expiration contract constraint
        require(!finish(), "Invalid put now, time_stamp breaks expiration contract constraint");
        // in case put amount breaks min/max contract constraint
        require(putAmntMin <= msg.value && msg.value <= putAmntMax, "Invalid put value, amount breaks min/max contract constraint");

        uint256 amnt = msg.value;
        // update participant contract data
        Participant storage participant = __get(msg.sender, true);
        // in case put time_stamp breaks min put delta constraint
        require(now - participant.ts > putTsDelta, "Invalid put now, time_stamp breaks min put delta constraint");
        participant.ts = now;
        participant.amnt = participant.amnt.add(amnt);

        // update contract data
        amntTotal = amntTotal.add(amnt);
        amntClean = amntClean.add(amnt);
        amntCurrent = amntCurrent.add(amnt);

        // update fobll and emit event
        uint32 size = __fobll.size();
        __fobll.push(participant.addr, participant.amnt);
        emit eput(participant.addr, amnt);

        // check new size
        uint32 nsize = __fobll.size();
        // in case list is growing emit event
        if (size < nsize) {
            emit egrowth(nsize);
        }

        // find index of participant in fobll
        uint32 idx = __fobll.index(participant.addr);
        // in case index is sufficient emit event
        if (idx != 0) {
            emit eupdate(participant.addr, participant.amnt, idx);
        }
    }

    /// inheritdoc
    function leave() external {
        // in case leave time_stamp breaks expiration contract constraint
        require(!finish(), "Invalid leave now, time_stamp breaks expiration contract constraint");

        // update participant contract data
        Participant storage participant = __get(msg.sender, false);
        // in case get address breaks known participiant get contract constraint
        require(participant.addr != address(0), "Invalid leave addr, address breaks known participiant leave contract constraint");
        // in case get processed breaks single get contract constraint
        require(!participant.prcsd, "Invalid leave prcsd flag, processed breaks single leave contract constraint");
        participant.prcsd = true;

        // calculate participant amount
        uint256 amnt = participant.amnt.div(2);
        // in case get processed breaks single get contract constraint
        require(amnt > 0 && amnt <= amntCurrent, "Invalid leave amnt, calculated amount breaks limits leave contract constraint");
        // transfer funds and emit event
        // in case of transfer failed
        if (!msg.sender.send(amnt)) {
            participant.prcsd = false;
            return;
        }
        // update contract data
        amntCurrent = amntCurrent.sub(amnt);
        amntClean = amntClean.sub(amnt);
        emit eleave(participant.addr, amnt);
    }

    /// inheritdoc
    function top(uint32 count) external returns(address[] memory, uint256[] memory) {
        // check count constraint and fix it
        uint32 size = __fobll.size();
        uint32 fcount = count == 0 || count > size ? size : count;
        // get top slice from fobll
        address[] memory addrs = __fobll.slice(1, fcount);
        uint256[] memory amnts = new uint256[](fcount);
        for(uint32 idx = 0; idx < fcount; idx++) {
            amnts[idx] = __get(addrs[idx], false).amnt;
        }
        return (addrs, amnts);
    }

    /// inheritdoc
    function finish() public returns(bool) {
        // in case finish has been already processed
        // and contract now in get phase
        if (_finished) {
            return true;
        }

        // in case contract still in put phase
        // call parent implementation
        if (!Finite.finish()) {
           return false;
        }

        // transfer return to hold funds
        uint256 rthAmnt = amntClean.div(rthRate);
        // transfer funds to hold
        // in case of transfer failed
        if (!rthAddress.send(rthAmnt)) {
            _finished = false;
            return false;
        }
        // update contract data
        amntClean = amntClean.sub(rthAmnt);
        amntCurrent = amntClean;
        emit ereturn(rthAddress, rthAmnt);

        // transfer sub succesor funds and update contract data
        uint32 size = __fobll.size();
        uint32 ssIdx = size < smCount ? size + 1 : smCount + 1;
        uint256 ssAmnt = amntClean.sub(amntClean.div(ssRate));
        for (uint32 idx = 1; idx <= ssIdx; idx++) {
            ssAmnt = ssAmnt.div(2);
        }
        // transfer funds to sub successor
        // in case of transfer failed
        if(!ssAddress.send(ssAmnt)) {
            _finished = false;
            return false;
        }
        // update contract data
        amntClean = amntClean.sub(ssAmnt);
        amntCurrent = amntClean;
        emit ereturn(ssAddress, ssAmnt);

        // finis is done now
        // contract is swithched in get phase
        return true;
    }

    /**
     * @dev calculate get amount for participiant with addr
     * @param addr address of participant
     * @return amount
     */
    function __calc(address addr) private view returns(uint256) {
        uint32 index = __fobll.index(addr);
        if (index == 0) {
            return 0;
        }

        uint32 fsize = __fobll.size();
        uint32 saCounta = fsize < saCount ? fsize + 1 : saCount;

        uint256 amntCalc = 0;
        uint amntSplit = amntClean.div(ssRate);
        if (index <= smCount) {
            amntCalc = amntClean.sub(amntSplit);
            for (uint32 idx = 1; idx <= index; idx++) {
                amntCalc = amntCalc.div(2);
            }
        }
       amntCalc = amntCalc.add(amntSplit.div(saCounta));
        return amntCalc;
    }

    /**
     * @dev find existed participant by addr, if no participant were found add empty one
     * @param addr address of participant
     * @param nonex flag for add empty one
     * @return participiant
     */
    function __get(address addr, bool nonex) private returns(Participant storage) {
        Participant storage participant = __participants[addr];
        // in case participant not found
        if (nonex && participant.addr == address(0)) {
            // new participant hasn't done any action yet and have zero amount
            __participants[addr] = Participant({
                addr: addr,
                amnt: 0,
                ts: 0,
                prcsd: false
            });
            participant = __participants[addr];
        }
        return participant;
    }

    /// @title participiant related data
    struct Participant {
        /// @title participiant get address
        address addr;
        /// @title participiant put amount
        uint256 amnt;
        /// @title participiant put time_stamp
        uint256 ts;
        /// @title participiant get processed flag
        bool prcsd;
    }
    /// @title contract participants map
    mapping (address => Participant) private __participants;

    /// @title fobll order participiants by amount
    FOBLL private __fobll;
}
