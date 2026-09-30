export class Room {
  private items: Item[];
  constructor(items?: Item[]) {
    items ? (this.items = items) : (this.items = []);
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  getItems(): Item[] {
    return this.items;
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (!(index > -1)) {
      return;
    }
    this.items.splice(index, 1);
  }
}

export class Door {
  private isLocked: boolean = false;
  private key?: Key;
  private riddle?: Riddle;

  constructor(locked?: boolean, key?: Key) {
    locked && (this.isLocked = locked);
    key && (this.key = key);
  }

  getLocked(): boolean {
    return this.isLocked;
  }

  setLocked() {
    this.isLocked != this.isLocked;
  }

  getKey(): Key | undefined {
    return this.key;
  }

  addRiddle(riddle: Riddle) {
    this.riddle = riddle;
  }

  getRiddle(): Riddle | undefined {
    return this.riddle;
  }
}

export class Item {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

export class Key extends Item {}

export class Player {
  private name: string;
  private inventory: Item[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addItem(item: Item) {
    this.inventory.push(item);
  }

  removeItem(item: Item): boolean {
    const index = this.inventory.indexOf(item);
    if (!(index > -1)) {
      return false;
    }
    this.inventory.splice(index, 1);
    return true;
  }

  getInventory(): Item[] {
    return this.inventory;
  }

  passThroughDoor(door: Door): boolean {
    const riddle = door.getRiddle();
    if (riddle) {
      return riddle.getIsSolved();
    }
    if (!door.getKey()) {
      return !door.getLocked();
    }
    if (!door.getLocked()) {
      return !door.getLocked();
    }
    const key = this.inventory.find((key) => key === door.getKey());
    return key ? (door.setLocked(), this.removeItem(key)) : false;
  }

  lootItem(room: Room, item: Item): boolean {
    if (!room.getItems().includes(item)) {
      return false;
    }
    if (this.inventory.find((itm) => itm === item)) {
      return false;
    }
    this.addItem(item);
    room.removeItem(item);
    return true;
  }

  useItem(item: Item): boolean {
    if (!this.inventory.find((itm) => itm === item)) {
      throw new Error("You do not have this item");
    }
    return true;
  }

  solveRiddle(door: Door, answer: string): boolean {
    const riddle = door.getRiddle();
    if (riddle?.getIsSolved()) {
      throw new Error("This riddle is already solved");
    }
    return riddle ? riddle.resolve(answer) : true;
  }
}

export class Riddle {
  private enigma: string;
  private answer: string;
  private isSolved: boolean = false;
  private attempt: number = 0;

  constructor(enigma: string, answer: string) {
    this.enigma = enigma;
    this.answer = answer;
  }

  getEnigma(): string {
    return this.enigma;
  }

  getAnswer(): string {
    return this.answer;
  }

  getIsSolved(): boolean {
    return this.isSolved;
  }

  resolve(answer: string): boolean {
    if (answer != this.answer) {
      this.attempt += 1;
      this.attempt >= 3 && this.retribution();
      return this.isSolved;
    }
    this.isSolved = true;
    return this.isSolved;
  }

  retribution() {
    throw new Error("You died");
  }
}
