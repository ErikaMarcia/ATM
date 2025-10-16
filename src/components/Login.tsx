import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    onLogin(username.trim());
    setUsername("");
    setPassword("");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-title">Login</h1>

      <label className="input-label" htmlFor="username">
        Username
      </label>
      <input
        id="username"
        className="input-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Login"
        required
      />

      <label className="input-label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button className="button" type="submit">
        Sign in
      </button>
    </form>
  );
}
