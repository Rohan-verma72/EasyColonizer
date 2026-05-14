import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { User, Lock, Mail, Phone, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  loginLocalUser,
  persistSession,
  registerLocalUser,
} from "../../utils/authFallback";
import { useTenant } from "../../context/TenantContext";

const AuthModal = ({ show, handleClose, onLoginSuccess }) => {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    username: "", password: "", confirmPassword: "",
    name: "", email: "", phone: "",
  });

  const primaryColor = tenant?.theme?.primaryColor || "#1a237e";
  const secondaryColor = tenant?.theme?.secondaryColor || "#ffd700";

  useEffect(() => {
    if (!show) {
      setTab("login"); setError(""); setSuccess("");
      setForm({ username: "", password: "", confirmPassword: "", name: "", email: "", phone: "" });
    }
  }, [show]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (tab === "register" && form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (tab === "register") {
        try {
          await axios.post("/api/auth/register", {
            username: form.username,
            password: form.password,
            name: form.name,
            email: form.email,
            phone: form.phone,
            role: "customer",
          });
        } catch (apiErr) {
          if (apiErr?.response) throw apiErr;
          registerLocalUser(form);
        }
        setSuccess("Account created! Please login.");
        setTab("login");
        setForm({ username: form.username, password: "", confirmPassword: "", name: "", email: "", phone: "" });
      } else {
        let data;
        try {
          const response = await axios.post("/api/auth/login", {
            username: form.username,
            password: form.password,
          });
          data = response.data;
        } catch (apiErr) {
          try {
            data = loginLocalUser(form);
          } catch {
            if (apiErr?.response) throw apiErr;
            throw apiErr;
          }
        }
        const { username, role } = persistSession(data);
        if (onLoginSuccess) onLoginSuccess(username);
        handleClose();
        navigate(role === "admin" || role === "manager" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="ec-auth-modal"
      dialogClassName="ec-auth-dialog"
      backdrop={loading ? "static" : true}
      keyboard={!loading}
    >
      <Modal.Body
        className="p-0 border-0"
        style={{
          borderRadius: 16,
          overflow: "hidden auto",
          border: "none",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        <style>
          {`
            .auth-input:focus {
              border-color: ${primaryColor} !important;
              box-shadow: 0 0 0 0.2rem ${primaryColor}20 !important;
              background-color: #fff !important;
            }
          `}
        </style>

        {/* ── TABS HEADER ── */}
        <div style={{ display: "flex", position: "relative", background: primaryColor }}>

          {/* Login Tab */}
          <button
            onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
            style={{
              flex: 1, padding: "20px 0",
              border: "none",
              background: tab === "login" ? "white" : "transparent",
              color: tab === "login" ? primaryColor : "rgba(255,255,255,0.85)",
              fontWeight: 700, fontSize: "1.05rem",
              cursor: "pointer", transition: "all 0.3s",
              letterSpacing: "0.5px",
              borderRadius: tab === "login" ? "0 16px 0 0" : "0",
            }}
          >LOGIN</button>

          {/* Register Tab */}
          <button
            onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
            style={{
              flex: 1, padding: "20px 0",
              border: "none",
              background: tab === "register" ? "white" : "transparent",
              color: tab === "register" ? primaryColor : "rgba(255,255,255,0.85)",
              fontWeight: 700, fontSize: "1.05rem",
              cursor: "pointer", transition: "all 0.3s",
              letterSpacing: "0.5px",
              borderRadius: tab === "register" ? "16px 0 0 0" : "0",
            }}
          >REGISTER</button>

          {/* Close X */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute", top: 0, right: 0,
              width: 50, height: "100%",
              border: "none", background: "rgba(0,0,0,0.1)",
              color: "white", fontSize: "1.2rem",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontWeight: 300,
            }}
          >✕</button>
        </div>

        {/* ── FORM BODY ── */}
        <div style={{ background: "white", padding: "30px 28px" }}>

          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fed7d7",
              color: "#c53030", borderRadius: 8, padding: "12px 16px",
              fontSize: "0.88rem", marginBottom: 18, textAlign: "center",
              fontWeight: 500,
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: "#f0fff4", border: "1px solid #c6f6d5",
              color: "#2f855a", borderRadius: 8, padding: "12px 16px",
              fontSize: "0.88rem", marginBottom: 18, textAlign: "center",
              fontWeight: 500,
            }}>{success}</div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* LOGIN FIELDS */}
            {tab === "login" && (
              <>
                <Field icon={<User size={18} color="#718096" />}>
                  <input
                    className="auth-input"
                    style={inp}
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={set("username")}
                    required
                    autoComplete="username"
                  />
                </Field>

                <Field icon={<Lock size={18} color="#718096" />} right={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={eyeBtn}>
                    {showPwd ? <EyeOff size={18} color="#718096" /> : <Eye size={18} color="#718096" />}
                  </button>
                }>
                  <input
                    className="auth-input"
                    style={{ ...inp, paddingRight: 45 }}
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete="current-password"
                  />
                </Field>
              </>
            )}

            {/* REGISTER FIELDS */}
            {tab === "register" && (
              <>
                <Field icon={<User size={18} color="#718096" />}>
                  <input className="auth-input" style={inp} type="text" placeholder="Full Name"
                    value={form.name} onChange={set("name")} required />
                </Field>

                <Field icon={<User size={18} color="#718096" />}>
                  <input className="auth-input" style={inp} type="text" placeholder="Username"
                    value={form.username} onChange={set("username")} required autoComplete="username" />
                </Field>

                <Field icon={<Mail size={18} color="#718096" />}>
                  <input className="auth-input" style={inp} type="email" placeholder="Email"
                    value={form.email} onChange={set("email")} required />
                </Field>

                <Field icon={<Phone size={18} color="#718096" />}>
                  <input className="auth-input" style={inp} type="tel" placeholder="Phone"
                    value={form.phone} onChange={set("phone")} required />
                </Field>

                <Field icon={<Lock size={18} color="#718096" />} right={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={eyeBtn}>
                    {showPwd ? <EyeOff size={18} color="#718096" /> : <Eye size={18} color="#718096" />}
                  </button>
                }>
                  <input
                    className="auth-input"
                    style={{ ...inp, paddingRight: 45 }}
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete="new-password"
                  />
                </Field>

                <Field icon={<Lock size={18} color="#718096" />}>
                  <input className="auth-input" style={inp} type="password" placeholder="Retype Password"
                    value={form.confirmPassword} onChange={set("confirmPassword")} required />
                </Field>
              </>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "16px",
                marginTop: 8, border: "none", borderRadius: 10,
                background: loading ? `${primaryColor}80` : primaryColor,
                color: "white", fontWeight: 700,
                fontSize: "1.05rem", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10,
                boxShadow: `0 4px 14px 0 ${primaryColor}40`,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.filter = "brightness(1.15)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.filter = "none"; }}
            >
              {loading
                ? <><Spinner size="sm" /> Processing...</>
                : tab === "login" ? "LOGIN" : "REGISTER"
              }
            </button>

          </form>

          {/* Switch link */}
          <p style={{ textAlign: "center", marginTop: 20, marginBottom: 0, fontSize: "0.92rem", color: "#4a5568" }}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              style={{ border: "none", background: "none", color: primaryColor, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.92rem" }}
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
            >
              {tab === "login" ? "Sign Up here" : "Login here"}
            </button>
          </p>

        </div>
      </Modal.Body>
    </Modal>
  );
};

const inp = {
  width: "100%",
  padding: "14px 16px 14px 44px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  background: "#f8fafc",
  color: "#1a202c",
  fontSize: "0.95rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "all 0.25s ease",
};

const eyeBtn = {
  position: "absolute", right: 14, top: "50%",
  transform: "translateY(-50%)",
  border: "none", background: "transparent",
  cursor: "pointer", padding: 0, display: "flex",
};

const Field = ({ icon, children, right }) => (
  <div style={{ position: "relative" }}>
    <span style={{
      position: "absolute", left: 14, top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none", zIndex: 2, display: "flex",
    }}>{icon}</span>
    {children}
    {right}
  </div>
);

export default AuthModal;
