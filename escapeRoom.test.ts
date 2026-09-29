import { describe, expect, it, vitest } from "vitest";
import { Door } from "./escapeRoom";
import { Player } from "./escapeRoom";

describe("Door", () => {
  it("Une porte fermée ne peut pas être franchie", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");

    expect(player.passThroughDoor(door)).toBe(false);
  });
});
