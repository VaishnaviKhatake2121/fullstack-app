import React, { useEffect, useState } from "react";
import { API } from "../api";

export default function Admin({ token }) {
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetch(API+"/users", {
      headers: { Authorization: token }
    })
    .then(r=>r.json())
    .then(setUsers);
  },[]);

  return <>
    <h2>Admin Dashboard</h2>
    {users.map((u,i)=><div key={i}>{u[0]} - {u[1]}</div>)}
  </>;
}
