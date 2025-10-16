import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import ATM from "./components/ATM";

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  return (
    <div className="app">
      <div className="card">
        {currentUser ? (
          <ATM username={currentUser}
            onLogout={() => setCurrentUser(null)}/>
        ) : (
          <Login onLogin={(username) => setCurrentUser(username)} />
        )}
      </div>
      <div className="card">
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>About</h2>
        <p style={{ color: "#555", lineHeight: 1.5 }}>
          This is a simple ATM exercise. Login with any username and password.
          Each username keeps its own balance and history in localStorage.
        </p>
      </div>
    </div>
  );
}

export default App;
