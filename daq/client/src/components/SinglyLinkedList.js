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

sourceCode(){
    return {
        title:`Double Linked List`,
        codes:[
          {
               description:`Node Class of double linked list`,
               code:`export class DoubleLinkNode {
               data: number;
               next: DoubleLinkNode | any;
               prev: DoubleLinkNode | any;
               constructor(data: number) {
                    this.data = data;
                    this.next = null;
                    this.prev = null;
               }
          }`
          },
          {
               description:`Convert an array into double linked list`,
               code:`createDoubleLinkedList(arr: number[]): void {
               arr.forEach((item: number, index: number) => {
                    const newNode = new DoubleLinkNode(item);
                    if (index === 0) {
                         this.head = newNode;
                         this.currentNode = this.head;
                    } else {
                         newNode.prev = this.currentNode;
                         this.currentNode.next = newNode;
                         this.currentNode = newNode;
                    }
               });
          }`
          },
          {
               description:`Insert Node at the first of the double linked list`,
               code:`insertNodeAtFirst(element: number): void {
               const newNode = new DoubleLinkNode(element);
               this.head.prev = newNode;
               newNode.next = this.head;
               this.head = newNode;
          }`
          },
          {
               description:`Insert Node at the last of the double linked list`,
               code:`insertNodeAtEnd(element: number): void {
               const newNode = new DoubleLinkNode(element);
               if (this.head === null) {
                    this.head = newNode;
               } else {
                    this.currentNode = this.head;
                    while (this.currentNode.next !== null) {
                         this.currentNode = this.currentNode.next;
                    }
                    newNode.prev = this.currentNode;
                    this.currentNode.next = newNode;
               }
          }`
          },
          {
               description:`Insert Node at the specifice position of the double linked list`,
               code:`insertNodeAtPosition(element: number, position: number): void {
               const newNode = new DoubleLinkNode(element);
               if (position === 1 || this.head === null) {
                    this.insertNodeAtFirst(element);
               } else {
                    this.currentNode = this.head;
                    let count = 1;
                    while (this.currentNode.next !== null) {
                         if (count === position) {
                              break;
                         }
                         count++;
                         this.currentNode = this.currentNode.next;
                    }
                    newNode.prev = this.currentNode.prev;
                    this.currentNode.prev.next = newNode;
                    this.currentNode.prev = newNode;
                    newNode.next = this.currentNode;
               }
          }`
          },
          {
               description:`Delete node at the first of the double linked list`,
               code:`deleteAtFirst(): void {
               if (this.head !== null && this.head.next !== null) {
                    this.currentNode = this.head.next;
                    this.currentNode.prev = null;
                    this.head = this.currentNode;
               } else {
                    this.head = null;
               }
          }`
          },
          {
               description:`Delete node at the end of the double linked list`,
               code:`deleteAtEnd(): void {
               if (this.head !== null) {
                    this.currentNode = this.head;
                    while (this.currentNode.next !== null) {
                         this.currentNode = this.currentNode.next;
                    }
                    if (this.currentNode.prev !== null) {
                         this.currentNode.prev.next = null;
                    } else {
                         this.head = null;
                    }
               }
          }`
          },
          {
               description:`Delete node at the specifice position of the double linked list`,
               code:`deleteAtPosition(position: number): void {
               if (position === 1 || this.head === null) {
                    this.deleteAtFirst();
                    return;
               } else {
                    let count = 1;
                    this.currentNode = this.head;
                    while (this.currentNode.next !== null) {
                         if (count === position) {
                              break;
                         }
                         count++;
                         this.currentNode = this.currentNode.next;
                    }
                    if (count === position && this.currentNode.next !== null) {
                         this.currentNode.prev.next = this.currentNode.next;
                         this.currentNode.next.prev = this.currentNode.prev;
                    } else {
                         this.deleteAtEnd();
                    }
               }
          }`
          },
        ]
     }
    }
}
export default SingleLinkedList;
