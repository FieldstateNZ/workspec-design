// Recommendations for the 8 open questions in the spec
function Recs(){
  const items = [
    ['Q1','Hosted billing UX', 'First-time-bill-shock prevention', '<b>Hybrid</b>: $X seat fee + metered turns with a configurable monthly cap. Default cap = 1.5× last-month avg. Show running spend in chat panel header.'],
    ['Q2','Cost framing at creation', 'How "MCP-only is cheaper" reads to non-technical buyers', '<b>Lean into BYO subscription</b>. "Use your existing Claude/ChatGPT plan." Show concrete monthly estimates side-by-side. Skip comparison tables.'],
    ['Q3','MCP connection wizard', 'First-touch experience', '<b>Adaptive</b>: pick-your-client first; route Claude Code / Cursor users through copy-paste, route ChatGPT-desktop users through deeplink. Always offer "Test connection" before completing.'],
    ['Q4','Notes vs. turns', 'When a human types in multi-user MCP', '<b>Default = note</b>. <code>@mention</code> any client to dispatch as a pending turn. Per-message <kbd>N</kbd>/<kbd>T</kbd> toggle for power users.'],
    ['Q5','Multi-agent attribution', 'When two clients add nodes simultaneously', '<b>Medium</b>: cursors + per-artifact author dot in the corner. Click dot to filter the canvas to that agent. Audit log is still source of truth.'],
    ['Q6','Connection lifecycle', 'Same token, two devices', 'Treat as <b>two sessions, one identity</b>. Client self-reports session ID; presence shows two cursors with the same colour but distinct labels (laptop / desktop).'],
    ['Q7','Mode-switch consequences', 'Hosted → MCP downgrade: existing Atlas history', '<b>Convert to audit-log entries</b>. Atlas turns become <code>action</code> entries authored by <code>workspace/atlas</code>. Decommission the process. Keep nothing live.'],
    ['Q8','Default tool scope per client', 'Concierge vs advisor on new tokens', '<b>Per-client default, per-user override</b>. Claude Code / Cursor default advisor. Web ChatGPT / custom default concierge. Always overridable.'],
  ];
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>06 · OPEN QUESTIONS · DESIGN RECOMMENDATIONS</span><span>8 of 8 · for review</span></div>
      <div className="body" style={{padding:'24px 32px'}}>
        <p style={{color:'var(--ink-soft)',fontSize:13,lineHeight:1.5,margin:'0 0 18px',maxWidth:640}}>One designer's call on each of the open questions. Argued, not fixed — push back on anything where the data says otherwise.</p>
        <div className="recs">
          {items.map(([n,q,sub,a],i)=>(
            <div className="r" key={i}>
              <div className="num">{n}</div>
              <div className="qst">{q}<span className="sub">{sub}</span></div>
              <div className="ans" dangerouslySetInnerHTML={{__html:a}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Recs });
