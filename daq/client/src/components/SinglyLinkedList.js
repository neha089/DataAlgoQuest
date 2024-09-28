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
  
  visualize() {
    let current = this.head;
    let result = [];
    while (current) {
        result.push(current.data);
        current = current.next;
    }
  }
  // Insertion methods
  insertAtHead(data) {
      const newNode = new Node(data);
      newNode.next = this.head;
      this.head = newNode;
  }

  insertAtTail(data) {
      const newNode = new Node(data);
      if (!this.head) {
          this.head = newNode;
      } else {
          let current = this.head;
          while (current.next) {
              current = current.next;
          }
          current.next = newNode;
      }
  }

  insertAtPosition(data, position) {
      if (position === 0) {
          this.insertAtHead(data);
      } else {
          const newNode = new Node(data);
          let current = this.head;
          for (let i = 0; i < position - 1 && current; i++) {
              current = current.next;
          }
          if (current) {
              newNode.next = current.next;
              current.next = newNode;
          }
      }
  }

  // Update methods
  updateAtHead(value) {
      if (this.head) {
          this.head.data = value;
      }
  }

  updateAtTail(value) {
      if (this.head) {
          let current = this.head;
          while (current.next) {
              current = current.next;
          }
          current.data = value;
      }
  }

  updateAtPosition(value, position) {
    // Check if position is valid
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
          this.head = this.head.next;
      }
  }

  deleteAtTail() {
      if (!this.head) return;

      if (!this.head.next) {
          this.head = null;
          return;
      }

      let current = this.head;
      while (current.next && current.next.next) {
          current = current.next;
      }
      current.next = null;
  }

  deleteAtPosition(position) {
    if (position < 0) {
        console.error('Invalid position: Position cannot be negative.');
        return;
    }

    if (position === 0 && this.head) {
        this.head = this.head.next;
    } else {
        let current = this.head;
        let previous = null;
        let index = 0;

        while (current && index < position) {
            previous = current;
            current = current.next;
            index++;
        }

        // If we found the position to delete
        if (previous && current) {
            previous.next = current.next; // Bypass the current node
        } else {
            console.error(`Position ${position} does not exist in the list.`);
        }
    if (current) {
      if (previous) {
          previous.next = current.next;
      }
      this.visualize(); // Log the updated list
  }}
}

  // Reverse the linked list
  reverse() {
      let previous = null;
      let current = this.head;
      while (current) {
          let nextNode = current.next;
          current.next = previous;
          previous = current;
          current = nextNode;
      }
      this.head = previous;
  }
}

export default SingleLinkedList;
