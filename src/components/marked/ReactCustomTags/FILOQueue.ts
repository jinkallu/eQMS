export default class FILOQueue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // Enqueue: Add an element to the end of the queue
    enqueue(element: T): void {
        this.items.push(element);
    }

    // Dequeue: Remove and return the last element from the queue
    dequeue(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop()!;
    }

    // Peek: Return the last element without removing it
    peek(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // Update the last pushed object
    updateLastObject(updatedObject: Partial<T>): void {
        if (this.items.length > 0) {
            // Get the last element in the array
            const lastObject = this.items[this.items.length - 1];

            // Update properties of the last object
            Object.assign(lastObject, updatedObject);
        }
    }


    // Check if the queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.items.length;
    }

    // Clear the queue
    clear(): void {
        this.items = [];
    }
}