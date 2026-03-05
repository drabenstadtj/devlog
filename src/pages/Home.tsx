import { useEffect, useState } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import PanelList from "../components/PanelList/PanelList";
import { getEntryCount } from "../lib/api";
export default function Home() {
    const [entryCount, setEntryCount] = useState(0);

    useEffect(() => {
        getEntryCount().then(setEntryCount).catch(console.error);
    }, []);

    return (
        <>
            <Navbar />
            <Container>
                <PanelList
                    panels={[
                        {
                            title: "Log Entries",
                            meta: `${entryCount} entries`,
                            content: "View all log entries.",
                            href: "/entries",
                        },
                    ]}
                />
            </Container>
        </>
    );
}
