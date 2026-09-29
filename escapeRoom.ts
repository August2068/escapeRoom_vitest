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
}
