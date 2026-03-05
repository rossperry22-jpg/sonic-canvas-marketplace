// TASKDRAFT PROGRESSIVE GACHA ALPHA BUILD - HOLOGRAPHIC GRADING ENGINE

class TaskDraftEngine {
    constructor() {
        this.agents = [];
        this.draftedAgents = []; // each agent has {id, name, department, grade, utility}
        this.computeCredits = 3; // Starting credits
        this.subscriptionActive = false;
        
        // Grade weights: F:30%, D:25%, C:20%, B:15%, A:8%, S:2%
        this.gradeWeights = [
            {grade: 'F', weight: 30},
            {grade: 'D', weight: 25},
            {grade: 'C', weight: 20},
            {grade: 'B', weight: 15},
            {grade: 'A', weight: 8},
            {grade: 'S', weight: 2}
        ];
        
        this.init();
    }
    
    async init() {
        await this.loadAgents();
        this.renderRoster();
        this.setupEventListeners();
        this.setupMouseTracking();
        this.updateUI();
    }
    
    async loadAgents() {
        try {
            const response = await fetch('data/taskdraft_alpha_v2.json');
            this.agents = await response.json();
            console.log(`Loaded ${this.agents.length} progressive agents.`);
        } catch (error) {
            console.error('Failed to load agents:', error);
            this.agents = this.getFallbackAgents();
        }
    }
    
    getFallbackAgents() {
        // Minimal fallback with grades
        return [
            {
                id: 'td_01',
                name: 'The Resume Hacker',
                department: 'Career',
                grades: {
                    F: 'Reviews resume & suggests keywords.',
                    D: 'Basic version: Reviews resume & suggests keywords.',
                    C: 'Improved: Reviews resume & suggests keywords. with some additional guidance.',
                    B: 'Advanced: Rewrites resume per ATS, drafts cover letter, formats to PDF. Provides detailed steps.',
                    A: 'Professional: Rewrites resume per ATS, drafts cover letter, formats to PDF. Includes automation elements.',
                    S: 'Rewrites resume per ATS, drafts cover letter, formats to PDF.'
                }
            },
            {
                id: 'td_02',
                name: 'The Tax-Writeoff Scraper',
                department: 'Finance',
                grades: {
                    F: 'Lists common 1099 deductions.',
                    D: 'Basic version: Lists common 1099 deductions.',
                    C: 'Improved: Lists common 1099 deductions. with some additional guidance.',
                    B: 'Advanced: Ingests bank CSVs and auto-categorizes every hidden write-off. Provides detailed steps.',
                    A: 'Professional: Ingests bank CSVs and auto-categorizes every hidden write-off. Includes automation elements.',
                    S: 'Ingests bank CSVs and auto-categorizes every hidden write-off.'
                }
            }
        ];
    }
    
    // Randomly select a grade based on weights
    rollGrade() {
        const totalWeight = this.gradeWeights.reduce((sum, g) => sum + g.weight, 0);
        let random = Math.random() * totalWeight;
        for (const g of this.gradeWeights) {
            if (random < g.weight) {
                return g.grade;
            }
            random -= g.weight;
        }
        return 'F'; // fallback
    }
    
    // Draft a random agent with a random grade
    draftAgent() {
        if (this.computeCredits < 1) {
            alert('Insufficient Compute Credits. Purchase a subscription to get more.');
            return;
        }
        
        this.computeCredits--;
        this.updateUI();
        
        this.showGachaOverlay();
        
        setTimeout(() => {
            const randomAgent = this.getRandomAgent();
            const grade = this.rollGrade();
            const drafted = {
                ...randomAgent,
                grade: grade,
                utility: randomAgent.grades[grade]
            };
            this.draftedAgents.push(drafted);
            this.revealAgent(drafted);
        }, 2000);
    }
    
    getRandomAgent() {
        const idx = Math.floor(Math.random() * this.agents.length);
        // Return a copy to avoid mutation
        return JSON.parse(JSON.stringify(this.agents[idx]));
    }
    
    renderRoster() {
        const rosterStage = document.getElementById('rosterStage');
        if (!rosterStage) return;
        
        rosterStage.innerHTML = '';
        
        if (this.draftedAgents.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>No agents drafted yet. Click "DRAFT NEW AGENT" to begin.</p>';
            rosterStage.appendChild(emptyState);
        } else {
            this.draftedAgents.forEach(agent => {
                const card = this.createAgentCard(agent);
                rosterStage.appendChild(card);
            });
            
            this.setupCardMouseTracking();
        }
    }
    
    createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = `agent-card grade-${agent.grade.toLowerCase()}`;
        card.dataset.id = agent.id;
        
        // Mouse tracking variables
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        
        card.innerHTML = `
            <div class="card-header">
                <div class="agent-name">${agent.name}</div>
                <div class="grade-badge grade-${agent.grade.toLowerCase()}">${agent.grade}</div>
            </div>
            <div class="department">${agent.department} Department</div>
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">UNLOCKED UTILITY</div>
                    <div class="stat-value">${agent.utility}</div>
                </div>
            </div>
            <div class="card-footer">
                <button class="deploy-btn" data-id="${agent.id}">${this.subscriptionActive ? 'INITIATE NEURAL LINK' : 'DEPLOY (Requires Compute)'}</button>
                <div class="credits-cost">1 Compute Credit</div>
            </div>
        `;
        
        return card;
    }
    
    setupEventListeners() {
        const draftBtn = document.getElementById('draftBtn');
        if (draftBtn) {
            draftBtn.addEventListener('click', () => this.draftAgent());
        }
        
        const simulatePaymentBtn = document.getElementById('simulatePaymentBtn');
        if (simulatePaymentBtn) {
            simulatePaymentBtn.addEventListener('click', () => this.activateSubscription());
        }
        
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Delegate deploy button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('deploy-btn')) {
                if (this.subscriptionActive) {
                    const agentId = e.target.dataset.id;
                    const agent = this.draftedAgents.find(a => a.id === agentId);
                    if (agent) {
                        openNeuralLink(agent.name);
                    }
                } else {
                    const agentId = e.target.dataset.id;
                    this.showDeployModal(agentId);
                }
            }
        });
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        });
    }
    
    setupCardMouseTracking() {
        document.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
    }
    
    showGachaOverlay() {
        const overlay = document.getElementById('gachaOverlay');
        if (!overlay) return;
        
        overlay.style.display = 'flex';
        
        const laser = overlay.querySelector('.laser');
        if (laser) {
            laser.style.animation = 'scan 2s linear infinite';
        }
    }
    
    revealAgent(agent) {
        const overlay = document.getElementById('gachaOverlay');
        if (!overlay) return;
        
        const laser = overlay.querySelector('.laser');
        if (laser) {
            laser.style.animation = 'none';
        }
        
        const dossier = overlay.querySelector('.dossier-icon');
        if (dossier) {
            dossier.classList.add('reveal-card');
            
            setTimeout(() => {
                dossier.innerHTML = '';
                const card = this.createAgentCard(agent);
                card.style.transform = 'scale(1.2)';
                dossier.appendChild(card);
                
                setTimeout(() => {
                    overlay.style.display = 'none';
                    dossier.classList.remove('reveal-card');
                    dossier.innerHTML = `<div class="laser"></div>ENCRYPTED DOSSIER`;
                    this.renderRoster();
                }, 3000);
            }, 800);
        }
    }
    
    showDeployModal(agentId) {
        const agent = this.draftedAgents.find(a => a.id === agentId);
        if (!agent) return;
        
        const modal = document.getElementById('deployModal');
        if (!modal) return;
        
        const agentNameElem = modal.querySelector('#modalAgentName');
        if (agentNameElem) {
            agentNameElem.textContent = agent.name;
        }
        
        modal.style.display = 'flex';
    }
    
    activateSubscription() {
        this.subscriptionActive = true;
        this.computeCredits += 10; // Monthly allotment
        this.updateUI();
        this.closeModal();
        
        // Update all deploy buttons
        document.querySelectorAll('.deploy-btn').forEach(btn => {
            btn.textContent = 'INITIATE NEURAL LINK';
            btn.classList.remove('disabled');
        });
    }
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    updateUI() {
        const creditsElem = document.getElementById('computeCredits');
        if (creditsElem) {
            creditsElem.textContent = this.computeCredits;
        }
        
        const draftBtn = document.getElementById('draftBtn');
        if (draftBtn) {
            draftBtn.disabled = this.computeCredits < 1;
            draftBtn.textContent = `DRAFT NEW AGENT (${this.computeCredits} Compute Credit${this.computeCredits !== 1 ? 's' : ''} Left)`;
        }
        
        const subStatus = document.getElementById('subscriptionStatus');
        if (subStatus) {
            if (this.subscriptionActive) {
                subStatus.textContent = 'STARTER TIER ACTIVE';
                subStatus.style.color = '#00FF00';
            } else {
                subStatus.textContent = 'NO SUBSCRIPTION';
                subStatus.style.color = '#FF5555';
            }
        }
        
        const agentsDraftedElem = document.getElementById('agentsDrafted');
        if (agentsDraftedElem) {
            agentsDraftedElem.textContent = this.draftedAgents.length;
        }
        
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = this.draftedAgents.length === 0 ? 'block' : 'none';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.taskDraft = new TaskDraftEngine();
});

// Utility: open neural link (simulate ChatGPT handoff)
function openNeuralLink(agentName) {
    const encodedName = encodeURIComponent(agentName);
    const url = `https://chat.openai.com/?q=I+need+assistance+from+${encodedName}+on+TaskDraft`;
    window.open(url, '_blank');
}

window.openNeuralLink = openNeuralLink;