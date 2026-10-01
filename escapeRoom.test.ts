import { describe, expect, it, vitest } from "vitest";
import { Door, Item, Key, Room, Riddle, Game, AlarmCode } from "./escapeRoom";
import { Player } from "./escapeRoom";

describe("Door", () => {
  it("Une porte fermée ne peut pas être franchie", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");

    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("Une porte ouverte peut être franchie", () => {
    const door = new Door(false);
    const player = new Player("GERARDJUGNOT");
  });
  it("Une porte peut nécéssiter une clé particulière pour être ouverte", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const key = new Key("red-key");
    const door = new Door(false, true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);

    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
  it("ouvrir une porte avec une clé supprime la clé de l'inventaire mais conserve les autres objets", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const key = new Key("red-key");
    const item = new Item("torch");
    const door = new Door(false, true, key);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);
    player.addItem(item);
    player.passThroughDoor(door, game.getAlarm());
    expect(player.getInventory()).not.toContainEqual(key);
    expect(player.getInventory()).toContainEqual(item);
  });
  it("une porte peut être associée à une énigme, le joueur doit fournir une bonne réponse pour franchir la porte", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    expect(player.solveRiddle(door, "TILALILALA")).toBe(true);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
  it("une porte peut être associée à une énigme, une mauvaise réponse ne permet pas de franchir la porte", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const riddle = new Riddle("JAIMELAMUSIQUE", "TILALILALA");
    const door = new Door(false, true);
    const player = new Player("GERARDJUGNOT");
    door.addRiddle(riddle);
    expect(player.solveRiddle(door, "moi non")).toBe(false);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
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
    expect(player.useItem(item)).toBe(item);
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
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    expect(game.getAlarm().getIsActive()).toBe(false);
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
  });
  it("certaines portes ne peuvent pas êtres franchies lorsque l'alarme est active", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("Une porte qui n'est pas concernée par l'alarme reste franchissable", () => {
    const door = new Door(false);
    const player = new Player("GERARDJUGNOT");
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    expect(game.getAlarm().getIsActive()).toBe(true);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
  it("L'alarme reste active jusqu'à sa désactivation,Une fois l'alarme désactivée, les portes bloquées par l'alarme peuvent être franchies de nouveau", () => {
    const door = new Door(true);
    const player = new Player("GERARDJUGNOT");
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    game.getAlarm().deactivate(alarmCode);
    expect(game.getAlarm().getIsActive()).toBe(false);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
  it("L'alarme peut être désactivée uniquement avec le bon code.", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    expect(() => {
      game.getAlarm().deactivate(new AlarmCode("oskour"));
    }).toThrow("Wrong");
    expect(game.getAlarm().getIsActive()).toBe(true);
    game.getAlarm().deactivate(alarmCode);
    expect(game.getAlarm().getIsActive()).toBe(false);
  });
  it("Le code permettant de désactiver l'alarme est un objet alarm-code, l'utilisation de cet objet le consomme. ", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const player = new Player("GERARDJUGNOT");
    player.addItem(alarmCode);
    game.getAlarm().activate();
    game.getAlarm().deactivate(player.useItem(alarmCode));
    expect(game.getAlarm().getIsActive()).toBe(false);
    expect(player.getInventory().length).toBe(0);
  });
  it("Le code permettant de désactiver l'alarme est un objet alarm-code, sans l'objet pas possible de désactiver l'alarme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const player = new Player("GERARDJUGNOT");
    game.getAlarm().activate();
    expect(() => {
      game.getAlarm().deactivate(player.useItem(alarmCode));
    }).toThrow("item");
    expect(game.getAlarm().getIsActive()).toBe(true);
  });
});

describe("laboratory test", () => {
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / test aucune condition remplie", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / uniquement la clé", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / uniquement l'énigme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.solveRiddle(door, "tous à bord");
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / uniquement l'alarme désactivée", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.addItem(alarmCode);
    game.getAlarm().deactivate(player.useItem(alarmCode));
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / clé + énigme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.solveRiddle(door, "tous à bord");
    player.addItem(key);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / clé + alarme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.addItem(key);
    player.addItem(alarmCode);
    game.getAlarm().deactivate(player.useItem(alarmCode));
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / énigme + alarme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.addItem(alarmCode);
    game.getAlarm().deactivate(player.useItem(alarmCode));
    player.solveRiddle(door, "tous à bord");
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(false);
  });
  it("La porte du laboratoire nécessite: clé du labo,alarme désactivée, énigme résolue / clé + énigme + alarme", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    game.getAlarm().activate();
    const key = new Key("clé du laboratoire");
    const riddle = new Riddle("montez", "tous à bord");
    const door = new Door(true, true, key);
    door.addRiddle(riddle);
    const player = new Player("GERARDJUGNOT");
    player.addItem(alarmCode);
    game.getAlarm().deactivate(player.useItem(alarmCode));
    player.solveRiddle(door, "tous à bord");
    player.addItem(key);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
});

describe("Door deux joueurs requis", () => {
  it("Une porte à deux joueurs ne peut être ouverte que si les deux joueurs sont présents et que chacun possède l'objet nécessaire / un seul joueur est présent", () => {
    const player = new Player("GERARDJUGNOT");
    const item = new Item("Hareng");
    const item2 = new Item("Ashbringer");
    const door = new Door(false);
    player.addItem(item);
    door.addItem([item, item2]);
    expect(() => {
      door.unlock([player]);
    }).toThrow("player");
  });
  it("Une porte à deux joueurs ne peut être ouverte que si les deux joueurs sont présents et que chacun possède l'objet nécessaire / deux joueurs présents mais l'un deux ne possède pas son objet", () => {
    const player = new Player("GERARDJUGNOT");
    const player2 = new Player("Karim Debbache");
    const item = new Item("Hareng");
    const item2 = new Item("Ashbringer");
    const door = new Door(false, true);
    player.addItem(item);
    door.addItem([item, item2]);
    expect(() => {
      door.unlock([player, player2]);
    }).toThrow("players");
  });
  it("Une porte à deux joueurs ne peut être ouverte que si les deux joueurs sont présents et que chacun possède l'objet nécessaire / deux joueurs présents mais possèdent le même objet", () => {
    const player = new Player("GERARDJUGNOT");
    const player2 = new Player("Karim Debbache");
    const item = new Item("Hareng");
    const item2 = new Item("Ashbringer");
    const door = new Door(false, true);
    player.addItem(item);
    player2.addItem(item);
    door.addItem([item, item2]);
    expect(() => {
      door.unlock([player, player2]);
    }).toThrow("An");
  });
  it("Une porte à deux joueurs ne peut être ouverte que si les deux joueurs sont présents et que chacun possède l'objet nécessaire / deux joueurs possède chacun le bon objet", () => {
    const alarmCode = new AlarmCode("1312");
    const game = new Game(alarmCode);
    const player = new Player("GERARDJUGNOT");
    const player2 = new Player("Karim Debbache");
    const item = new Item("Hareng");
    const item2 = new Item("Ashbringer");
    const door = new Door(false, true);
    player.addItem(item);
    player2.addItem(item2);
    door.addItem([item, item2]);
    door.unlock([player, player2]);
    expect(door.getLocked()).toBe(false);
    expect(player.passThroughDoor(door, game.getAlarm())).toBe(true);
    expect(player2.passThroughDoor(door, game.getAlarm())).toBe(true);
  });
});
