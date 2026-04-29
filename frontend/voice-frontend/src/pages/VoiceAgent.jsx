import { useState, useRef, useEffect } from "react";

export default function VoiceAgent() {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [memory, setMemory] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatRef = useRef(null);

  const fetchData = async () => {
    const res = await fetch("http://localhost:8000/data");
    const data = await res.json();
    setTasks(data.tasks || []);
    setMemory(data.memory || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    recorder.stop();
    setRecording(false);

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        setMessages((prev) => [...prev, { role: "user", text: "..." }]);

        const res = await fetch("http://localhost:8000/voice", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "user",
            text: data.input_text,
          };
          return [...updated, { role: "ai", text: data.response_text }];
        });

        const audio = new Audio(
          `http://localhost:8000/audio/${data.audio_file}`
        );
        audio.play();

        fetchData();
      } catch (err) {
        console.log(err);
      }
    };
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background:
          "linear-gradient(135deg, #0B0F1A, #1A1F36, #2A1E5C)",
        color: "white",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 2, padding: "20px" }}>
        <h2>Lunara AI</h2>

        {/* CHAT BOX */}
        <div
          ref={chatRef}
          style={{
            height: "65vh",
            overflowY: "auto",
            padding: "15px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #2563eb, #3b82f6)"
                      : "rgba(55,65,81,0.8)",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  maxWidth: "60%",
                  backdropFilter: "blur(8px)",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* MIC */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            onClick={recording ? stopRecording : startRecording}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              fontSize: "28px",
              backgroundColor: recording ? "#ef4444" : "#3b82f6",
              border: "none",
              color: "white",
              boxShadow: recording
                ? "0 0 25px #ef4444"
                : "0 0 25px #3b82f6",
            }}
          >
            {recording ? "⏹" : "🎤"}
          </button>

          <p style={{ marginTop: "10px" }}>
            {recording ? "Listening..." : "Tap to speak"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* TASKS CARD */}
        <div
          style={{
            padding: "15px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3>Tasks</h3>

          {tasks.length === 0 && <p>No tasks</p>}

          {tasks.map((t) => (
            <div key={t.id} style={{ marginTop: "10px" }}>
              {t.title} {t.completed ? "✅" : "⏳"}
            </div>
          ))}
        </div>

        {/* MEMORY CARD */}
        <div
          style={{
            padding: "15px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3>Memory</h3>

          {memory.length === 0 && <p>No memory</p>}

          {memory.map((m, i) => (
            <div key={i} style={{ marginTop: "10px" }}>
              📌 {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}