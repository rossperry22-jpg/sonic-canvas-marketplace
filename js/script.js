// Sonic Canvas Marketplace - Interactive Script
document.addEventListener('DOMContentLoaded', function() {
    // State
    let personas = [];
    let filteredPersonas = [];
    let activeFilter = 'all';
    let searchQuery = '';
    
    // DOM Elements
    const personaGrid = document.getElementById('persona-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statTotal = document.getElementById('stat-total');
    const statImages = document.getElementById('stat-images');
    const statClusters = document.getElementById('stat-clusters');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    // Initialize
    loadPersonas();
    
    // Load personas data
    async function loadPersonas() {
        try {
            const response = await fetch('data/personas.json');
            personas = await response.json();
            filteredPersonas = [...personas];
            updateStats();
            renderPersonas();
            setupFilters();
        } catch (error) {
            console.error('Failed to load personas:', error);
            personaGrid.innerHTML = '<p class="error">Failed to load personas. Please try again later.</p>';
        }
    }
    
    // Update statistics
    function updateStats() {
        statTotal.textContent = personas.length;
        const withImages = personas.filter(p => p.image).length;
        statImages.textContent = withImages;
        const clusters = new Set(personas.map(p => p.cluster_id));
        statClusters.textContent = clusters.size;
    }
    
    // Render persona cards
    function renderPersonas() {
        if (filteredPersonas.length === 0) {
            personaGrid.innerHTML = '<p class="no-results">No personas match your search. Try a different filter or search term.</p>';
            return;
        }
        
        let html = '';
        filteredPersonas.forEach(persona => {
            const imageUrl = persona.image ? `assets/images/${persona.image}` : '';
            const placeholderStyle = persona.image ? '' : `background: ${persona.color};`;
            const placeholderText = persona.image ? '' : `<div class="placeholder">${persona.name.charAt(0)}</div>`;
            
            html += `
            <div class="persona-card" data-id="${persona.id}">
                <div class="card-image" style="${placeholderStyle} ${imageUrl ? `background-image: url('${imageUrl}')` : ''}">
                    ${placeholderText}
                </div>
                <div class="card-content">
                    <div class="persona-name">
                        ${persona.name}
                        <span class="cluster-badge">Cluster ${persona.cluster_id}</span>
                    </div>
                    <div class="persona-imprint">${persona.imprint}</div>
                    <p class="persona-description">${persona.description}</p>
                    <div class="persona-bio">"${persona.bio.substring(0, 150)}..."</div>
                    <div class="use-cases">
                        <h4>Use Cases</h4>
                        <ul>
                            ${persona.use_cases.slice(0, 3).map(uc => `<li>${uc}</li>`).join('')}
                            ${persona.use_cases.length > 3 ? '<li>... and more</li>' : ''}
                        </ul>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-view" data-id="${persona.id}">View Details</button>
                        <button class="btn btn-secondary btn-buy" data-id="${persona.id}">License Now</button>
                    </div>
                </div>
            </div>
            `;
        });
        
        personaGrid.innerHTML = html;
        
        // Attach event listeners to buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id)));
        });
        document.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', () => handleBuy(parseInt(btn.dataset.id)));
        });
    }
    
    // Setup filter buttons
    function setupFilters() {
        // Collect unique cluster IDs
        const clusters = [...new Set(personas.map(p => p.cluster_id))].sort((a,b) => a - b);
        const filterContainer = document.querySelector('.filter-buttons');
        
        // Add 'All' button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.dataset.filter = 'all';
        allBtn.addEventListener('click', () => setFilter('all'));
        filterContainer.appendChild(allBtn);
        
        // Add cluster filters (limit to 10 for UI)
        clusters.slice(0, 10).forEach(cluster => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = `Cluster ${cluster}`;
            btn.dataset.filter = cluster;
            btn.addEventListener('click', () => setFilter(cluster));
            filterContainer.appendChild(btn);
        });
        
        // Add 'Delta' filter if any delta personas exist
        if (personas.some(p => p.delta)) {
            const deltaBtn = document.createElement('button');
            deltaBtn.className = 'filter-btn';
            deltaBtn.textContent = 'Delta Personas';
            deltaBtn.dataset.filter = 'delta';
            deltaBtn.addEventListener('click', () => setFilter('delta'));
            filterContainer.appendChild(deltaBtn);
        }
    }
    
    // Set active filter
    function setFilter(filter) {
        activeFilter = filter;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        applyFilters();
    }
    
    // Apply filters and search
    function applyFilters() {
        filteredPersonas = personas.filter(persona => {
            // Filter by cluster or delta
            if (activeFilter === 'all') {
                // pass
            } else if (activeFilter === 'delta') {
                if (!persona.delta) return false;
            } else {
                if (persona.cluster_id !== parseInt(activeFilter)) return false;
            }
            
            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchable = [
                    persona.name,
                    persona.description,
                    persona.bio,
                    persona.style,
                    persona.visual_identity,
                    persona.use_cases.join(' ')
                ].join(' ').toLowerCase();
                if (!searchable.includes(query)) return false;
            }
            
            return true;
        });
        
        renderPersonas();
    }
    
    // Search input handler
    searchInput.addEventListener('input', function() {
        searchQuery = this.value.trim().toLowerCase();
        applyFilters();
    });
    
    // Open modal with persona details
    function openModal(personaId) {
        const persona = personas.find(p => p.id === personaId);
        if (!persona) return;
        
        const imageUrl = persona.image ? `assets/images/${persona.image}` : '';
        const placeholderStyle = persona.image ? '' : `background: ${persona.color};`;
        const placeholderText = persona.image ? '' : `<div class="placeholder">${persona.name.charAt(0)}</div>`;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${persona.name}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-image" style="${placeholderStyle} ${imageUrl ? `background-image: url('${imageUrl}')` : ''}">
                    ${placeholderText}
                </div>
                <div class="modal-details">
                    <div class="modal-section">
                        <h3>Imprint & Style</h3>
                        <p><strong>Imprint:</strong> ${persona.imprint}</p>
                        <p><strong>Musical Style:</strong> ${persona.style}</p>
                        <p><strong>Cluster:</strong> ${persona.cluster_id} ${persona.delta ? ' (Delta)' : ''}</p>
                    </div>
                    <div class="modal-section">
                        <h3>Description</h3>
                        <p>${persona.description}</p>
                    </div>
                    <div class="modal-section">
                        <h3>Interactive Brain (Chatbot Sample)</h3>
                        <p>"${persona.bio}"</p>
                    </div>
                    <div class="modal-section">
                        <h3>Visual Identity</h3>
                        <p>${persona.visual_identity}</p>
                    </div>
                    <div class="modal-section">
                        <h3>Use Cases</h3>
                        <ul>
                            ${persona.use_cases.map(uc => `<li>${uc}</li>`).join('')}
                        </ul>
                    </div>
                    ${persona.lyrics ? `
                    <div class="modal-section">
                        <h3>Debut Lyrics</h3>
                        <p style="white-space: pre-line;">${persona.lyrics}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" id="modal-buy">License Digital Asset</button>
                    <button class="btn btn-secondary" id="modal-contact">Contact for Customization</button>
                </div>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        
        // Close modal buttons
        modalOverlay.querySelector('.close-modal').addEventListener('click', closeModal);
        modalOverlay.querySelector('#modal-buy').addEventListener('click', () => handleBuy(personaId));
        modalOverlay.querySelector('#modal-contact').addEventListener('click', () => handleContact(personaId));
        
        // Close modal when clicking outside
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
    }
    
    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
    }
    
    // Handle buy/license action
    function handleBuy(personaId) {
        const persona = personas.find(p => p.id === personaId);
        alert(`Thank you for your interest in licensing "${persona.name}"!\n\nA licensing specialist will contact you shortly with pricing and terms.`);
        // In a real app, would redirect to checkout or form
    }
    
    // Handle contact action
    function handleContact(personaId) {
        const persona = personas.find(p => p.id === personaId);
        alert(`Customization request for "${persona.name}" has been noted.\n\nOur creative team will reach out to discuss your project.`);
    }
    
    // Initial filter setup
    setFilter('all');
});