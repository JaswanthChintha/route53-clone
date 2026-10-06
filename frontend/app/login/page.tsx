"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    localStorage.setItem(
      "route53_session",
      JSON.stringify({
        email: email.trim(),
        loggedIn: true,
      })
    );

    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          border: "1px solid #d5dbdb",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            fontSize: "28px",
            fontWeight: 500,
          }}
        >
          Sign in
        </h1>

        <p
          style={{
            color: "#5f6b7a",
            marginBottom: "28px",
          }}
        >
          Sign in to Route 53 Clone
        </p>

        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Email
        </label>

        <input
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            height: "42px",
            border: "1px solid #879596",
            padding: "0 12px",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Password
        </label>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            height: "42px",
            border: "1px solid #879596",
            padding: "0 12px",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        />

        <button
          type="button"
          onClick={handleLogin}
          className="primary-button"
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}