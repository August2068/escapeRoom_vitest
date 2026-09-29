import { describe, expect, it, vitest } from "vitest";
import { Door, Item, Key } from "./escapeRoom";
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
