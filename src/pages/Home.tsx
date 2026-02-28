import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel/Panel";
import PanelList from "../components/PanelList/PanelList";
export default function Home() {
  const entries = [
    {
      title: "Log Entries",
      meta: "Number of log entries here",
      content: "View all log entries.",
      href: "/entries",
    },
  ];
  return (
    <>
      <Navbar />
      <Container>
        <PanelList panels={entries} />
      </Container>
    </>
  );
}
