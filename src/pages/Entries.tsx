import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PanelList from "../components/PanelList/PanelList";
import type { EntryData } from "../types/Entry";
import { getEntries } from "../lib/api";
import Container from "../components/Container";

export default function Entries() {
    const [entries, setEntries] = useState<EntryData[] | null>(null);

    useEffect(() => {
        document.title = "Entries";
    }, []);

    useEffect(() => {
        getEntries().then(setEntries).catch(console.error);
    }, []);

    if (entries === null) return <p>Loading...</p>;
    if (entries.length === 0) return <h2>No entries found.</h2>;

    return (
        <>
            <Navbar />
            <Container>
                <PanelList
                    panels={entries.map((e) => ({
                        ...e,
                        meta: e.date,
                        content: e.description ?? e.content,
                        href: e.id,
                    }))}
                />
            </Container>
        </>
    );
}
