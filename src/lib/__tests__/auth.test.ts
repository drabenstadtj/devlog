import { describe, it, expect, beforeEach } from "vitest";
import {
    getPassword,
    setPassword,
    clearPassword,
    isAuthenticated,
} from "../auth";

beforeEach(() => localStorage.clear());

describe("setPassword / getPassword", () => {
    it("stores and retrieves a password", () => {
        setPassword("secret");
        expect(getPassword()).toBe("secret");
    });

    it("returns null when nothing is stored", () => {
        expect(getPassword()).toBeNull();
    });
});

describe("clearPassword", () => {
    it("removes the stored password", () => {
        setPassword("secret");
        clearPassword();
        expect(getPassword()).toBeNull();
    });
});

describe("isAuthenticated", () => {
    it("returns false when no password is stored", () => {
        expect(isAuthenticated()).toBe(false);
    });

    it("returns true when a password is stored", () => {
        setPassword("secret");
        expect(isAuthenticated()).toBe(true);
    });

    it("returns false after clearing", () => {
        setPassword("secret");
        clearPassword();
        expect(isAuthenticated()).toBe(false);
    });
});
