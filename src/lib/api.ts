import type { EntryData } from "../types/Entry";

const BASE_URL = "http://localhost:3001/api";

export async function getEntries() {
    const res = await fetch(`${BASE_URL}/entries`);
    if (!res.ok) throw new Error("Failed to fetch entries");
    return res.json();
}

export async function getEntry(id: string) {
    const res = await fetch(`${BASE_URL}/entries/${id}`);
    if (!res.ok) throw new Error("Entry not found");
    return res.json();
}

export async function postEntry(data: Omit<EntryData, "id">, password: string) {
    const res = await fetch(`${BASE_URL}/entries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
    }
    return res.json();
}
