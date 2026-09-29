export class Door {
  private isLocked: boolean = false;
  private key?: Key;

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
    if (!door.getKey()) {
      return !door.getLocked();
    }
    const key = this.inventory.find((key) => key === door.getKey());
    return key ? this.removeItem(key) : false;
  }
}
