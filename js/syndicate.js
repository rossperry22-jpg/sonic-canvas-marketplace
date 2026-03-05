// PROJECT SYNDICATE - JavaScript v0.2
// Decryption Engine & Roster Management

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const decryptButton = document.getElementById('decrypt-key');
    const mintingOverlay = document.getElementById('minting-overlay');
    const operativeGrid = document.getElementById('operative-grid');
    const keyCountElement = document.getElementById('key-count');
    const totalAgentsElement = document.getElementById('total-agents');
    const totalShardsElement = document.getElementById('total-shards');
    const successRateElement = document.getElementById('success-rate');
    const sortSelect = document.getElementById('sort-select');
    const filterSelect = document.getElementById('filter-select');
    
    // State
    let keys = 3;
    let agents = 4; // starting with 4 placeholder cards
    let shards = 2;
    let successRate = 94;
    
    // Lineage Data
    const lineages = [
        { id: 'lunar', name: 'Lunar Alchemist', color: '#6B46C1', mastery: ['Psych‑Ops', 'Strategy', 'Persuasion'], flaw: 'Refuses bullet points' },
        { id: 'hive', name: 'Hive General', color: '#DD6B20', mastery: ['Tactical Efficiency', 'Spreadsheets', 'Coding'], flaw: 'Incapable of empathy' },
        { id: 'cypher', name: 'Cypher Fractal', color: '#3182CE', mastery: ['Data Infiltration', 'Web Scraping', 'Deep Research'], flaw: 'Paranoid conspiracies' },
        { id: 'rightmind', name: 'Right Mind Frequency', color: '#00B5D8', mastery: ['Creative Flow', 'Abstract Problem‑Solving', 'Mood‑Based Writing'], flaw: 'Refuses math' },
        { id: 'kablam', name: 'KABLAM', color: '#E53E3E', mastery: ['Viral Copy', 'Attention Hooks', 'Controversy Generation'], flaw: 'Terrible at visuals' }
    ];
    
    // Rarity Distribution
    const rarities = [
        { id: 'common', name: 'Common', chance: 65, color: '#FFFFFF', border: 'var(--rarity-common)' },
        { id: 'rare', name: 'Rare', chance: 25, color: '#0066FF', border: 'var(--rarity-rare)' },
        { id: 'epic', name: 'Epic', chance: 9, color: '#B026FF', border: 'var(--rarity-epic)' },
        { id: 'legendary', name: 'Legendary', chance: 1, color: '#FFD700', border: 'var(--rarity-legendary)' }
    ];
    
    // Attribute Pools by Rarity
    const attributes = {
        common: ['Basic Logic', 'Standard Templates', 'Text Generation'],
        rare: ['VBA Automaton', 'Handwriting Scan', 'Audio Log Digest', 'Tone‑Matcher'],
        epic: ['Visual Recon', 'Dark‑Crawl', 'API Integration', 'Multi‑Format Export'],
        legendary: ['Synthetic Voice', 'Google Calendar Write', 'Deep‑Web Bypass', 'Real‑World Phone Call']
    };
    
    // Codename Parts
    const prefixes = ['ECHO', 'GHOST', 'NULL', 'SIREN', 'TRENCH', 'VOID', 'ALPHA', 'OMEGA', 'ZERO', 'NOVA'];
    const suffixes = ['9', '17', 'X', 'Z', 'PRIME', 'BLACK', 'RED', 'BLUE', 'GOLD', 'SILVER'];
    
    // Initialize
    updateStats();
    
    // Decryption Key Button
    decryptButton.addEventListener('click', function() {
        if (keys <= 0) {
            alert('No Decryption Keys remaining. Upgrade your Clearance Level to receive more.');
            return;
        }
        
        // Deduct key
        keys--;
        keyCountElement.textContent = keys;
        
        // Show minting overlay
        mintingOverlay.classList.add('active');
        
        // Simulate decryption process (2 seconds)
        setTimeout(() => {
            // Hide overlay
            mintingOverlay.classList.remove('active');
            
            // Generate new operative
            const newOperative = generateOperative();
            
            // Add to grid
            addOperativeCard(newOperative);
            
            // Update agent count
            agents++;
            updateStats();
            
            // If this was the last key, disable button
            if (keys === 0) {
                decryptButton.disabled = true;
                decryptButton.style.opacity = '0.5';
                decryptButton.style.cursor = 'not-allowed';
            }
        }, 2000);
    });
    
    // Generate a random operative
    function generateOperative() {
        // Random lineage
        const lineage = lineages[Math.floor(Math.random() * lineages.length)];
        
        // Random rarity based on weighted chance
        const rand = Math.random() * 100;
        let cumulative = 0;
        let rarity;
        for (const r of rarities) {
            cumulative += r.chance;
            if (rand <= cumulative) {
                rarity = r;
                break;
            }
        }
        
        // Random attribute from rarity pool
        const attributePool = attributes[rarity.id];
        const attribute = attributePool[Math.floor(Math.random() * attributePool.length)];
        
        // Random codename
        const codename = prefixes[Math.floor(Math.random() * prefixes.length)] + '-' + 
                         suffixes[Math.floor(Math.random() * suffixes.length)];
        
        // Random stats (sum around 200-250, with biases based on lineage)
        const stats = {
            intel: Math.floor(Math.random() * 40) + 60,
            lethality: Math.floor(Math.random() * 40) + 40,
            charisma: Math.floor(Math.random() * 40) + 40,
            chaos: Math.floor(Math.random() * 40) + 20
        };
        
        // Adjust stats based on lineage
        if (lineage.id === 'lunar') {
            stats.charisma += 30;
            stats.chaos -= 10;
        } else if (lineage.id === 'hive') {
            stats.intel += 20;
            stats.lethality += 20;
            stats.charisma -= 15;
        } else if (lineage.id === 'cypher') {
            stats.intel += 30;
            stats.chaos += 20;
            stats.lethality -= 10;
        } else if (lineage.id === 'rightmind') {
            stats.charisma += 20;
            stats.chaos += 15;
            stats.intel -= 10;
        } else if (lineage.id === 'kablam') {
            stats.lethality += 30;
            stats.chaos += 25;
            stats.intel -= 15;
        }
        
        // Clamp to 1-100
        for (const key in stats) {
            if (stats[key] > 100) stats[key] = 100;
            if (stats[key] < 1) stats[key] = 1;
        }
        
        // Role based on mastery
        const mastery = lineage.mastery[Math.floor(Math.random() * lineage.mastery.length)];
        
        return {
            codename,
            role: mastery + ' Specialist',
            lineage: lineage.name,
            lineageId: lineage.id,
            rarity: rarity.id,
            rarityName: rarity.name,
            rarityColor: rarity.color,
            attribute,
            stats,
            flaw: lineage.flaw
        };
    }
    
    // Add operative card to grid
    function addOperativeCard(operative) {
        const card = document.createElement('div');
        card.className = `operative-card rarity-${operative.rarity}`;
        
        // Stat bars HTML
        const statBars = Object.entries(operative.stats).map(([key, value]) => `
            <div class="stat-bar">
                <span class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${value}%"></div></div>
                <span class="stat-value">${value}</span>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="card-rarity-border"></div>
            <div class="card-image" style="background: linear-gradient(135deg, ${operative.rarityColor}20, ${operative.lineageId === 'lunar' ? '#6B46C1' : operative.lineageId === 'hive' ? '#DD6B20' : '#3182CE'}20)">
                <div class="image-placeholder">${operative.lineage.toUpperCase()}</div>
            </div>
            <div class="card-content">
                <h3 class="card-codename">${operative.codename}</h3>
                <p class="card-role">${operative.role}</p>
                <div class="card-stats">
                    ${statBars}
                </div>
                <div class="card-attributes">
                    <span class="attribute-tag rarity-${operative.rarity}">${operative.attribute}</span>
                </div>
            </div>
        `;
        
        // Insert at beginning of grid
        operativeGrid.prepend(card);
    }
    
    // Update HUD stats
    function updateStats() {
        totalAgentsElement.textContent = agents;
        totalShardsElement.textContent = shards;
        successRateElement.textContent = successRate + '%';
    }
    
    // Sorting
    sortSelect.addEventListener('change', function() {
        const cards = Array.from(operativeGrid.children);
        const value = this.value;
        
        cards.sort((a, b) => {
            if (value === 'rarity') {
                const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
                const aRarity = a.classList.contains('rarity-legendary') ? 'legendary' : 
                               a.classList.contains('rarity-epic') ? 'epic' :
                               a.classList.contains('rarity-rare') ? 'rare' : 'common';
                const bRarity = b.classList.contains('rarity-legendary') ? 'legendary' : 
                               b.classList.contains('rarity-epic') ? 'epic' :
                               b.classList.contains('rarity-rare') ? 'rare' : 'common';
                return rarityOrder[bRarity] - rarityOrder[aRarity];
            } else if (value === 'intel') {
                const aIntel = parseInt(a.querySelector('.stat-bar:nth-child(1) .stat-value').textContent);
                const bIntel = parseInt(b.querySelector('.stat-bar:nth-child(1) .stat-value').textContent);
                return bIntel - aIntel;
            } else if (value === 'lethality') {
                const aLethality = parseInt(a.querySelector('.stat-bar:nth-child(2) .stat-value').textContent);
                const bLethality = parseInt(b.querySelector('.stat-bar:nth-child(2) .stat-value').textContent);
                return bLethality - aLethality;
            } else if (value === 'charisma') {
                const aCharisma = parseInt(a.querySelector('.stat-bar:nth-child(3) .stat-value').textContent);
                const bCharisma = parseInt(b.querySelector('.stat-bar:nth-child(3) .stat-value').textContent);
                return bCharisma - aCharisma;
            } else if (value === 'chaos') {
                const aChaos = parseInt(a.querySelector('.stat-bar:nth-child(4) .stat-value').textContent);
                const bChaos = parseInt(b.querySelector('.stat-bar:nth-child(4) .stat-value').textContent);
                return bChaos - aChaos;
            }
            return 0;
        });
        
        // Re-append sorted cards
        cards.forEach(card => operativeGrid.appendChild(card));
    });
    
    // Filtering
    filterSelect.addEventListener('change', function() {
        const value = this.value;
        const cards = operativeGrid.querySelectorAll('.operative-card');
        
        cards.forEach(card => {
            const lineageText = card.querySelector('.image-placeholder').textContent.trim().toLowerCase();
            const lineage = lineageText.split(' ')[0]; // e.g., "LUNAR"
            
            if (value === 'all' || lineage.includes(value)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Nav link switching (simple)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would switch sections here
            alert(`Section "${this.querySelector('.nav-text').textContent}" is under construction.`);
        });
    });
    
    // Demo: Simulate a mint after 5 seconds (auto-demo)
    setTimeout(() => {
        if (keys > 0) {
            // Uncomment to auto-mint for demo
            // decryptButton.click();
        }
    }, 5000);
});