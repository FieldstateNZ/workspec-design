// App entry — assembles the design canvas
const { DesignCanvas, DCSection, DCArtboard } = window;

function App(){
  return (
    <DesignCanvas>
      <DCSection id="brief" title="Brief" subtitle="What we're solving and how this canvas is organized">
        <DCArtboard id="brief" label="Read me first" width={880} height={780}>
          <div style={{padding:'40px 44px',background:'var(--bg)',color:'var(--ink)',width:'100%',height:'100%',boxSizing:'border-box',overflow:'hidden'}}>
            <Brief/>
          </div>
        </DCArtboard>
        <DCArtboard id="matrix" label="01 · The matrix" width={880} height={780}>
          <Matrix/>
        </DCArtboard>
      </DCSection>

      <DCSection id="creation" title="02 · Workspace creation flow" subtitle="Four steps, two new questions, optional connect-first wizard">
        <DCArtboard id="step1" label="Step 1 · Name" width={620} height={600}><Creation_Step1/></DCArtboard>
        <DCArtboard id="step2" label="Step 2 · Seat mode" width={620} height={600}><Creation_Step2/></DCArtboard>
        <DCArtboard id="step3" label="Step 3 · Interaction" width={620} height={600}><Creation_Step3/></DCArtboard>
        <DCArtboard id="step4" label="Step 4 · Connect (MCP-only path)" width={620} height={720}><Creation_Step4/></DCArtboard>
      </DCSection>

      <DCSection id="chat" title="03 · Chat panel reframe" subtitle="Same panel, four configurations. Input affordance and content shift per cell.">
        <DCArtboard id="chat-sm" label="Single · MCP-only · read-only inbox" width={400} height={620}><ChatPanel_SingleMCP/></DCArtboard>
        <DCArtboard id="chat-sh" label="Single · Hosted · Atlas chat" width={400} height={620}><ChatPanel_SingleHosted/></DCArtboard>
        <DCArtboard id="chat-mm" label="Multi · MCP-only · notes + queue" width={400} height={620}><ChatPanel_MultiMCP/></DCArtboard>
        <DCArtboard id="chat-mh" label="Multi · Hosted · the interesting cell" width={400} height={620}><ChatPanel_MultiHosted/></DCArtboard>
      </DCSection>

      <DCSection id="conn" title="04 · Connections settings" subtitle="Token list and connect-new-client wizard">
        <DCArtboard id="conn-list" label="Connections list" width={880} height={560}><ConnectionsSettings/></DCArtboard>
        <DCArtboard id="conn-wiz" label="Connect new client wizard" width={880} height={560}><ConnectWizard/></DCArtboard>
      </DCSection>

      <DCSection id="presence" title="05 · Multi-agent presence" subtitle="Three loudness variants. Recommendation: Medium.">
        <DCArtboard id="pres-min" label="Minimal · cursors only" width={760} height={460}><PresenceCanvas variant="MINIMAL"/></DCArtboard>
        <DCArtboard id="pres-med" label="Medium · cursors + author dots (recommended)" width={760} height={460}><PresenceCanvas variant="MEDIUM"/></DCArtboard>
        <DCArtboard id="pres-loud" label="Loud · + activity stream" width={760} height={460}><PresenceCanvas variant="LOUD"/></DCArtboard>
      </DCSection>

      <DCSection id="ops" title="06 · Mode switch + open questions" subtitle="What happens when modes change, and recommendations for the 8 open Qs">
        <DCArtboard id="modeswitch" label="MCP → Hosted upgrade" width={760} height={620}><ModeSwitch/></DCArtboard>
        <DCArtboard id="recs" label="Recommendations for 8 open Qs" width={1020} height={760}><Recs/></DCArtboard>
      </DCSection>

      <DCSection id="theme" title="07 · Theme switcher" subtitle="Aesthetic × theme as two independent toggles">
        <DCArtboard id="theme-settings" label="Settings · Appearance (full)" width={760} height={680}><ThemeSwitcher_Inline/></DCArtboard>
        <DCArtboard id="theme-compact" label="Compact · top-bar control" width={760} height={460}><ThemeSwitcher_Compact/></DCArtboard>
      </DCSection>

      <DCSection id="paper" title="08 · Paper aesthetic — three variants" subtitle="The three highest-leverage frames re-skinned. Same components, swap of token file + serif headings + ink rules. Same content, different idiom.">
        <DCArtboard id="paper-chat-sm" label="Paper · Single · MCP-only" width={420} height={620}><ChatPanelPaper_SingleMCP/></DCArtboard>
        <DCArtboard id="paper-chat-sh" label="Paper · Single · Hosted" width={420} height={620}><ChatPanelPaper_SingleHosted/></DCArtboard>
        <DCArtboard id="paper-chat-mm" label="Paper · Multi · MCP-only" width={420} height={620}><ChatPanelPaper_MultiMCP/></DCArtboard>
        <DCArtboard id="paper-chat-mh" label="Paper · Multi · Hosted (the interesting cell)" width={420} height={620}><ChatPanelPaper_MultiHosted/></DCArtboard>
        <DCArtboard id="paper-conn" label="Paper · Connections list" width={900} height={580}><ConnectionsSettingsPaper/></DCArtboard>
        <DCArtboard id="paper-wiz" label="Paper · Connect-new-client wizard" width={900} height={580}><ConnectWizardPaper/></DCArtboard>
        <DCArtboard id="paper-pres-min" label="Paper · Presence · Minimal" width={780} height={460}><PresenceCanvasPaper variant="MINIMAL"/></DCArtboard>
        <DCArtboard id="paper-pres-med" label="Paper · Presence · Medium (recommended)" width={780} height={460}><PresenceCanvasPaper variant="MEDIUM"/></DCArtboard>
        <DCArtboard id="paper-pres-loud" label="Paper · Presence · Loud" width={780} height={460}><PresenceCanvasPaper variant="LOUD"/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
