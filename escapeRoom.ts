export class Door {
  private locked: boolean = false;

  constructor(locked?: boolean) {
    locked && (this.locked = locked);
  }

  getLocked(): boolean {
    return this.locked;
  }

  setLocked() {
    this.locked != this.locked;
  }
}

export class Player {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  passThroughDoor(door: Door): boolean {
    return !door.getLocked();
  }
}
