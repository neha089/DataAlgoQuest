class Node {
    constructor(data) {
        this.data = data;
        this.next = null;  // Pointer to the next node
        this.prev = null;  // Pointer to the previous node
    }
}

class DoubleLinkedList {
    constructor() {
        this.head = null;  // Head of the list
        this.tail = null;  // Tail of the list for easier insertion/deletion at the end
    }
    
    
    visualize() {
        let current = this.head;
        let result = [];
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        console.log(result.join(' <=> ')); // Visualize the list in a readable format
    }

    // Insertion methods
    insertAtHead(data) {
        const newNode = new Node(data);
        if (!this.head) { // If the list is empty
            this.head = newNode;
            this.tail = newNode; // Both head and tail point to the new node
        } else {
            newNode.next = this.head; // Link new node to the current head
            this.head.prev = newNode;  // Set the previous head's prev to the new node
            this.head = newNode;       // Update head to new node
        }
    }

    insertAtTail(data) {
        const newNode = new Node(data);
        if (!this.head) { // If the list is empty
            this.head = newNode;
            this.tail = newNode; // Both head and tail point to the new node
        } else {
            this.tail.next = newNode; // Link the current tail to the new node
            newNode.prev = this.tail;  // Set the new node's prev to the current tail
            this.tail = newNode;       // Update tail to the new node
        }
    }

    insertAtPosition(data, position) {
        if (position === 0) {
            this.insertAtHead(data);
            return;
        }

        const newNode = new Node(data);
        let current = this.head;
        let index = 0;

        while (current && index < position) {
            current = current.next;
            index++;
        }

        if (current) { // Inserting in between
            newNode.prev = current.prev; // Link new node's prev to the previous node
            newNode.next = current;       // Link new node's next to current
            if (current.prev) {
                current.prev.next = newNode; // Update previous node's next
            }
            current.prev = newNode;         // Update current's prev to new node
        } else {
            this.insertAtTail(data); // If position is beyond the end, insert at tail
        }
    }

    // Update methods
    updateAtHead(value) {
        if (this.head) {
            this.head.data = value;
        }
    }

    updateAtTail(value) {
        if (this.tail) {
            this.tail.data = value;
        }
    }

    updateAtPosition(value, position) {
        if (position < 0) {
            console.error('Invalid position: Position cannot be negative.');
            return;
        }

        let current = this.head;
        let index = 0;

        while (current && index < position) {
            current = current.next;
            index++;
        }

        if (current) {
            current.data = value; // Update the data
        } else {
            console.error(`Position ${position} does not exist in the list.`);
        }
    }

    // Deletion methods
    deleteAtHead() {
        if (this.head) {
            this.head = this.head.next; // Move head to the next node
            if (this.head) {
                this.head.prev = null; // Set new head's prev to null
            } else {
                this.tail = null; // If list becomes empty, update tail to null
            }
        }
    }

    deleteAtTail() {
        if (!this.tail) return;

        if (this.tail.prev) {
            this.tail = this.tail.prev; // Move tail to the previous node
            this.tail.next = null; // Set new tail's next to null
        } else {
            this.head = null; // If list becomes empty, update head to null
            this.tail = null; // Also set tail to null
        }
    }

    deleteAtPosition(position) {
        if (position < 0) {
            console.error('Invalid position: Position cannot be negative.');
            return;
        }

        if (position === 0) {
            this.deleteAtHead();
            return;
        }

        let current = this.head;
        let index = 0;

        while (current && index < position) {
            current = current.next;
            index++;
        }

        if (current) {
            if (current.prev) {
                current.prev.next = current.next; // Bypass the current node
            }
            if (current.next) {
                current.next.prev = current.prev; // Bypass the current node
            }
        } else {
            console.error(`Position ${position} does not exist in the list.`);
        }
    }

    // Reverse the doubly linked list
    reverse() {
        let current = this.head;
        let temp = null;
        this.tail = current; // Update tail to the current head

        while (current) {
            temp = current.prev; // Store the previous node
            current.prev = current.next; // Reverse the prev pointer
            current.next = temp; // Reverse the next pointer
            current = current.prev; // Move to the next node
        }

        if (temp) {
            this.head = temp.prev; // Update head to the last processed node
        }
    }

    sourceCode() {
        return {
            title: 'Double Linked List',
            codes: [
            {
                description: 'Node Class of double linked list',
                code:`class Node {
                constructor(data) {
                this.data = data;
                this.next = null;
                this.prev = null;
                }
            }`
            },
            {
                    description: 'Convert an array into double linked list',
                    code: `createDoubleLinkedList(arr) {
                    arr.forEach((item, index) => {
                        const newNode = new Node(item);
                        if (index === 0) {
                            this.head = newNode;
                            this.tail = newNode;
                        } else {
                            newNode.prev = this.tail;
                            this.tail.next = newNode;
                            this.tail = newNode;
                        }
                    });
            }`
            },
                {
                    description: 'Insert Node at the first of the double linked list',
                    code: `insertNodeAtFirst(element) {
                        const newNode = new Node(element);
                        if (this.head) {
                            newNode.next = this.head;
                            this.head.prev = newNode;
                        }
                        this.head = newNode;
                        if (!this.tail) {
                            this.tail = newNode;
                        }
                    }`
                },
                {
                    description: 'Insert Node at the last of the double linked list',
                    code: `insertNodeAtEnd(element) {
                        const newNode = new Node(element);
                        if (!this.tail) {
                            this.head = newNode;
                            this.tail = newNode;
                        } else {
                            newNode.prev = this.tail;
                            this.tail.next = newNode;
                            this.tail = newNode;
                        }
                    }`
                },
                {
                    description: 'Insert Node at the specific position of the double linked list',
                    code: `insertNodeAtPosition(element, position) {
                        const newNode = new Node(element);
                        if (position === 0) {
                            this.insertNodeAtFirst(element);
                        } else {
                            let current = this.head;
                            let count = 0;
                            while (current && count < position) {
                                count++;
                                current = current.next;
                            }
                            if (current) {
                                newNode.next = current;
                                newNode.prev = current.prev;
                                current.prev.next = newNode;
                                current.prev = newNode;
                            } else {
                                this.insertNodeAtEnd(element);
                            }
                        }
                    }`
                },
                {
                    description: 'Delete node at the first of the double linked list',
                    code: `deleteAtFirst() {
                        if (this.head) {
                            this.head = this.head.next;
                            if (this.head) {
                                this.head.prev = null;
                            } else {
                                this.tail = null;
                            }
                        }
                    }`
                },
                {
                    description: 'Delete node at the end of the double linked list',
                    code: `deleteAtEnd() {
                        if (this.tail) {
                            if (this.tail.prev) {
                                this.tail = this.tail.prev;
                                this.tail.next = null;
                            } else {
                                this.head = null;
                                this.tail = null;
                            }
                        }
                    }`
                },
                {
                    description: 'Delete node at the specific position of the double linked list',
                    code: `deleteAtPosition(position) {
                        if (position === 0) {
                            this.deleteAtFirst();
                        } else {
                            let current = this.head;
                            let count = 0;
                            while (current && count < position) {
                                count++;
                                current = current.next;
                            }
                            if (current) {
                                if (current.prev) {
                                    current.prev.next = current.next;
                                }
                                if (current.next) {
                                    current.next.prev = current.prev;
                                }
                            }
                        }
                    }`
                }
            ]
        };
    }
}

export default DoubleLinkedList;
