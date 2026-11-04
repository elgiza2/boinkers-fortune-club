import { describe, it, expect } from "vitest";
import { addPassXp, passGift, passNeed } from "./game";
describe("spin pass", () => {
  it("each spin used adds XP and levels up at the threshold", () => {
    const r = addPassXp(99, 1, 1, false);
    expect(r.level).toBe(2); expect(r.xp).toBe(0);
  });
  it("higher levels need more XP", () => { expect(passNeed(5)).toBeGreaterThan(passNeed(1)); });
  it("premium gifts are double plus a ticket", () => {
    const f = passGift(4, false), p = passGift(4, true);
    expect(p.coins).toBe(f.coins * 2); expect(p.tickets).toBe(1); expect(f.tickets).toBe(0);
  });
});
