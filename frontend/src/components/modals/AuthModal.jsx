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

const NAVY = "#0b4f49";
const TEAL = "#0f766e";
const TEAL_DARK = "#0b4f49";

const AuthModal = ({ show, handleClose, onLoginSuccess }) => {
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
        className="p-0"
        style={{
          borderRadius: 12,
          overflow: "hidden auto",
          border: "none",
          maxHeight: "calc(100vh - 120px)",
        }}
      >

        {/* ── TABS HEADER ── */}
        <div style={{ display: "flex", position: "relative", background: NAVY }}>

          {/* Login Tab */}
          <button
            onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
            style={{
              flex: 1, padding: "16px 0",
              border: "none",
              background: tab === "login" ? "white" : "transparent",
              color: tab === "login" ? NAVY : "white",
              fontWeight: 700, fontSize: "1rem",
              cursor: "pointer", transition: "all 0.2s",
              letterSpacing: "0.3px",
              borderRadius: tab === "login" ? "0 12px 0 0" : "0",
            }}
          >Login</button>

          {/* Register Tab */}
          <button
            onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
            style={{
              flex: 1, padding: "16px 0",
              border: "none",
              background: tab === "register" ? "white" : "transparent",
              color: tab === "register" ? NAVY : "white",
              fontWeight: 700, fontSize: "1rem",
              cursor: "pointer", transition: "all 0.2s",
              letterSpacing: "0.3px",
              borderRadius: tab === "register" ? "12px 0 0 0" : "0",
            }}
          >Register</button>

          {/* Close X */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute", top: 0, right: 0,
              width: 44, height: "100%",
              border: "none", background: "rgba(0,0,0,0.15)",
              color: "white", fontSize: "1rem",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}
          >✕</button>
        </div>

        {/* ── FORM BODY ── */}
        <div style={{ background: "white", padding: "20px 24px 24px" }}>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#991b1b", borderRadius: 6, padding: "10px 14px",
              fontSize: "0.85rem", marginBottom: 14, textAlign: "center",
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: "#edf7f5", border: "1px solid #b8ddd8",
              color: "#0b4f49", borderRadius: 6, padding: "10px 14px",
              fontSize: "0.85rem", marginBottom: 14, textAlign: "center",
            }}>{success}</div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* LOGIN FIELDS */}
            {tab === "login" && (
              <>
                <Field icon={<User size={16} color="#aaa" />}>
                  <input
                    style={inp}
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={set("username")}
                    required
                    autoComplete="username"
                  />
                </Field>

                <Field icon={<Lock size={16} color="#aaa" />} right={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={eyeBtn}>
                    {showPwd ? <EyeOff size={16} color="#aaa" /> : <Eye size={16} color="#aaa" />}
                  </button>
                }>
                  <input
                    style={{ ...inp, paddingRight: 42 }}
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
                <Field icon={<User size={16} color="#aaa" />}>
                  <input style={inp} type="text" placeholder="Full Name"
                    value={form.name} onChange={set("name")} required />
                </Field>

                <Field icon={<User size={16} color="#aaa" />}>
                  <input style={inp} type="text" placeholder="Username"
                    value={form.username} onChange={set("username")} required autoComplete="username" />
                </Field>

                <Field icon={<Mail size={16} color="#aaa" />}>
                  <input style={inp} type="email" placeholder="Email"
                    value={form.email} onChange={set("email")} required />
                </Field>

                <Field icon={<Phone size={16} color="#aaa" />}>
                  <input style={inp} type="tel" placeholder="Phone"
                    value={form.phone} onChange={set("phone")} required />
                </Field>

                <Field icon={<Lock size={16} color="#aaa" />} right={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={eyeBtn}>
                    {showPwd ? <EyeOff size={16} color="#aaa" /> : <Eye size={16} color="#aaa" />}
                  </button>
                }>
                  <input
                    style={{ ...inp, paddingRight: 42 }}
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete="new-password"
                  />
                </Field>

                <Field icon={<Lock size={16} color="#aaa" />}>
                  <input style={inp} type="password" placeholder="Retype Password"
                    value={form.confirmPassword} onChange={set("confirmPassword")} required />
                </Field>
              </>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                marginTop: 6, border: "none", borderRadius: 6,
                background: loading ? "#8ac7c0" : TEAL,
                color: "white", fontWeight: 700,
                fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = TEAL_DARK; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = TEAL; }}
            >
              {loading
                ? <><Spinner size="sm" />Processing...</>
                : tab === "login" ? "Login" : "Register"
              }
            </button>

          </form>

          {/* Switch link */}
          <p style={{ textAlign: "center", marginTop: 14, marginBottom: 0, fontSize: "0.85rem", color: "#666" }}>
            {tab === "login" ? "New user? " : "Already registered? "}
            <button
              style={{ border: "none", background: "none", color: TEAL_DARK, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.85rem" }}
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
            >
              {tab === "login" ? "Register here" : "Login here"}
            </button>
          </p>

          <p style={{ textAlign: "center", marginTop: 10, marginBottom: 0, fontSize: "0.76rem", color: "#64748b" }}>
            Demo: admin/admin123 or customer/customer123
          </p>

        </div>
      </Modal.Body>
    </Modal>
  );
};

const inp = {
  width: "100%",
  padding: "12px 14px 12px 40px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  background: "#fafafa",
  color: "#143d3b",
  fontSize: "0.92rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "border-color 0.2s",
};

const eyeBtn = {
  position: "absolute", right: 12, top: "50%",
  transform: "translateY(-50%)",
  border: "none", background: "transparent",
  cursor: "pointer", padding: 0, display: "flex",
};

const Field = ({ icon, children, right }) => (
  <div style={{ position: "relative" }}>
    <span style={{
      position: "absolute", left: 12, top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none", zIndex: 2, display: "flex",
    }}>{icon}</span>
    {children}
    {right}
  </div>
);

export default AuthModal;
