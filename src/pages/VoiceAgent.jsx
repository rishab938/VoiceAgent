import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, User, ListTodo, Brain, Pin, MoreVertical, Settings, Sparkles, ChevronRight } from "lucide-react";

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
      const res = await fetch("/data");
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
        const res = await fetch("/voice", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "user", text: data.input_text };
          return [...updated, { role: "ai", text: data.response_text }];
        });
        const audio = new Audio(`/audio/${data.audio_file}`);
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
      background: "transparent",
      position: "relative"
    }}>
      
      {/* HEADER */}
      <header style={{ 
        height: "90px", 
        padding: "0 60px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        zIndex: 50,
        background: "rgba(11, 15, 26, 0.2)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "12px", 
            background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)"
          }}>
            <Sparkles size={22} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-1px" }}>Ather AI</h1>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
           <div className="glass" style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <Settings size={20} color="#94A3B8" />
          </div>
          <div className="glass" style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "14px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer"
          }}>
            <User size={20} color="#94A3B8" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main style={{ 
        flex: 1, 
        display: "grid", 
        gridTemplateColumns: "1.2fr 0.5fr", 
        padding: "30px 60px 40px", 
        gap: "40px", 
        overflow: "hidden" 
      }}>
        
        {/* LEFT PANEL: CHAT */}
        <section className="glass-card" style={{ 
          display: "flex", 
          flexDirection: "column", 
          height: "100%", 
          overflow: "hidden",
          borderRadius: "32px",
          position: "relative"
        }}>
          {/* Chat Area */}
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
                opacity: 0.3
              }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={80} color="#8B5CF6" style={{ marginBottom: "20px" }} />
                </motion.div>
                <p style={{ fontSize: "20px", fontWeight: "600", color: "#94A3B8" }}>Talk to Ather AI</p>
                <p style={{ fontSize: "14px", color: "#64748B", marginTop: "8px" }}>"Remind me to call John at 5 PM"</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      width: "100%"
                    }}
                  >
                    <div style={{
                      maxWidth: "75%",
                      padding: "18px 24px",
                      borderRadius: msg.role === "user" ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                      background: msg.role === "user" 
                        ? "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)" 
                        : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: msg.role === "user" ? "0 10px 25px -5px rgba(139, 92, 246, 0.4)" : "none",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#FFFFFF",
                      backdropFilter: msg.role === "ai" ? "blur(12px)" : "none"
                    }}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* VOICE SECTION (BOTTOM CENTER) */}
          <div style={{ 
            padding: "40px",
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "20px",
            background: "linear-gradient(to top, rgba(11, 15, 26, 0.6), transparent)",
            borderTop: "1px solid rgba(255,255,255,0.03)"
          }}>
            {/* Waveform Animation */}
            <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
              {recording && (
                <div className="wave-container">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="wave-bar" style={{ 
                      animationDelay: `${i * 0.1}s`,
                      height: `${10 + Math.random() * 30}px`,
                      width: "3px",
                      background: "linear-gradient(to bottom, #8B5CF6, #D946EF)"
                    }} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={recording ? stopRecording : startRecording}
                style={{
                  width: "84px",
                  height: "84px",
                  borderRadius: "50%",
                  border: "none",
                  background: recording ? "linear-gradient(135deg, #EF4444, #F87171)" : "linear-gradient(135deg, #8B5CF6, #D946EF)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: recording 
                    ? "0 0 50px rgba(239, 68, 68, 0.5)" 
                    : "0 10px 40px rgba(139, 92, 246, 0.5)",
                  zIndex: 10,
                  position: "relative"
                }}
              >
                <Mic size={32} fill={recording ? "white" : "none"} />
                {recording && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "rgba(239, 68, 68, 0.5)",
                      zIndex: -1
                    }}
                  />
                )}
              </motion.button>
            </div>
            
            <p style={{ 
              fontSize: "12px", 
              color: "#94A3B8", 
              letterSpacing: "2px", 
              fontWeight: "800",
              textTransform: "uppercase"
            }}>
              {recording ? "Recording..." : "Tap to speak"}
            </p>
          </div>
        </section>

        {/* RIGHT PANEL: TASKS & MEMORY */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "30px", height: "100%" }}>
          
          {/* TASKS CARD */}
          <div className="glass-card" style={{ flex: 1.2, padding: "30px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "12px", 
                  background: "rgba(139, 92, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <ListTodo size={20} color="#8B5CF6" />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Tasks</h3>
              </div>
              <ChevronRight size={20} color="#4B5563" />
            </div>

            <div className="scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
              {tasks.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, minHeight: "150px" }}>
                  <p style={{ fontSize: "15px" }}>No active tasks</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    key={task.id} 
                    style={{ 
                      padding: "20px", 
                      background: "rgba(255,255,255,0.03)", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>{task.title}</span>
                    <span style={{ 
                      fontSize: "10px", 
                      padding: "5px 12px", 
                      borderRadius: "10px", 
                      background: task.status === "completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: task.status === "completed" ? "#10B981" : "#F59E0B",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      border: `1px solid ${task.status === "completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                      boxShadow: `0 0 10px ${task.status === "completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`
                    }}>
                      {task.status || "Pending"}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* MEMORY CARD */}
          <div className="glass-card" style={{ flex: 1, padding: "30px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "12px", 
                  background: "rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Brain size={20} color="#3B82F6" />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Memory</h3>
              </div>
              <MoreVertical size={20} color="#4B5563" />
            </div>

            <div className="scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
              {memory.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, minHeight: "150px" }}>
                  <p style={{ fontSize: "15px" }}>Memory is empty</p>
                </div>
              ) : (
                memory.map((mem, i) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, rotate: 0 }}
                    key={i} 
                    style={{ 
                      padding: "20px", 
                      background: "rgba(255,255,255,0.04)", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255,255,255,0.08)",
                      position: "relative",
                      transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)`,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                    }}
                  >
                    <Pin size={14} color="#8B5CF6" style={{ position: "absolute", top: "12px", right: "12px" }} />
                    <p style={{ fontSize: "14px", color: "#E2E8F0", fontWeight: "500", lineHeight: "1.6" }}>{mem}</p>
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