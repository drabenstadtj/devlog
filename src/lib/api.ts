import type { EntryData } from "../types/Entry";

const SERVER_URL = "http://localhost:3001";
const BASE_URL = `${SERVER_URL}/api`;

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
            Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
    }
    return res.json();
}
export async function putEntry(data: EntryData, password: string) {
    const res = await fetch(`${BASE_URL}/entries/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
    }
    return res.json();
}

export async function getTags() {
    const res = await fetch(`${BASE_URL}/entries/tags`);
    if (!res.ok) throw new Error("Failed to fetch tags");
    return res.json();
}

export async function uploadImage(file: File, password: string) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${BASE_URL}/images/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${password}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
    }
    const { url } = await res.json();
    return { url: `${SERVER_URL}${url}` };
}

export async function getEntryCount() {
    const res = await fetch(`${BASE_URL}/entries/count`);
    if (!res.ok) throw new Error("Failed to fetch count");
    return res.json();
}
