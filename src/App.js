import React, { useState } from "react";
import numerologyProfiles from "./utils/numerologyProfiles";
import { calculateExpressionNumber } from "./utils/calculateNumerology";
import './App.css';

export default function App() {
  const [showAlert, setShowAlert] = useState(false);

  const [name, setName] = useState("");
  const [capital, setCapital] = useState("");
  const [payPercent, setPayPercent] = useState(""); // payout broker %
  const [riskPercent, setRiskPercent] = useState(""); // editable risk percentage
  const [started, setStarted] = useState(false);

  const [expressionNumber, setExpressionNumber] = useState(null);
  const [profile, setProfile] = useState(null);

  const [balance, setBalance] = useState(null);
  const [operations, setOperations] = useState([]);

  const maxOperations = 5;
  const maxLossStreak = 3;

  // Messages state
  const [message, setMessage] = useState(null);

  const startTrading = () => {
    if (!name || !capital || !payPercent) {
      setMessage({ type: "error", text: "Por favor, completa todos los campos." });
      return;
    }

    const expNum = calculateExpressionNumber(name);
    setExpressionNumber(expNum);

    let prof = numerologyProfiles[expNum] || null;
    if (!prof) {
      setMessage({ type: "error", text: "Perfil numerológico no encontrado para el número calculado." });
      return;
    }
    setProfile(prof);

    const match = prof.riskManagement.match(/(\d+(\.\d+)?)%/);
    const riskFromProfile = match ? parseFloat(match[1]) : 1;

    if (!riskPercent) {
      setRiskPercent(riskFromProfile);
    }

    setBalance(parseFloat(capital));
    setOperations([]);
    setStarted(true);
    setMessage(null);
    setShowAlert(false); // reset alert al iniciar
  };

  const recordOperation = (win) => {
    if (operations.length >= maxOperations) {
      setShowAlert(true);
      return;
    }

    const riskAmount = (balance * parseFloat(riskPercent)) / 100;
    let newBalance = balance;

    if (win) {
      newBalance += riskAmount * (parseFloat(payPercent) / 100);
    } else {
      newBalance -= riskAmount;
    }

    const newOperations = [...operations, { win, amount: riskAmount }];
    setOperations(newOperations);

    if (newOperations.length === maxOperations) {
      setShowAlert(true);
    }

    setBalance(newBalance);
    setMessage(null);

    // Detectar racha de pérdidas
    let lossStreak = 0;
    for (let i = newOperations.length - 1; i >= 0; i--) {
      if (!newOperations[i].win) lossStreak++;
      else break;
    }
    if (lossStreak >= maxLossStreak) {
      setMessage({ type: "warning", text: "Has perdido 3 operaciones consecutivas. Se recomienda retirarte y analizar." });
      setStarted(false);
    }
  };

  const resetTrading = () => {
    setName("");
    setCapital("");
    setPayPercent("");
    setRiskPercent("");
    setExpressionNumber(null);
    setProfile(null);
    setBalance(null);
    setOperations([]);
    setStarted(false);
    setMessage(null);
    setShowAlert(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Bitácora de Trading con Numerología</h1>

      {message && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 5,
            color: message.type === "error" ? "white" : message.type === "warning" ? "white" : "black",
            backgroundColor: message.type === "error" ? "green" : message.type === "warning" ? "#F0AD4E" : "#D9EDF7",
            fontWeight: "bold",
          }}
        >
          {message.text}
        </div>
      )}

      {!started && (
        <>
          <label>
            Nombre completo: <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ejemplo: Juan Pérez"
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Capital inicial (USD): <br />
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="Ejemplo: 1000"
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Pago broker (payout %) : <br />
            <input
              type="number"
              value={payPercent}
              onChange={(e) => setPayPercent(e.target.value)}
              placeholder="Ejemplo: 92"
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />
          </label>

          <button onClick={startTrading} style={{ padding: "10px 20px", fontSize: 16 }}>
            Iniciar trading
          </button>
        </>
      )}

      {started && (
        <>
          <h2>Perfil Numerológico</h2>
          <p><strong>Número de expresión:</strong> {expressionNumber}</p>

          <h3>{profile.name}</h3>
          <p>{profile.description}</p>
          <p><strong>Gestión del riesgo recomendada:</strong> {profile.riskManagement}</p>

          <label>
            Porcentaje de riesgo por operación (%): <br />
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />
          </label>

          <p><strong>Capital actual:</strong> ${balance.toFixed(2)}</p>
          <p><strong>Pago broker (payout):</strong> {payPercent}%</p>

          <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
            <button onClick={() => recordOperation(true)} className="btn-win">
              Registrar operación ganada
            </button>
            <button onClick={() => recordOperation(false)} className="btn-loss">
              Registrar operación perdida
            </button>
          </div>

          <button onClick={resetTrading} style={{ marginTop: 20, padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
            Reiniciar sesión de trading
          </button>

          <h3 style={{ marginTop: 30 }}>Bitácora de operaciones</h3>
          <ul>
            {operations.map((op, i) => (
              <li key={i} style={{ color: op.win ? "green" : "red" }}>
                Operación #{i + 1} - {op.win ? "Ganada" : "Perdida"} - {op.win ? "+" : "-"}$
                {(op.amount * (op.win ? (payPercent / 100) : 1)).toFixed(2)} USD
              </li>
            ))}
          </ul>
        </>
      )}

      {showAlert && (
        <div className="persistent-alert">
          <button className="close-btn" onClick={() => setShowAlert(false)}>×</button>
          Has alcanzado el límite de operaciones por hoy.
        </div>
      )}
    </div>
  );
}
