import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <h1>Access Denied</h1>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {users.map(user => (
        <div key={user[0]}>
          {user[1]} - {user[2]}
        </div>
      ))}

      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}
