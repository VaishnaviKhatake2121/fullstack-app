import React, { useState } from "react";
import { API } from "../api";

export default function Login({ setToken, setRole }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    setToken(data.token);
    setRole(data.role);
  };

  return <>
    <h2>Login</h2>
    <input onChange={e=>setU(e.target.value)} placeholder="user"/>
    <input onChange={e=>setP(e.target.value)} placeholder="pass"/>
    <button onClick={login}>Login</button>
  </>;
}
