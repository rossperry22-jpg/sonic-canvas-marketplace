// QUANTUM SYNDICATE - Agent Interactions & UI Logic

const agentsDatabase = [
    {
        id: 'ag-001',
        name: 'Elias Vance',
        role: 'FINANCIAL ARBITRAGE',
        rarity: 'rarity-legendary',
        traits: ['Ruthless', 'High-Frequency', 'Analytical'],
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        greeting: "Uplink established. Markets are volatile today. I've identified three micro-arbitrage opportunities in the last 4 seconds. Shall we execute?"
    },
    {
        id: 'ag-002',
        name: 'Sarah Chen',
        role: 'B2B OUTREACH',
        rarity: 'rarity-epic',
        traits: ['Persuasive', 'Empathetic', 'Relentless'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        greeting: "Hey boss. I've scraped 400 new leads matching your ideal client profile. I drafted the cold sequences. Just need your green light to launch."
    },
    {
        id: 'ag-003',
        name: 'Cipher',
        role: 'SEO & SCRAPING',
        rarity: 'rarity-rare',
        traits: ['Silent', 'Methodical', 'Thorough'],
        image: 'https://images.unsplash.com/photo-1526800544336-d04f0cbfd700?w=400&h=400&fit=crop',
        greeting: "Target domains indexed. Competitor backlink profiles acquired. Tell me what to extract next."
    }
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

    // Render Initial Roster
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

    // Open Chat/Uplink
    function openUplink(agent) {
        activeAgentProfile.innerHTML = `
            <div class="agent-avatar" style="background-image: url('${agent.image}')"></div>
            <div>
                <h3 style="margin-bottom: 0.2rem;">${agent.name}</h3>
                <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-primary);">${agent.role}</p>
            </div>
        `;

        // Reset chat
        chatLog.innerHTML = `
            <div class="chat-message system-msg">
                Connection secured to Node ${agent.id}. End-to-end encryption active.
            </div>
        `;

        uplinkPanel.classList.add('active');

        // Simulate agent typing delay
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.className = 'chat-message msg-agent';
            msg.innerHTML = `<strong>${agent.name}:</strong> ${agent.greeting}`;
            chatLog.appendChild(msg);
            
            // Enable inputs
            document.querySelector('.chat-input').disabled = false;
            document.querySelector('.btn-send').disabled = false;
        }, 1200);
    }

    closeUplink.addEventListener('click', () => {
        uplinkPanel.classList.remove('active');
        document.querySelector('.chat-input').disabled = true;
        document.querySelector('.btn-send').disabled = true;
    });

    // Simulated Minting Process
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
                    // In a real app, we'd add a new agent to the array here and re-render
                    alert("New Operative Acquired! (Simulation Complete)");
                }, 1000);
            }
        }, 800);
    });

    renderRoster();
});