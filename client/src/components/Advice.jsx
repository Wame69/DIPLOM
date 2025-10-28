import React, { useEffect, useState } from 'react';
export default function Advice(){
  const [advice, setAdvice] = useState([]);
  useEffect(()=>{ fetchAdvice(); }, []);
  async function fetchAdvice(){
    const res = await fetch('/api/advice', { headers: { 'Authorization':'Bearer ' + localStorage.getItem('ev_token') }});
    if (res.ok){ const j = await res.json(); setAdvice(j.advice || []); }
  }
  return (
    <div>
      <h3>Советы</h3>
      {advice.length===0 && <div className="card">Советов пока нет — всё отлично!</div>}
      {advice.map(a => <div className="card small" key={a.id}><div className="bold">{a.title}</div><div className="muted">{a.reason}</div></div>)}
    </div>
  );
}
