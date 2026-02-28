import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Entry from "./pages/Entry";
import Entries from "./pages/Entries";
import Editor from "./components/Editor/Editor";

function App() {
  return (
    <>
      <div className="overlay-noise" />
      <div className="overlay-scanlines" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/entries/:id" element={<Entry />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
