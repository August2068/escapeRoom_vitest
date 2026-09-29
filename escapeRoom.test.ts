import { describe, expect, it, vitest } from "vitest";
import { Door, Item, Key, Room } from "./escapeRoom";
import { Player } from "./escapeRoom";

describe("Door", () => {
  it("Une porte fermée ne peut pas être franchie", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");

    expect(player.passThroughDoor(door)).toBe(false);
  });
  it("Une porte ouverte peut être franchie", () => {
    const door = new Door();
    const player = new Player("GERARDJUGNOT");
  });
  it("Une porte peut nécéssiter une clé particulière pour être ouverte", () => {
    const key = new Key("red-key");
    const door = new Door(true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);

    expect(player.passThroughDoor(door)).toBe(true);
  });
  it("ouvrir une porte avec une clé supprime la clé de l'inventaire mais conserve les autres objets", () => {
    const key = new Key("red-key");
    const item = new Item("torch");
    const door = new Door(true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);
    player.addItem(item);
    player.passThroughDoor(door);
    expect(player.getInventory()).not.toContainEqual(key);
    expect(player.getInventory()).toContainEqual(item);
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
