pragma solidity ^0.5;

import "./../interfaces/foladt.sol";
import "./../helpers/ownable.sol";

/**
 * @title fixed ordered bidirectional linked list implementation of foladt
 * @dev all fobll operation O(1) [note max iterations count eq capacity]
 * @dev note all indexations start from 1
 * @inheritdoc
 */
contract FOBLL is FOLADT, Ownable {
    /**
     * @title initialize fobll with max size param
     * @param capacity max size of fobll
     */
    constructor(uint32 capacity) public {
        __capacity = capacity;
    }

    /// @inheritdoc
    function size() external view returns(uint32) {
        return __size;
    }

    /// @inheritdoc
    function capacity() external view returns(uint32) {
        return __capacity;
    }

    /// @inheritdoc
    function empty() public view returns(bool) {
        return __head == address(0) && __tail == address(0) && __size == 0;
    }

    /// @inheritdoc
    function push(address key, uint256 value) external owner {
        // in case of invalid address specified
        require(key != address(0), "Invalid key specified");

        // before start placement remove node from fobll
        // replace node everytime isntead of update existed value
        __remove(key);

        // in case of empty fobll 
        // place single node into fobll
        // than break from place method
        // as placement was done already
        if (empty()) {
            __between(key, value, address(0), address(0));
            return;
        }
    
        // start common place flow
        __place(key, value);
    }

    /// @inheritdoc
    function index(address key) external returns(uint32) {
        // in case of invalid address specified
        require(key != address(0), "Invalid key specified");

        uint32 idx = 1; // index start from first node
        // iterate over all fobll nodes from head to tail
        address iterator = __head;
        while (iterator != __tail || iterator == address(0)) {
            Node memory node = __nodes[iterator];
            if (node.self != key) {
                // update fobll iterator
                iterator = node.next;
                // update iteration break index
                ++idx;
                // skip while we not find right node
                continue;
            }

            // in case we found right node 
            return idx;
        }
        return 0;
    }

    /// @inheritdoc
    function at(uint32 idx) public view returns(address) {
        // in case of invalid index specified
        require(idx != 0 && idx <= __size, "Invalid index specified");

        uint32 lidx = 1; // index start from first node
        // iterate over all fobll nodes from head to tail
        address iterator = __head;
        while (iterator != __tail || iterator == address(0)) {
            Node memory node = __nodes[iterator];
            if (idx != lidx) {
                // update fobll iterator
                iterator = node.next;
                // update iteration break index
                ++lidx;
                // skip while we not find right node
                continue;
            }

            // in case we found right node 
            return node.self;
        }
        return address(0);
    }

    /// @inheritdoc
    function remove(uint32 idx) public owner {
        // use remove by key and at methods
        __remove(at(idx));
    }

    /// @inheritdoc
    function clear() external owner {
        // clear whole list
        for (uint32 idx = 1; idx < __size; idx++) remove(idx);
        __size = 0;
        __head = __tail = address(0);
    }

    /// @inheritdoc
    function slice(uint32 start, uint32 finish) external view returns(address[] memory) {
        // in case of invalid indexes specified
        require(start != 0 && finish != 0 && start <= finish && finish <= __size, "Invalid indexes specified");

        address[] memory result = new address[](finish - start);
        uint32 idx = 1; // index start from first node
        // iterate over all fobll nodes from head to tail
        address iterator = __head;
        while (iterator != __tail || iterator == address(0)) {
            Node memory node = __nodes[iterator];
            if (start > idx || finish < idx) {
                // update fobll iterator
                iterator = node.next;
                // update iteration break index
                ++idx;
                // skip while we not find right nodes
                continue;
            }

            // in case we found right node 
            result[idx - start] = node.self;
        }
        return result;
    }

    /**
     * @title remove element from fobll by key, if elemnt already exists
     * @dev update size constraints
     * @param key element identifier
     */
    function __remove(address key) private {
        Node memory node = __nodes[key];
        // in case node not exists 
        if (node.self == address(0)) {
            return;
        }

        // in case removed node was head node
        // declare next node as new head node
        if (node.self == __head) {
            __head = node.next;
        }

        // in case removed node was tail node
        // declare prev node as new tail node
        if (__tail == node.self) {
            __tail = node.prev;
        }

        // in case removded prev node exists
        // change old prev node next ptr to node next ptr
        if (node.prev != address(0)) {
            __nodes[node.prev].next = node.next;
        }

        // in case removded next node exists
        // change old next node prev ptr to node prev ptr
        if (node.next != address(0)) {
            __nodes[node.next].prev = node.prev;
        }

        // update fobll size
        --__size;
        // clear node data
        delete __nodes[key];
    }

    /**
     * @title place node into the fobll by order, correctly processed single item fobll and multi items fobll
     * @param key adress of new node
     * @param value value of new node
     */
    function __place(address key, uint256 value) private {
        uint32 idx = 1; // index start from first node
        // iterate over all fobll nodes from head to tail
        address iterator = __head;
        do {
            Node memory node = __nodes[iterator];
            if (node.value >= value) {
                // update fobll iterator
                iterator = node.next;
                // update iteration break index
                ++idx;
                // skip between action
                // while we not find right node
                continue;
            }

            // in case fobll is already full
            // and new node value is lower than min existed
            // break from place method
            if (idx > __capacity) {
                return;
            }

            // add new node to the fobll before current node
            __between(key, value, node.prev, node.self);

            // in case placement done in middle of fobll
            // and fobll size growth over capacity
            // remove __tail element
            if (__size > __capacity) {
                __remove(__tail);
            }

            // break from place method
            // as placement was done
            return;
        } while (iterator != __tail || iterator == address(0));

        // in case of fobll lowest new node value
        // append new node to fobll tail node

        // in case fobll is already full
        // break from place method
        if (__size >= __capacity) {
            return;
        }

        // add new node to the end of fobll
        __between(key, value, __tail, address(0));
    }

    /**
     * @title create new node with address and value between prev address and next address
     * @param key adress of new node
     * @param value value of new node
     * @param prev ptr to prev node
     * @param next prt to next node
     */
    function __between(address key, uint256 value, address prev, address next) private {
        // add new node to the fobll before next node and prev node 
        __nodes[key] = Node({
            value: value,
            self: key,
            prev: prev,
            next: next
        });

        // in case prev node is tail node
        // declare new node as new tail node
        if (prev == __tail) {
            __tail == key;
        }

        // in case next node is head node
        // declare new node as new head node
        if (next == __head) {
            __head == key;
        }

        // in case prev node exists
        // change old prev node next ptr to new node
        if (prev != address(0)) {
            __nodes[prev].next = key;
        }

        // in case next node exists
        // change old next node prev ptr to new node
        if (next != address(0)) {
            __nodes[next].prev = key;
        }

        // update fobll size
        ++__size;
    }

    /// @title size of fobll
    uint32 private __size;
    /// @title capacity of fobll
    uint32 private __capacity;

    /// @title inner node struct of fobll
    struct Node {
        /// @title node self value
        uint256 value;
        /// @title node self address
        address self;
        /// @title node next address
        address next;
        /// @title node prev address
        address prev;
    }
    /// @title nodes mapping of fobll
    mapping(address => Node) private __nodes;
    
    /// @title head ptr of fobll
    address private __head;
    /// @title tail ptr of fobll
    address private __tail;
}
