import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Entry from "./pages/Entry";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entries/:id" element={<Entry />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
