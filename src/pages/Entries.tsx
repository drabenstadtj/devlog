import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PanelList from "../components/PanelList/PanelList";
import type { EntryData } from "../types/Entry";
import { getEntries, getTags } from "../lib/api";
import Container from "../components/Container";
import { useSearchParams } from "react-router-dom";
import Panel from "../components/Panel/Panel";
import FilterList from "../components/FilterList/FilterList";
import StatusMessage from "../components/StatusMessage/StatusMessage";

export default function Entries() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tags, setTags] = useState<string[] | null>();
    const [entries, setEntries] = useState<EntryData[] | null>(null);

    const activeTags = searchParams.get("tags")?.split(",") ?? [];

    function toggleTag(tag: string) {
        const next = activeTags.includes(tag)
            ? activeTags.filter((t) => t !== tag)
            : [...activeTags, tag];

        next.length
            ? setSearchParams({ tags: next.join(",") })
            : setSearchParams({});
    }

    useEffect(() => {
        document.title = "Entries";
    }, []);

    useEffect(() => {
        getTags().then(setTags).catch(console.error);
    }, []);

    const [error, setError] = useState(false);

    useEffect(() => {
        getEntries()
            .then(setEntries)
            .catch(() => setError(true));
    }, []);

    if (error)
        return (
            <StatusMessage statusText="There was an error loading entries." />
        );
    if (entries === null) return <StatusMessage statusText="Loading..." />;
    if (entries.length === 0)
        return <StatusMessage statusText="No entries here." />;

    return (
        <>
            <Navbar />
            <Container>
                <Panel title="Filter by tags" collapsible={true}>
                    <FilterList
                        tags={tags ?? []}
                        activeTags={activeTags}
                        onToggle={toggleTag}
                        onClear={() => setSearchParams({})}
                    />
                </Panel>
                <PanelList
                    panels={
                        activeTags.length !== 0
                            ? entries
                                  .filter((e) =>
                                      e.tags?.some((tag) =>
                                          activeTags.includes(tag),
                                      ),
                                  )
                                  .map((e) => ({
                                      ...e,
                                      meta: e.date,
                                      content: e.description ?? e.content,
                                      href: e.id,
                                  }))
                            : entries.map((e) => ({
                                  ...e,
                                  meta: e.date,
                                  content: e.description ?? e.content,
                                  href: e.id,
                              }))
                    }
                />
            </Container>
        </>
    );
}
