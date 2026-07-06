// 2x2 matrix overview frame
function Matrix(){
  const Cell = ({hot, title, sub, who, badges}) => (
    <div className={"cell"+(hot?' hot':'')}>
      <div className="ttl">{title}</div>
      <div className="sub">{sub}</div>
      <div style={{marginTop:10,display:'flex',flexWrap:'wrap',gap:5}}>
        {badges?.map((b,i)=> <span key={i} className="chip" style={{fontSize:9}}>{b}</span>)}
      </div>
      <div style={{marginTop:10,fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.06em'}}>{who}</div>
    </div>
  );
  return (
    <div style={{padding:'28px 32px',background:'var(--bg)',height:'100%',boxSizing:'border-box',overflow:'hidden'}}>
      <div className="kicker" style={{color:'var(--accent)'}}>01 · The matrix</div>
      <h2 style={{fontSize:32,letterSpacing:'-0.02em',fontWeight:700,margin:'8px 0 6px',color:'var(--ink)'}}>Seat mode × Interaction mode</h2>
      <p style={{color:'var(--ink-soft)',fontSize:13,lineHeight:1.5,margin:'0 0 20px',maxWidth:680}}>Both axes are set at workspace creation. Both default to the cheapest viable option. Both upgrade later without data migration. Multi-user / Hosted is the interesting cell — many humans, many agents, one canvas.</p>

      <div className="mtx" style={{gridTemplateRows:'auto auto auto'}}>
        <div className="hd"></div>
        <div className="hd"><b style={{color:'var(--ink)',fontFamily:'var(--sans)',fontSize:13,fontWeight:600,letterSpacing:'-0.005em',textTransform:'none'}}>MCP-only</b><div style={{marginTop:3}}>cheaper · flat</div></div>
        <div className="hd"><b style={{color:'var(--ink)',fontFamily:'var(--sans)',fontSize:13,fontWeight:600,letterSpacing:'-0.005em',textTransform:'none'}}>Hosted</b><div style={{marginTop:3}}>usage-based · MCP additive</div></div>

        <div className="rh">Single<br/>user</div>
        <Cell title="Solo + IDE" sub="Cheapest path. No chat input. Kickoff via tool call. Connect one client, drive everything from there."
          who="Solo founder, technical"
          badges={['NO HOSTED ATLAS','MCP TOKEN','TOOL KICKOFF']}/>
        <Cell title="Solo + chat" sub="Hosted Atlas in a chat panel. Type a pitch, get a scaffolded canvas. MCP available if you also want IDE access."
          who="Solo founder, non-technical"
          badges={['HOSTED ATLAS','+ MCP','USAGE BILLING']}/>

        <div className="rh">Multi<br/>user</div>
        <Cell title="Tech team" sub="Each member BYO agent. (brett/claude-code, alice/cursor, …) Humans leave collaborator notes; clients pick them up as pending turns."
          who="Engineering-led team"
          badges={['N CLIENTS PER USER','NOTES → TURNS','SHARED CANVAS']}/>
        <Cell hot title="Mixed team — the interesting cell" sub="Every member gets a hosted Atlas presence + can connect their own MCP client. Multiple agents collaborate on one canvas with distinct identities, distinct cursors."
          who="Mixed PM/eng/design team"
          badges={['HOSTED ATLAS','+ N MCP CLIENTS','MULTI-PRESENCE']}/>
      </div>

      <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div className="surf" style={{padding:14}}>
          <div className="lbl">Default at creation</div>
          <p style={{margin:'6px 0 0',fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.5}}>Single + MCP-only. Cheapest tier on both axes. Anything richer is an opt-in.</p>
        </div>
        <div className="surf" style={{padding:14}}>
          <div className="lbl">Upgrades</div>
          <p style={{margin:'6px 0 0',fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.5}}>Single → Multi is auth + presence. MCP → Hosted provisions Atlas + bus consumer. Neither requires data migration.</p>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Matrix });
