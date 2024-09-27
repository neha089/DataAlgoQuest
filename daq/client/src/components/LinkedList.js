class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class SingleLinkedList {
    constructor() {
        this.head = null;
    }
    insert(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.visualize(); // Call visualize after insertion
    }

visualize() {
    const listContainer = document.getElementById('linked-list-visualization');
    listContainer.innerHTML = ''; // Clear previous visualization
    let current = this.head;

    while (current) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.innerHTML = `
            <span>${current.data}</span>
            <img src="${image}" width="50" height="20" alt="arrow" />
        `;
        listContainer.appendChild(nodeElement);
        current = current.next;
    }
}

    insertAtHead(data) {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
    }

    insertAtTail(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    insertAtPosition(data, position) {
        if (position < 0) return;
        if (position === 0) {
            this.insertAtHead(data);
            return;
        }
        const newNode = new Node(data);
        let current = this.head;
        for (let i = 0; i < position - 1; i++) {
            if (!current) return; // Position is greater than the list length
            current = current.next;
        }
        newNode.next = current.next;
        current.next = newNode;
    }
  
    // Update the value at the head
    updateAtHead(value) {
      if (this.head) {
        this.head.value = value;
      } else {
        throw new Error("List is empty");
      }
    }
  
    // Update the value at the tail
    updateAtTail(value) {
      if (!this.head) {
        throw new Error("List is empty");
      }
  
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
  
      current.value = value;
    }
  
    // Update value at a specific position
    updateAtPosition(value, position) {
      if (position < 1 || position > this.size) {
        throw new Error("Invalid position");
      }
  
      let current = this.head;
      let currentPosition = 1;
  
      while (currentPosition < position) {
        current = current.next;
        currentPosition++;
      }
  
      current.value = value;
    }
  
    // Delete the head node
    deleteAtHead() {
      if (this.head) {
        this.head = this.head.next;
        this.size--;
      } else {
        throw new Error("List is empty");
      }
    }
  
    // Delete the tail node
    deleteAtTail() {
      if (!this.head) {
        throw new Error("List is empty");
      }
  
      if (!this.head.next) {
        this.head = null;
      } else {
        let current = this.head;
        let prev = null;
  
        while (current.next) {
          prev = current;
          current = current.next;
        }
  
        prev.next = null;
      }
  
      this.size--;
    }
  
    // Delete at a specific position
    deleteAtPosition(position) {
      if (position < 1 || position > this.size) {
        throw new Error("Invalid position");
      }
  
      if (position === 1) {
        this.deleteAtHead();
      } else {
        let current = this.head;
        let prev = null;
        let currentPosition = 1;
  
        while (currentPosition < position) {
          prev = current;
          current = current.next;
          currentPosition++;
        }
  
        prev.next = current.next;
        this.size--;
      }
    }
  
    // Reverse the linked list
    reverse() {
      let prev = null;
      let current = this.head;
      let next = null;
  
      while (current) {
        next = current.next;
        current.next = prev;
        prev = current;
        current = next;
      }
  
      this.head = prev;
    }
  
    // Display the linked list
    display() {
      let current = this.head;
      const elements = [];
      while (current) {
        elements.push(current.value);
        current = current.next;
      }
      return elements;
    }
  }
  
  export default SingleLinkedList;
  