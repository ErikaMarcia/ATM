import { useEffect, useState } from "react";
import "./ATM.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { HistoryItem, UserAccount } from "../types";

interface Props {
  username: string;
  onLogout: () => void;
}

const STORAGE_KEY = "atm_users_v1";

function formatCurrency(number: number) {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(date: Date) {
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ATM({ username, onLogout }: Props) {
  const [allUsers, setAllUsers] = useLocalStorage<Record<string, UserAccount>>(
    STORAGE_KEY,
    {}
  );

  const [account, setAccount] = useState<UserAccount>({
    balance: 0,
    history: [],
  });

  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const now = new Date();

  useEffect(() => {
    const userData = allUsers[username];
    if (userData) {
      setAccount(userData);
    } else {
      setAccount({ balance: 0, history: [] });
    }
    setError(null);
    setAmount("");
  }, [username, allUsers]);

  function pushHistory(type: HistoryItem["type"], value: number) {
    const item: HistoryItem = {
      type,
      value,
      date: formatDate(new Date()),
    };
    const updated = {
      balance:
        type === "deposit" ? account.balance + value : account.balance - value,
      history: [item, ...account.history],
    };
    setAccount(updated);
    setAllUsers((prev) => ({ ...prev, [username]: updated }));
  }

  function handleDeposit() {
    setError(null);
    const v = Number(amount);
    if (!v || v <= 0) {
      setError("Please enter a positive amount.");
      return;
    }
    pushHistory("deposit", v);
    setAmount("");
  }

  function handleWithdraw() {
    setError(null);
    const v = Number(amount);
    if (!v || v <= 0) {
      setError("Please enter a positive amount.");
      return;
    }
    if (v > account.balance) {
      setError("Insufficient funds.");
      return;
    }
    pushHistory("withdraw", v);
    setAmount("");
  }

  return (
    <div className="account-card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom:"1.5rem" }}>
        <h1 className="account-title">Welcome, {username}</h1>
        <div style={{ color: "#666", alignSelf: "center", fontSize: "0.6rem" }}>{formatDate(now)}</div>
      </div>

      <div className="balance">
        <div style={{ fontSize: 14, opacity: 0.9 }}>Balance</div>
        <div style={{ fontSize: 22, marginTop: 6 }}>
          {formatCurrency(account.balance)}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Amount</label>
        <input
          className="input-field"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="button-group" style={{ marginTop: 4 }}>
        <button className="button" onClick={handleDeposit} type="button">
          Deposit
        </button>
        <button className="button" onClick={handleWithdraw} type="button">
          Withdraw
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ marginBottom: 8 }}>History</h3>
        <div className="history">
          {account.history.length === 0 && (
            <div style={{ color: "#666", fontSize: 0.95 }}>
              No operations yet.
            </div>
          )}
          {account.history.map((item, idx) => (
            <div key={idx} className="history-item">
              <div>
                <div style={{ fontWeight: 600, textTransform: "capitalize" }}>
                  {item.type === "deposit" ? "Deposit" : "Withdraw"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>{item.date}</div>
              </div>
              <div style={{ alignSelf: "center", fontWeight: 700 }}>
                {formatCurrency(item.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="button logout-button"
        onClick={onLogout}
        style={{ marginTop: 16 }}
      >
        Logout
      </button>
    </div>
  );
}
