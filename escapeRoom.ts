export class Game {
  private rooms: Room[] = [];
  private doors: Door[] = [];
  private players: Player[] = [];
  private alarm: Alarm;

  constructor(alarmCode: AlarmCode) {
    this.alarm = new Alarm(alarmCode);
  }

  getAlarm(): Alarm {
    return this.alarm;
  }

  addRoom(room: Room): void {
    this.rooms.push(room);
  }

  addDoor(door: Door): void {
    this.doors.push(door);
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }
}

export class Alarm {
  private isActive: boolean = false;
  private alarmCode: AlarmCode;
  constructor(alarmCode: AlarmCode) {
    this.alarmCode = alarmCode;
  }
  getIsActive(): boolean {
    return this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(alarmCode: AlarmCode): void {
    if (alarmCode != this.alarmCode) {
      throw new Error("Wrong code !");
    }
    this.isActive = false;
  }
}

export class Room {
  private items: Item[];
  constructor(items?: Item[]) {
    items ? (this.items = items) : (this.items = []);
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  getItems(): Item[] {
    return this.items;
  }

  removeItem(item: Item): void {
    const index = this.items.indexOf(item);
    if (!(index > -1)) {
      return;
    }
    this.items.splice(index, 1);
  }
}

export class Door {
  private isAlarmSensitive: boolean;
  private isLocked: boolean = false;
  private key?: Key;
  private riddle?: Riddle;

  constructor(isAlarmSensitive: boolean, locked?: boolean, key?: Key) {
    this.isAlarmSensitive = isAlarmSensitive;
    locked && (this.isLocked = locked);
    key && (this.key = key);
  }

  getLocked(): boolean {
    return this.isLocked;
  }

  setLocked(): void {
    this.isLocked != this.isLocked;
  }

  getKey(): Key | undefined {
    return this.key;
  }

  addRiddle(riddle: Riddle): void {
    this.riddle = riddle;
  }

  getRiddle(): Riddle | undefined {
    return this.riddle;
  }

  getisAlarmSensitive(): boolean {
    return this.isAlarmSensitive;
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

export class AlarmCode extends Item {}

export class Player {
  private name: string;
  private inventory: Item[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addItem(item: Item): void {
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

  passThroughDoor(door: Door, alarm: Alarm): boolean {
    if (door.getisAlarmSensitive() && alarm.getIsActive()) {
      return false;
    }
    const riddle = door.getRiddle();
    if (riddle) {
      if (riddle.getIsSolved() && door.getKey()) {
        const key = this.inventory.find((key) => key === door.getKey());
        return key ? (door.setLocked(), this.removeItem(key)) : false;
      }
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

  useItem(item: Item): Item {
    if (!this.inventory.find((itm) => itm === item)) {
      throw new Error("You do not have this item");
    }
    this.removeItem(item);
    return item;
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

  retribution(): void {
    throw new Error("You died");
  }
}
