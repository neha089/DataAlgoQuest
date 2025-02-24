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
        title:`Single Linked List`,
     codes:[
     {
          description:`Single link node class code snippet`,
          code:`export class SingleLinkNode {
          data: number;
          next: SingleLinkNode | any;
     
          constructor(data: number) {
          this.data = data;
          this.next = null;
          }
     }`
     },
     {
          description:'Convert an array into single linked list',
          code:`createSingleLinkedList(arr: number[]): void {
          for (let i = 0; i < arr.length; i++) {
            const node = new SingleLinkNode(arr[i]);
            if (i === 0) {
                 this.head = node;
                 this.currentNode = this.head;
            } else {
                 this.currentNode.next = node;
                 this.currentNode = node;
            }
          }
     }`
     },
     {
          description:'Insert Node at the start of the linked list',
          code:`insertNodeAtFirst(element: number): void {
          const node = new SingleLinkNode(element);
          this.currentNode = this.head;
          this.head = node;
          this.head.next = this.currentNode;
     }`
     },
     {
          description:'Insert Node at the end of the linked list',
          code:`insertNodeAtEnd(element: number): void {
          const node = new SingleLinkNode(element);
          if (this.head != null) {
               this.currentNode = this.head;
               while (this.currentNode.next !== null) {
               this.currentNode = this.currentNode.next;
               }
               this.currentNode.next = node;
          } else {
               this.head = node;
          }
     }`
     },
     {
          description:'Insert Node at the specific position of the linked list',
          code:`insertNodeAtPosition(element: number, position: number): void {
          if (position === 1 || this.head === null) {
               this.insertNodeAtFirst(element);
               return;
          }
          const node = new SingleLinkNode(element);
          let count = 1;
          this.currentNode = this.head;
          this.previousNode = this.head;
          while (this.currentNode.next !== null) {
               if (count === position) {
               break;
               }
               count++;
               this.previousNode = this.currentNode;
               this.currentNode = this.currentNode.next;
          }
          node.next = this.currentNode;
          this.previousNode.next = node;
     }`
     },
     {
          description:'Delete first node of the linked list',
          code:`deleteAtFirst(): void {
          if (this.head !== null) {
               this.head = this.head.next;
          }
     }`
     },
     {
          description:'Delete last node of the linked list',
          code:`deleteAtEnd(): void {
          if (this.head !== null) {
               this.currentNode = this.head;
               this.previousNode = null;
               while (this.currentNode.next != null) {
                    this.previousNode = this.currentNode;
                    this.currentNode = this.currentNode.next;
               }
               if (this.previousNode != null) {
                   this.previousNode.next = null;
               } else {
                   this.head = null;
               }
          }
     }`
     },
     {
          description:'Delete a specific position node of the linked list',
          code:`deleteAtPosition(position: number): void {
          if (position === 1 || this.head === null) {
               this.deleteAtFirst();
               return;
          }
          let count = 0;
          this.currentNode = this.head;
          while (this.currentNode.next !== null) {
               count++;
               if (count === position) {
               break;
               }
          
               this.previousNode = this.currentNode;
               this.currentNode = this.currentNode.next;
          }
          if (count === position) {
               this.previousNode.next = this.currentNode.next;
          }
     }`
     },
     {
          description:'Convert single linked list into circular linked list',
          code:` convertToCircularLinkedList(): void {
          if (this.head != null) {
               this.currentNode = this.head;
               while (this.currentNode.next !== null) {
                  this.currentNode = this.currentNode.next;
               }
               this.currentNode.next = this.head;
          }
     }`
     },
     {
          description:'Check single linked list is circular linked list or not',
          code:`isCircularLinkedList(): boolean {
          if (this.head === null) {
               return false;
          } else {
               this.currentNode = this.head.next;
               while (this.currentNode.next !== null) {
                    if (this.currentNode === this.head) {
                         return true;
                    }
                    this.currentNode = this.currentNode.next;
               }
               return false;
          }
     }`
     },
     {
          description:'Reverse a single linked list',
          code:`reverseASingleLinkedList(): SingleLinkNode | null {
          if (this.head === null) {
               return this.head;
          } else {
               this.currentNode = this.head.next;
               this.previousNode = this.head;
               this.previousNode.next = null;
               while (this.currentNode !== null) {
                    let temp = this.currentNode;
                    this.currentNode = this.currentNode.next;
                    temp.next = this.previousNode;
                    this.previousNode = temp;
               }
               return this.previousNode;
          }
     }`
     },
     
     ]
     }
    }
}
export default SingleLinkedList;
