import { describe, expect, it, vitest } from "vitest";
import { Door } from "./escapeRoom";
import { Player } from "./escapeRoom";

describe("Door", () => {
  const door = new Door(false);
  const player = new Player("GERARDJUGNOT");

  expect(player.passThroughDoor(door)).toBe(false);
});
