import React from "react";

export default function Dashboard() {

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h2>User Dashboard</h2>

      <p>✅ You are logged in successfully.</p>

      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial"
  },
  button: {
    padding: "10px 20px",
    marginTop: "20px",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "#fff",
    border: "none"
  }
};
