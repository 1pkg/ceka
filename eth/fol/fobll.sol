pragma solidity ^0.5;

import "./../interfaces/foladt.sol";

/**
 * fixed ordered bidirectional linked list implementation of foladt
 * @inheritdoc
 */
contract FOBLL is FOLADT {
    /// @inheritdoc
    function size() public view returns(uint32) { // O(1)
        return __size;
    }

    /// @inheritdoc
    function capacity() public view returns(uint32) { // O(1)
        return __capacity;
    }

    /// @inheritdoc
    function empty() public view returns(bool) { // O(1)
        return __head == address(0) && __tail == address(0) && __size == 0;
    }

    /// @inheritdoc
    function push(address key, uint256 value) public { // O(1) [note max iterations count eq capacity]
        // before start placement remove node from list
        // replace node everytime isntead of update existed value
        remove(key);

        // in case of empty list 
        // place single node into list
        // than break from place method
        // as placement was done
        if (empty()) {
            __between(key, value, address(0), address(0));
            return;
        }
    
        // start common place flow
        __place(key, value);
    }

    /// @inheritdoc
    function remove(address self) public { // O(1)
        Node memory node = __nodes[self];
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

        // update list size
        --__size;
        // clear node data
        delete __nodes[self];
    }

    /// @inheritdoc
    function at(uint32 index) public view returns(address) { // O(1) [note max iterations count eq capacity]
        // in case of invalid index specified
        if (index > __size) {
            return address(0);
        }

        uint32 idx = 1; // index start from first node
        // iterate over all list nodes from head to tail
        address iterator = __head;
        while (iterator != __tail || iterator == address(0)) {
            Node memory node = __nodes[iterator];
            if (index != idx) {
                // update list iterator
                iterator = node.next;
                // update iteration break index
                ++idx;
                // skip while we not find right node
                continue;
            }

            // in case we found right node 
            return node.self;
        }
    }

    /// @inheritdoc
    function slice(uint32 start, uint32 finish) public view returns(address[] memory) { // O(1) [note max iterations count eq capacity]
        address[] memory result;
        // in case of invalid indexes specified
        if (start > finish || start > __size || finish > __size) {
            return result;
        }
        result = new address[](finish - start);

        uint32 idx = 1; // index start from first node
        // iterate over all list nodes from head to tail
        address iterator = __head;
        while (iterator != __tail || iterator == address(0)) {
            Node memory node = __nodes[iterator];
            if (start > idx || finish < idx) {
                // update list iterator
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

    /// @inheritdoc
    function clear() public { // O(1)
        __head = __tail = address(0);
        __size = 0;
    }

    /**
     * @title place node into the list by order, correctly processed single item list and multi items list
     * @param self adress of new node
     * @param value value of new node
     */
    function __place(address self, uint256 value) private { // O(1) [note max iterations count eq capacity]
        uint32 idx = 1; // index start from first node
        // iterate over all list nodes from head to tail
        address iterator = __head;
        do {
            Node memory node = __nodes[iterator];
            if (node.value >= value) {
                // update list iterator
                iterator = node.next;
                // update iteration break index
                ++idx;
                // skip between action
                // while we not find right node
                continue;
            }

            // in case list is already full
            // and new node value is lower than min existed
            // break from place method
            // as placement was done
            if (idx > __capacity) {
                return;
            }

            // add new node to the list before current node
            __between(self, value, node.prev, node.self);

            // in case placement done in middle of list
            // and list size growth over capacity
            // remove __tail element
            if (__size > __capacity) {
                remove(__tail);
            }

            // break from place method
            // as placement was done
            return;
        } while (iterator != __tail || iterator == address(0));

        // in case of list lowest new node value
        // append new node to list tail node

        // in case list is already full
        // break from place method
        // as placement was done
        if (__size >= __capacity) {
            return;
        }

        // add new node to the end of list
        __between(self, value, __tail, address(0));
    }

    /**
     * @title create new node with address and value between prev address and next address
     * @param self adress of new node
     * @param value value of new node
     * @param prev ptr to prev node
     * @param next prt to next node
     */
    function __between(address self, uint256 value, address prev, address next) private { // O(1)
        // add new node to the list before next node and prev node 
        __nodes[self] = Node({
            value: value,
            self: self,
            prev: prev,
            next: next
        });

        // in case prev node is tail node
        // declare new node as new tail node
        if (prev == __tail) {
            __tail == self;
        }

        // in case next node is head node
        // declare new node as new head node
        if (next == __head) {
            __head == self;
        }

        // in case prev node exists
        // change old prev node next ptr to new node
        if (prev != address(0)) {
            __nodes[prev].next = self;
        }

        // in case next node exists
        // change old next node prev ptr to new node
        if (next != address(0)) {
            __nodes[next].prev = self;
        }

        // update list size
        ++__size;
    }

    // size of fobll
    uint32 __size;
    // capacity of fobll
    uint32 __capacity;

    // inner node struct of fobll
    struct Node {
        // node self value
        uint256 value;
        // node self address
        address self;
        // node next address
        address next;
        // node prev address
        address prev;
    }
    // nodes mapping of fobll
    mapping(address => Node) private __nodes;
    
    // head ptr of fobll
    address private __head;
    // tail ptr of fobll
    address private __tail;
}