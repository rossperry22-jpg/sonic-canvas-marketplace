import re

with open('taskdraft.js', 'r') as f:
    lines = f.readlines()

# Find start and end of createAgentCard function
start = None
end = None
for i, line in enumerate(lines):
    if line.strip().startswith('createAgentCard(agent) {'):
        start = i
    if start is not None and i > start and line.strip() == '}' and lines[i-1].strip() == '':
        # This might be the closing brace of the function
        # Check that next line is not part of same block
        if i+1 < len(lines) and lines[i+1].strip() == '':
            end = i
            break

if start is None or end is None:
    print("Could not locate function")
    exit(1)

print(f"Function lines {start} to {end}")

# New function content
new_func = '''    createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = `agent-card rarity-${agent.rarity.toLowerCase()}`;
        card.dataset.id = agent.id;
        
        // Mouse tracking variables will be set via JS
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        
        card.innerHTML = `
            <div class="card-header">
                <div class="agent-name">${agent.name}</div>
                <div class="rarity-badge">${agent.rarity}</div>
            </div>
            <div class="department">${agent.department} Department</div>
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">S‑TIER MASTERY</div>
                    <div class="stat-value stat-s">${agent.s_tier}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">F‑TIER INCOMPETENCE</div>
                    <div class="stat-value stat-f">${agent.f_tier}</div>
                </div>
            </div>
            <div class="quirk">${agent.quirk}</div>
            <div class="card-footer">
                <button class="deploy-btn" data-id="${agent.id}">${this.subscriptionActive ? 'INITIATE NEURAL LINK' : 'DEPLOY OPERATIVE'}</button>
                <div class="credits-cost">1 Compute Credit</div>
            </div>
        `;
        
        return card;
    }'''

# Replace lines
lines[start:end+1] = [new_func + '\n']

with open('taskdraft.js', 'w') as f:
    f.writelines(lines)

print("Updated createAgentCard function.")