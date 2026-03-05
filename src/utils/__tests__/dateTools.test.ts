import { describe, it, expect } from "vitest";
import { getCurrentDate } from "../dateTools";

describe("getCurrentDate", () => {
    it("returns MM/DD/YYYY format", () => {
        expect(getCurrentDate()).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
});
