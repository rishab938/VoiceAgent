import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, User, ListTodo, Brain, Pin, MoreVertical, Settings, Sparkles } from "lucide-react";

export default function VoiceAgent() {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [memory, setMemory] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/data");
      const data = await res.json();
      setTasks(data.tasks || []);
      setMemory(data.memory || []);
    } catch (err) {
      console.error("Data fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
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
          updated[updated.length - 1] = { role: "user", text: data.input_text };
          return [...updated, { role: "ai", text: data.response_text }];
        });
        const audio = new Audio(`http://localhost:8000/audio/${data.audio_file}`);
        audio.play();
        fetchData();
      } catch (err) {
        console.error("Voice processing error:", err);
      }
    };
  };

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      color: "white",
      background: "transparent"
    }}>
      
      {/* TOP BAR */}
      <header style={{ 
        height: "80px", 
        padding: "0 40px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            borderRadius: "10px", 
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
          }}>
            <Sparkles size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>Lunara AI</h1>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
            </div>
          </div>
        </div>
        
        <div style={{ 
          width: "44px", 
          height: "44px", 
          borderRadius: "14px", 
          background: "rgba(255,255,255,0.05)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          border: "1px solid rgba(255,255,255,0.1)", 
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <User size={20} color="#94A3B8" />
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main style={{ 
        flex: 1, 
        display: "grid", 
        gridTemplateColumns: "7fr 3fr", 
        padding: "0 40px 40px", 
        gap: "30px", 
        overflow: "hidden" 
      }}>
        
        {/* LEFT: CHAT SECTION */}
        <section style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <div className="glass-card" style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            overflow: "hidden",
            position: "relative"
          }}>
            
            {/* Chat Container */}
            <div 
              ref={chatRef}
              className="scrollbar-hide"
              style={{ 
                flex: 1, 
                overflowY: "auto", 
                padding: "40px", 
                display: "flex", 
                flexDirection: "column", 
                gap: "24px" 
              }}
            >
              {messages.length === 0 ? (
                <div style={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center",
                  opacity: 0.2
                }}>
                  <Sparkles size={64} style={{ marginBottom: "20px" }} />
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>How can I help you today?</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        width: "100%"
                      }}
                    >
                      <div style={{
                        maxWidth: "70%",
                        padding: "16px 24px",
                        borderRadius: msg.role === "user" ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                        background: msg.role === "user" 
                          ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                          : "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: msg.role === "user" ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)" : "none",
                        fontSize: "15px",
                        lineHeight: "1.5",
                        color: "#FFFFFF",
                        position: "relative"
                      }}>
                        {msg.text}
                        <div style={{ 
                          fontSize: "10px", 
                          marginTop: "8px", 
                          opacity: 0.4, 
                          textAlign: msg.role === "user" ? "right" : "left",
                          fontWeight: "500"
                        }}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Mic Section */}
            <div style={{ 
              height: "160px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "16px",
              background: "linear-gradient(to top, rgba(11, 15, 26, 0.5), transparent)",
              borderTop: "1px solid rgba(255,255,255,0.03)"
            }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {recording && (
                  <div style={{ 
                    position: "absolute", 
                    display: "flex", 
                    gap: "4px", 
                    alignItems: "center",
                    justifyContent: "center",
                    width: "120px"
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="waveform-bar" style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: `${15 + Math.random() * 30}px`,
                        background: recording ? "#EF4444" : "#3B82F6"
                      }} />
                    ))}
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={recording ? stopRecording : startRecording}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    border: "none",
                    background: recording ? "#EF4444" : "#3B82F6",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: recording 
                      ? "0 0 30px rgba(239, 68, 68, 0.6)" 
                      : "0 0 30px rgba(59, 130, 246, 0.4)",
                    zIndex: 10,
                    transition: "background 0.3s ease"
                  }}
                >
                  <Mic size={28} fill={recording ? "white" : "none"} />
                </motion.button>
              </div>
              
              <p style={{ 
                fontSize: "12px", 
                color: "#94A3B8", 
                letterSpacing: "1.5px", 
                fontWeight: "700",
                textTransform: "uppercase"
              }}>
                {recording ? "Listening..." : "Tap to speak"}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: SIDE PANEL */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "30px", height: "100%" }}>
          
          {/* TASKS CARD */}
          <div className="glass-card" style={{ flex: 1.2, padding: "28px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ 
                  width: "36px", 
                  height: "36px", 
                  borderRadius: "10px", 
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <ListTodo size={20} color="#3B82F6" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Tasks</h3>
              </div>
              <MoreVertical size={18} color="#4B5563" style={{ cursor: "pointer" }} />
            </div>

            <div className="scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto" }}>
              {tasks.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, minHeight: "100px" }}>
                  <p style={{ fontSize: "14px" }}>No active tasks</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={task.id} 
                    style={{ 
                      padding: "16px", 
                      background: "rgba(255,255,255,0.03)", 
                      borderRadius: "16px", 
                      border: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{task.title}</span>
                    <span style={{ 
                      fontSize: "10px", 
                      padding: "4px 10px", 
                      borderRadius: "8px", 
                      background: task.status === "completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: task.status === "completed" ? "#10B981" : "#F59E0B",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      border: `1px solid ${task.status === "completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`
                    }}>
                      {task.status || "Pending"}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* MEMORY CARD */}
          <div className="glass-card" style={{ flex: 1, padding: "28px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ 
                  width: "36px", 
                  height: "36px", 
                  borderRadius: "10px", 
                  background: "rgba(139, 92, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Brain size={20} color="#8B5CF6" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Memory</h3>
              </div>
              <Settings size={18} color="#4B5563" style={{ cursor: "pointer" }} />
            </div>

            <div className="scrollbar-hide" style={{ display: "flex", flexWrap: "wrap", gap: "14px", overflowY: "auto" }}>
              {memory.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, minHeight: "100px" }}>
                  <p style={{ fontSize: "14px" }}>Memory is empty</p>
                </div>
              ) : (
                memory.map((mem, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    style={{ 
                      padding: "16px", 
                      background: "#FEF9C3", 
                      borderRadius: "4px", 
                      width: "100%",
                      position: "relative",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.2)",
                      transform: `rotate(${Math.sin(i) * 2}deg)`
                    }}
                  >
                    <Pin size={12} color="#A16207" style={{ position: "absolute", top: "8px", right: "8px" }} />
                    <p style={{ fontSize: "13px", color: "#854D0E", fontWeight: "600", lineHeight: "1.4" }}>{mem}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
}