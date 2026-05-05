import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import VoiceAgent from "./pages/VoiceAgent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/agent" element={<VoiceAgent />} />
      </Routes>
    </Router>
  );
}

export default App;