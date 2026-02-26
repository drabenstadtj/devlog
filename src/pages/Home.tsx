import Navbar from "../components/Navbar";
import Panel from "../components/Panel/Panel";
import PanelList from "../components/PanelList/PanelList";
export default function Home() {
  const entries = [
    {
      title: "Robot AI System",
      meta: "Feb 23, 2026",
      content: "Designing the enemy AI...",
    },
    {
      title: "Retrospective",
      meta: "Feb 23, 2026",
      content: "Catching up after a long gap...",
    },
  ];
  return (
    <>
      <Navbar />
      <PanelList panels={entries} />
    </>
  );
}
