import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Voice AI Agent</h1>
      <p>Manage your tasks using voice</p>

      <button
        onClick={() => navigate("/agent")}
        style={{ padding: "10px 20px", fontSize: "18px" }}
      >
        Start Voice Agent
      </button>
    </div>
  );
}