import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel/Panel";
import type { EntryData } from "../types/Entry";
import { getEntry } from "../lib/api";
import Container from "../components/Container";

export default function Entry() {
  const { id } = useParams();
  const [entry, setEntry] = useState<EntryData | null>(null);

  useEffect(() => {
    getEntry(id!).then(setEntry).catch(console.error);
  }, [id]);

  if (!entry) return <p>Entry not found.</p>;

  document.title = entry.title;

  return (
    <>
      <Navbar />
      <Container>
        <Panel {...entry} meta={entry.date} />
      </Container>
    </>
  );
}
