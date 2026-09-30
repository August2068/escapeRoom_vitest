import { describe, expect, it, vitest } from "vitest";
import { Door, Item, Key, Room, Riddle, Game, Alarm } from "./escapeRoom";
import { Player } from "./escapeRoom";

describe("Door", () => {
  it("Une porte fermée ne peut pas être franchie", () => {
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");

    expect(player.passThroughDoor(door)).toBe(false);
  });
  it("Une porte ouverte peut être franchie", () => {
    const door = new Door(false);
    const player = new Player("GERARDJUGNOT");
  });
  it("Une porte peut nécéssiter une clé particulière pour être ouverte", () => {
    const key = new Key("red-key");
    const door = new Door(false, true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);

    expect(player.passThroughDoor(door)).toBe(true);
  });
  it("ouvrir une porte avec une clé supprime la clé de l'inventaire mais conserve les autres objets", () => {
    const key = new Key("red-key");
    const item = new Item("torch");
    const door = new Door(false, true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);
    player.addItem(item);
    player.passThroughDoor(door);
    expect(player.getInventory()).not.toContainEqual(key);
    expect(player.getInventory()).toContainEqual(item);
  });
  it("une porte peut être associée à une énigme, le joueur doit fournir une bonne réponse pour franchir la porte", () => {
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    expect(player.solveRiddle(door, "TILALILALA")).toBe(true);
    expect(player.passThroughDoor(door)).toBe(true);
  });
  it("une porte peut être associée à une énigme, une mauvaise réponse ne permet pas de franchir la porte", () => {
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    expect(player.solveRiddle(door, "moi non")).toBe(false);
    expect(player.passThroughDoor(door)).toBe(false);
  });
});

describe("Player", () => {
  it("lorsqu'un joueur ramasse un objet, celui-ci est ajouté à son inventaire et retiré de la salle", () => {
    const item = new Item("torch");
    const room = new Room();
    const player = new Player("GERARDJUGNOT");
    room.addItem(item);
    player.lootItem(room, item);
    expect(room.getItems()).not.toContainEqual(item);
    expect(player.getInventory()).toContainEqual(item);
  });
  it("un objet déjà ramassé ne peut pas être ramassé une seconde fois", () => {
    const item = new Item("torch");
    const room = new Room();
    const player = new Player("GERARDJUGNOT");
    room.addItem(item);
    room.addItem(item);
    player.lootItem(room, item);
    expect(player.lootItem(room, item)).toBe(false);
    expect(player.getInventory().length).toBe(1);
  });
  it("un objet déjà ramassé ne peut pas être ramassé une seconde fois", () => {
    const item = new Item("torch");
    const room = new Room();
    const player = new Player("GERARDJUGNOT");
    room.addItem(item);
    room.addItem(item);
    player.lootItem(room, item);
    expect(player.lootItem(room, item)).toBe(false);
    expect(player.getInventory().length).toBe(1);
  });
  it("un objet non présent dans une salle ne peut pas être ramassé", () => {
    const item = new Item("torch");
    const room = new Room();
    const player = new Player("GERARDJUGNOT");
    room.addItem(item);
    player.lootItem(room, item);
    expect(player.lootItem(room, item)).toBe(false);
    expect(player.getInventory().length).toBe(1);
  });
  it("un joueur ne peut utiliser qu'un objet qu'il possède dans son inventaire", () => {
    const item = new Item("torch");
    const item2 = new Item("dagger");
    const player = new Player("GERARDJUGNOT");
    player.addItem(item);
    expect(() => player.useItem(item2)).toThrow("item");
    expect(player.useItem(item)).toBe(true);
  });
});

describe("Riddle", () => {
  it("une énigme ne peut pas être résolue une seconde fois", () => {
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    player.solveRiddle(door, "TILALILALA");
    expect(() => player.solveRiddle(door, "TILALILALA")).toThrow("already");
  });
  it("chaque mauvaise réponse augmente le nbre de tentatives, après 3 une conséquence doit être déclenchées", () => {
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    player.solveRiddle(door, "moi non");
    player.solveRiddle(door, "moi non");
    expect(() => player.solveRiddle(door, "moi non")).toThrow("died");
  });
  it("chaque mauvaise réponse augmente le nbre de tentatives, à 2 mauvaise réponse on peut toujours résoudre l'énigme", () => {
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    player.solveRiddle(door, "moi non");
    player.solveRiddle(door, "moi non");
    expect(player.solveRiddle(door, "TILALILALA")).toBe(true);
  });
});

describe("Alarm", () => {
  it("l'alarme peut être inactive ou active et une action permet de déclencher l'alarme", () => {
    const game = new Game();
    expect(game.getAlarm().getIsActive()).toBe(false);
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
  });
  it("certaines portes ne peuvent pas êtres franchies lorsque l'alarme est active", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");
    const game = new Game();
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("Une porte qui n'est pas concernée par l'alarme reste franchissable", () => {
    const door = new Door(false);
    const player = new Player("GERARDJUGNOT");
    const game = new Game();
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
  it("L'alarme reste active jusqu'à sa désactivation", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");
    const game = new Game();
    game.getAlarm().activate();
    game.getAlarm().deactivate();
    expect(game.getAlarm().getIsActive()).toBe(false);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
});
