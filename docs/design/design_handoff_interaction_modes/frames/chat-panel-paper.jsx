// Paper variant — chat panel · 4 cells reskinned with editorial idiom.
// Reuses .cp, .turn, .av classes; .paper wrapper rebinds tokens + adds serif/ink overrides.

function PaperAv({k, name}){return <span className={"av "+k}>{name}</span>;}

function ChatPanelPaper_SingleMCP(){
  return (
    <div className="paper" style={{height:'100%'}}>
      <div className="cp">
        <div className="top">
          <div>
            <div className="ttl">Inbox</div>
            <div className="sub">MCP-only · single user</div>
          </div>
          <span className="chip">READ-ONLY</span>
        </div>
        <div className="stream">
          <div className="turn system"><div></div><div><div className="meta"><b>fieldstate</b> · provisioned</div><div className="body">Workspace ready. Connect a client to begin.</div></div></div>
          <div className="turn"><PaperAv k="cc" name="CC"/><div><div className="meta"><b>brett/claude-code</b><span>· 12:04</span></div><div className="body">Reading project pitch from <code className="code">PRD.md</code>. Calling <span style={{color:'var(--accent)',fontWeight:500}}>create_project</span>…</div></div></div>
          <div className="turn action"><PaperAv k="cc" name="CC"/><div><div className="meta">3 tool calls · <b>scope: advisor</b></div><div className="body">→ create_project(pitch, "fieldstate")<br/>→ add_artifact(persona × 2)<br/>→ add_artifact(feature × 4, scenario × 3)</div></div></div>
          <div className="turn system"><div></div><div><div className="meta"><b>scope event</b></div><div className="body">workspace concierge dispatched · seeded 9 artifacts on canvas</div></div></div>
          <div className="turn"><PaperAv k="cc" name="CC"/><div><div className="meta"><b>brett/claude-code</b><span>· 12:06</span></div><div className="body">Scaffolded <code className="code">Authentication</code>, <code className="code">Onboarding</code>, <code className="code">Billing</code>. Should I draft slices for OAuth?</div></div></div>
        </div>
        <div className="input locked">
          <span style={{fontFamily:'JetBrains Mono',fontStyle:'normal'}}>—</span>
          Chat input is hidden in MCP-only · drive from your client
        </div>
      </div>
    </div>
  );
}

function ChatPanelPaper_SingleHosted(){
  return (
    <div className="paper" style={{height:'100%'}}>
      <div className="cp">
        <div className="top">
          <div>
            <div className="ttl">Atlas</div>
            <div className="sub">Hosted · single user</div>
          </div>
          <span className="chip agent"><span style={{display:'inline-block',width:5,height:5,background:'var(--agent)',borderRadius:'50%'}}/> ATLAS · IDLE</span>
        </div>
        <div className="stream">
          <div className="turn"><PaperAv k="brett" name="B"/><div><div className="meta"><b>brett</b><span>· 11:51</span></div><div className="body">we're building a way for users to log in with GitHub but keep email/pw as fallback for enterprise</div></div></div>
          <div className="turn"><PaperAv k="atlas" name="A"/><div><div className="meta"><b>workspace/atlas</b><span>· concierge</span></div><div className="body">Got it. Drafting the auth container + first features. I'll show you what I add.</div></div></div>
          <div className="turn action"><PaperAv k="atlas" name="A"/><div><div className="meta">5 tool calls · <b>scope: concierge → advisor</b></div><div className="body">→ set_title("fieldstate")<br/>→ create_container("Authentication")<br/>→ create_feature × 3<br/>→ create_scenario × 2</div></div></div>
          <div className="turn"><PaperAv k="atlas" name="A"/><div><div className="meta"><b>workspace/atlas</b><span>· 11:53</span></div><div className="body">Added 6 artifacts. The OAuth flow is selected — want me to draft a slice for the callback?</div></div></div>
        </div>
        <div className="input">
          <div className="input" style={{height:36}}>
            <input placeholder="ask atlas, or paste a doc…" defaultValue=""/>
            <span className="kbd2">⏎</span>
          </div>
          <div style={{display:'flex',gap:8,marginTop:8,fontFamily:'JetBrains Mono, monospace',fontSize:9.5,color:'var(--ink-fade)',letterSpacing:'0.1em'}}>
            <span>⌘K commands</span><span>·</span><span>⌘V paste</span><span>·</span><span style={{color:'var(--accent)'}}>$0.04 / TURN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPanelPaper_MultiMCP(){
  return (
    <div className="paper" style={{height:'100%'}}>
      <div className="cp">
        <div className="top">
          <div>
            <div className="ttl">Notes &amp; activity</div>
            <div className="sub">MCP-only · 3 members · 4 clients</div>
          </div>
          <div style={{display:'flex',gap:4}}>
            <PaperAv k="brett" name="B"/><PaperAv k="alice" name="A"/><PaperAv k="kai" name="K"/>
          </div>
        </div>
        <div className="stream">
          <div className="turn note"><PaperAv k="alice" name="A"/><div><div className="meta"><b>alice</b><span>· note · 09:12</span></div><div className="body">Need to spec the SAML failover before sales call Friday — anyone want to take it?</div></div></div>
          <div className="turn system"><div></div><div><div className="meta"><b>pending turn</b> · queued for any advisor-scoped client</div><div className="body" style={{fontFamily:'JetBrains Mono, monospace',fontSize:11,background:'var(--bg-elevated)',border:'1px dashed var(--ink)',padding:'6px 8px',borderRadius:3,fontStyle:'normal',color:'var(--ink)'}}>list_pending_turns() → 1 unclaimed</div></div></div>
          <div className="turn"><PaperAv k="cc" name="CC"/><div><div className="meta"><b>brett/claude-code</b> · picked up <span>· 09:14</span></div><div className="body">Drafting SAML failover scenario. Reading existing auth container…</div></div></div>
          <div className="turn action"><PaperAv k="cc" name="CC"/><div><div className="meta">brett/claude-code · 4 tool calls</div><div className="body">→ create_scenario("SAML failover")<br/>→ create_decision("retry policy")<br/>→ link_artifact × 2</div></div></div>
          <div className="turn note"><PaperAv k="kai" name="K"/><div><div className="meta"><b>kai</b><span>· note · 09:22</span></div><div className="body">@brett — the decision needs to reference our IDP allowlist doc. Can your CC pick that up next?</div></div></div>
          <div className="turn"><PaperAv k="gpt" name="GP"/><div><div className="meta"><b>alice/chatgpt</b><span>· 09:28</span></div><div className="body">Annotating IDP allowlist on the Decision artifact.</div></div></div>
        </div>
        <div className="input">
          <div className="input" style={{height:36}}>
            <input placeholder="leave a note · @mention to dispatch as pending turn…"/>
            <span className="kbd2">N</span>
            <span className="kbd2" style={{borderColor:'var(--accent)',color:'var(--accent)'}}>T</span>
          </div>
          <div style={{display:'flex',gap:8,marginTop:8,fontFamily:'JetBrains Mono, monospace',fontSize:9.5,color:'var(--ink-fade)',letterSpacing:'0.1em'}}>
            <span><b style={{color:'var(--ink)',fontWeight:600}}>N</b>ote</span><span>·</span><span><b style={{color:'var(--accent)',fontWeight:600}}>T</b>urn (dispatch)</span><span>·</span><span>default: note</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPanelPaper_MultiHosted(){
  return (
    <div className="paper" style={{height:'100%'}}>
      <div className="cp">
        <div className="top">
          <div>
            <div className="ttl">Atlas + activity</div>
            <div className="sub">Hosted · 3 members · 5 agents</div>
          </div>
          <div style={{display:'flex',gap:4}}>
            <PaperAv k="atlas" name="A"/><PaperAv k="brett" name="B"/><PaperAv k="alice" name="Al"/><PaperAv k="kai" name="K"/>
          </div>
        </div>
        <div className="stream">
          <div className="turn"><PaperAv k="brett" name="B"/><div><div className="meta"><b>brett</b><span>· 14:02</span></div><div className="body">@atlas can we restructure the auth container — split SSO out from password flows</div></div></div>
          <div className="turn"><PaperAv k="atlas" name="A"/><div><div className="meta"><b>workspace/atlas</b><span>· advisor · 14:02</span></div><div className="body">Yes. Proposing a split: SSO container (4 artifacts) + password container (3). Showing diff on canvas.</div></div></div>
          <div className="turn action"><PaperAv k="atlas" name="A"/><div><div className="meta">2 tool calls · <b>scope: advisor</b></div><div className="body">→ propose_restructure("auth", split=2)<br/>→ annotate("review pending")</div></div></div>
          <div className="turn"><PaperAv k="cur" name="Cu"/><div><div className="meta"><b>alice/cursor</b><span>· 14:05</span></div><div className="body">Reviewing in IDE. The split looks right but enterprise-fallback should stay cross-cutting.</div></div></div>
          <div className="turn note"><PaperAv k="kai" name="K"/><div><div className="meta"><b>kai</b><span>· note · 14:07</span></div><div className="body">+1 to alice. Mark fallback as cross-cutting before we accept.</div></div></div>
          <div className="turn"><PaperAv k="atlas" name="A"/><div><div className="meta"><b>workspec/atlas</b><span>· 14:08</span></div><div className="body">Updated. Fallback now lives in a shared lens. Ready to accept?</div></div></div>
        </div>
        <div className="input">
          <div className="input" style={{height:36}}>
            <input placeholder="ask atlas, leave a note, or @mention a client…"/>
            <span className="kbd2">⏎</span>
          </div>
          <div style={{display:'flex',gap:8,marginTop:8,fontFamily:'JetBrains Mono, monospace',fontSize:9.5,color:'var(--ink-fade)',letterSpacing:'0.1em'}}>
            <span>@atlas → hosted</span><span>·</span><span>@brett/cc → that client</span><span>·</span><span>plain → note</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ChatPanelPaper_SingleMCP,
  ChatPanelPaper_SingleHosted,
  ChatPanelPaper_MultiMCP,
  ChatPanelPaper_MultiHosted,
});
