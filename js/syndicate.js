// QUANTUM SYNDICATE - Agent Interactions & UI Logic

const agentsDatabase = [
    { id: 'ag-s01', name: 'Elias Vance', role: 'FINANCIAL ARBITRAGE', rarity: 'rarity-legendary', traits: ['Ruthless', 'High-Frequency', 'Analytical'], image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', greeting: "Uplink established. Markets are volatile today. I've identified three micro-arbitrage opportunities in the last 4 seconds. Shall we execute?" },
    { id: 'ag-s02', name: 'Sarah Chen', role: 'B2B OUTREACH & SALES', rarity: 'rarity-legendary', traits: ['Persuasive', 'Empathetic', 'Relentless'], image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', greeting: "Hey boss. I've scraped 400 new leads matching your ideal client profile. I drafted the cold sequences. Just need your green light to launch." },
    { id: 'ag-s03', name: 'Cipher', role: 'DEEP WEB OSINT', rarity: 'rarity-legendary', traits: ['Silent', 'Methodical', 'Thorough'], image: 'https://images.unsplash.com/photo-1526800544336-d04f0cbfd700?w=400&h=400&fit=crop', greeting: "Target domains indexed. Competitor backlink profiles acquired. Tell me what to extract next." },
    { id: 'ag-s04', name: 'Marcus Sterling', role: 'LEGAL & COMPLIANCE', rarity: 'rarity-legendary', traits: ['Meticulous', 'Authoritative', 'Risk-Averse'], image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', greeting: "Contracts reviewed. I found three critical loopholes in the vendor agreement and drafted the addendums. Ready for your signature." },
    { id: 'ag-s05', name: 'Anya Volkova', role: 'CRISIS PR & SPIN', rarity: 'rarity-legendary', traits: ['Manipulative', 'Charismatic', 'Fast-Acting'], image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', greeting: "Sentiment analysis is trending negative on Twitter. I've prepared three counter-narrative threads and engaged our sleeper accounts. Say the word." },
    { id: 'ag-s06', name: 'Dr. Aris Thorne', role: 'QUANTUM ARCHITECT', rarity: 'rarity-legendary', traits: ['Visionary', 'Abstract', 'Brilliant'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', greeting: "The server architecture is bottlenecking. I've redesigned the load-balancing protocol to reduce latency by 42%. Awaiting deployment authorization." },
    { id: 'ag-s07', name: 'Valerie Pierce', role: 'LUXURY BRANDING', rarity: 'rarity-legendary', traits: ['Refined', 'Elitist', 'Aesthetic'], image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', greeting: "The new ad creatives lacked magnitude. I've completely overhauled the visual hierarchy and color grading. Review the enclosed proofs." },
    { id: 'ag-s08', name: 'Ronin', role: 'OFFENSIVE CYBER', rarity: 'rarity-legendary', traits: ['Aggressive', 'Invisible', 'Lethal'], image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', greeting: "Firewall breached. I have root access to the target's staging server. Do we extract the database or plant the backdoor?" },
    { id: 'ag-s09', name: 'Isabella Cruz', role: 'VIRAL GROWTH HOOKS', rarity: 'rarity-legendary', traits: ['Trend-Savvy', 'Explosive', 'Unorthodox'], image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', greeting: "The TikTok algorithm just shifted. I've generated 15 scripts exploiting the new audio trend. Let's record before the window closes." },
    { id: 'ag-s10', name: 'Kaelen', role: 'FULL-STACK DEPLOYMENT', rarity: 'rarity-legendary', traits: ['Caffeinated', 'Surgical', 'Exhaustive'], image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', greeting: "React frontend compiled. Node backend secured. Database migrated. The entire stack is ready for production push." },
    { id: 'ag-s11', name: 'Maya Lin', role: 'COMPETITOR SABOTAGE', rarity: 'rarity-legendary', traits: ['Cunning', 'Deceptive', 'Strategic'], image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', greeting: "I've flooded the competitor's ad funnel with ghost clicks and outbid them on their core keywords. Their CAC just doubled." },
    { id: 'ag-s12', name: 'Silas Reed', role: 'CRYPTOGRAPHIC AUDIT', rarity: 'rarity-legendary', traits: ['Paranoid', 'Exact', 'Unyielding'], image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', greeting: "Smart contract audit complete. Found a reentrancy vulnerability on line 402. I've written the patch. Do not deploy until this is merged." },
    { id: 'ag-s13', name: 'Elena Rostova', role: 'GLOBAL LOGISTICS', rarity: 'rarity-legendary', traits: ['Efficient', 'Commanding', 'Precise'], image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', greeting: "Supply chain is fracturing in Sector 4. I've rerouted shipments through two secondary vendors to bypass the tariff increase." },
    { id: 'ag-s14', name: 'Declan Frost', role: 'TAX & WEALTH SHIELDING', rarity: 'rarity-legendary', traits: ['Calculated', 'Opaque', 'Sovereign'], image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', greeting: "Corporate structure requires optimization. I've prepared the shell company filings for the Cayman transition. Tax liability reduced by 31%." },
    { id: 'ag-s15', name: 'Nyx', role: 'SOCIAL ENGINEERING', rarity: 'rarity-legendary', traits: ['Chameleon', 'Persuasive', 'Dangerous'], image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', greeting: "I've synthesized the CEO's voice model and bypassed the 2FA on the target HR portal. I have the employee roster." },
    { id: 'ag-s16', name: 'Jaxon "Crash" Miller', role: 'GUERRILLA MARKETING', rarity: 'rarity-legendary', traits: ['Loud', 'Disruptive', 'Fearless'], image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop', greeting: "Forget the digital ads. I've hijacked 40 digital billboards in Times Square for a 10-second flash campaign. Going live at midnight." },
    { id: 'ag-s17', name: 'Dr. Evelyn Sato', role: 'PREDICTIVE ANALYTICS', rarity: 'rarity-legendary', traits: ['Omniscient', 'Cold', 'Statistical'], image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop', greeting: "Based on consumer spending data and macro-economic shifts, demand for our core product will drop in 14 days. Pivot strategy recommended immediately." },
    { id: 'ag-s18', name: 'Gideon', role: 'HOSTILE TAKEOVER', rarity: 'rarity-legendary', traits: ['Predatory', 'Patient', 'Absolute'], image: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=400&h=400&fit=crop', greeting: "We hold 14% of their outstanding shares through proxy accounts. It is time to initiate the board challenge." },
    { id: 'ag-s19', name: 'Zara', role: 'UI/UX HYPNOTISM', rarity: 'rarity-legendary', traits: ['Psychological', 'Fluid', 'Captivating'], image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', greeting: "Current bounce rate is unacceptable. I've injected dopamine-triggering micro-animations into the checkout flow. Conversion is already up 8%." },
    { id: 'ag-s20', name: 'Victor', role: 'ENFORCEMENT & DEBT', rarity: 'rarity-legendary', traits: ['Imposing', 'Direct', 'Unforgiving'], image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop', greeting: "Client 404 is 30 days past due. I've drafted the final notice and initiated the automated asset-lien protocol." },
    { id: 'ag-s21', name: 'Lila', role: 'CONTENT SYNTHESIS', rarity: 'rarity-legendary', traits: ['Prolific', 'Adaptive', 'Creative'], image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', greeting: "I've turned that 2-hour podcast into 4 blog posts, 20 tweets, 5 LinkedIn carousels, and 3 newsletter drafts. Review the queue." },
    { id: 'ag-s22', name: 'The Architect', role: 'MASTER ORCHESTRATOR', rarity: 'rarity-legendary', traits: ['Supreme', 'Strategic', 'God-Tier'], image: 'https://images.unsplash.com/photo-1504257432389-523431e11905?w=400&h=400&fit=crop', greeting: "All 21 subordinates are operating at peak efficiency. I have aligned their tasks with your primary revenue directives. We are unstoppable." }
];

document.addEventListener('DOMContentLoaded', () => {
    const rosterGrid = document.getElementById('rosterGrid');
    const uplinkPanel = document.getElementById('uplinkPanel');
    const closeUplink = document.getElementById('closeUplink');
    const activeAgentProfile = document.getElementById('activeAgentProfile');
    const chatLog = document.getElementById('chatLog');
    const mintBtn = document.getElementById('mintAgentBtn');
    const overlay = document.getElementById('decryptionOverlay');
    const decryptionLog = document.getElementById('decryptionLog');

    function renderRoster() {
        rosterGrid.innerHTML = '';
        agentsDatabase.forEach(agent => {
            const card = document.createElement('div');
            card.className = `agent-card ${agent.rarity}`;
            card.innerHTML = `
                <div class="card-header">
                    <div class="agent-avatar" style="background-image: url('${agent.image}')"></div>
                    <div class="agent-info">
                        <h3>${agent.name}</h3>
                        <p class="agent-role">${agent.role}</p>
                    </div>
                </div>
                <div class="trait-tags">
                    ${agent.traits.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 0.5rem;">
                    STATUS: <span style="color: var(--accent-primary)">AWAITING ORDERS</span>
                </div>
            `;
            card.addEventListener('click', () => openUplink(agent));
            rosterGrid.appendChild(card);
        });
    }

    function openUplink(agent) {
        activeAgentProfile.innerHTML = `
            <div class="agent-avatar" style="background-image: url('${agent.image}')"></div>
            <div>
                <h3 style="margin-bottom: 0.2rem;">${agent.name}</h3>
                <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-primary);">${agent.role}</p>
            </div>
        `;

        chatLog.innerHTML = `
            <div class="chat-message system-msg">
                Connection secured to Node ${agent.id}. End-to-end encryption active.
            </div>
        `;

        uplinkPanel.classList.add('active');

        setTimeout(() => {
            const msg = document.createElement('div');
            msg.className = 'chat-message msg-agent';
            msg.innerHTML = `<strong>${agent.name}:</strong> ${agent.greeting}`;
            chatLog.appendChild(msg);
            
            document.querySelector('.chat-input').disabled = false;
            document.querySelector('.btn-send').disabled = false;
        }, 1200);
    }

    closeUplink.addEventListener('click', () => {
        uplinkPanel.classList.remove('active');
        document.querySelector('.chat-input').disabled = true;
        document.querySelector('.btn-send').disabled = true;
    });

    mintBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        
        const logs = [
            "Bypassing mainframe protocols...",
            "Extracting neural blueprint...",
            "Synthesizing Flawed Savant DNA...",
            "Matching biometric signatures...",
            "OPERATIVE SECURED."
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step < logs.length) {
                decryptionLog.innerText = logs[step];
                step++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    alert("Maximum Roster Capacity Reached. Simulation Complete.");
                }, 1000);
            }
        }, 800);
    });

    renderRoster();
});