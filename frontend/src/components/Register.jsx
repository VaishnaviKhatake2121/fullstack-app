import React, { useState } from "react";
import { API } from "../api";

export default function Register() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  const register = async () => {
    await fetch(API + "/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username, password})
    });
    alert("Registered");
  };

  return <>
    <h2>Register</h2>
    <input onChange={e=>setU(e.target.value)} />
    <input onChange={e=>setP(e.target.value)} />
    <button onClick={register}>Register</button>
  </>;
}
