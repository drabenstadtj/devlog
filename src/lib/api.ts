const BASE_URL = "/api";

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
