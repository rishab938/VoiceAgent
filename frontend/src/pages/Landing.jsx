import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper" style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card" 
        style={{
          padding: "60px 80px",
          textAlign: "center",
          maxWidth: "700px",
          width: "90%",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px"
        }}
      >
        {/* Logo */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "22px",
          background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
          marginBottom: "10px"
        }}>
          <Sparkles size={40} color="white" fill="white" />
        </div>

        <h1 style={{
          fontSize: "4.5rem",
          fontWeight: "800",
          background: "linear-gradient(to bottom, #FFFFFF 30%, #94A3B8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.04em",
          lineHeight: "1",
          margin: 0
        }}>
          Ather AI
        </h1>

        <h2 style={{
          fontSize: "1.75rem",
          fontWeight: "500",
          color: "#E2E8F0",
          margin: 0
        }}>
          Your Voice. Your Control.
        </h2>

        <p style={{
          fontSize: "1.125rem",
          color: "#94A3B8",
          lineHeight: "1.6",
          maxWidth: "450px",
          margin: "0 auto"
        }}>
          Talk, manage tasks, and remember everything with your advanced AI assistant.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/agent")}
          style={{
            marginTop: "20px",
            padding: "18px 48px",
            fontSize: "1.125rem",
            fontWeight: "700",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(90deg, #8B5CF6, #D946EF)",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)"
          }}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Decorative Glows */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "20%",
        width: "400px",
        height: "400px",
        background: "rgba(139, 92, 246, 0.15)",
        filter: "blur(120px)",
        borderRadius: "50%",
        zIndex: 1
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "20%",
        width: "400px",
        height: "400px",
        background: "rgba(217, 70, 239, 0.15)",
        filter: "blur(120px)",
        borderRadius: "50%",
        zIndex: 1
      }} />
    </div>
  );
}