// IMMERSIVE SINGLE-COLUMN ARCHITECTURE - STATE 6.4
// Overrides the default card rendering with full-viewport sections

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
    
    // Render persona sections
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
            
            // Truncate description if too long
            const description = persona.description.length > 500 ? persona.description.substring(0, 500) + '...' : persona.description;
            
            html += `
            <section class="persona-section" data-id="${persona.id}" style="background-color: ${persona.color}20;">
                <div class="container">
                    <div class="persona-section-content">
                        <div class="persona-portrait">
                            ${imageUrl ? `<img src="${imageUrl}" alt="${persona.name}" loading="lazy">` : `<div style="${placeholderStyle} height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white;">${placeholderText}</div>`}
                        </div>
                        <div class="persona-blueprint">
                            <h2 class="persona-name">${persona.name}</h2>
                            <div class="persona-imprint">${persona.imprint}</div>
                            <p class="persona-description">${description}</p>
                            <div class="learn-more-wrapper">
                                <a href="persona.html?id=${persona.id}" class="learn-more-icon" target="_blank" title="Learn more about ${persona.name}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                    <span>Learn more about ${persona.name}</span>
                                </a>
                                <div class="hover-overlay">
                                    <h4>Use Cases</h4>
                                    <ul>
                                        ${persona.use_cases.slice(0, 5).map(uc => `<li>${uc}</li>`).join('')}
                                        ${persona.use_cases.length > 5 ? '<li>... and more</li>' : ''}
                                    </ul>
                                    <h4>Interactive Brain</h4>
                                    <p>${persona.bio.substring(0, 200)}...</p>
                                    <h4>Musical Style</h4>
                                    <p>${persona.style}</p>
                                    <p><strong>License this persona for exclusive commercial use.</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `;
        });
        
        personaGrid.innerHTML = html;
        
        // Attach event listeners for modal and buy buttons (optional)
        // We can keep modal functionality if needed
    }
    
    // Setup filter buttons
    function setupFilters() {
        // Create filter buttons for clusters
        const clusters = [...new Set(personas.map(p => p.cluster_id))].sort((a, b) => a - b);
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;
        
        let filterHtml = '<button class="filter-btn active" data-filter="all">All</button>';
        clusters.forEach(cluster => {
            filterHtml += `<button class="filter-btn" data-filter="${cluster}">Cluster ${cluster}</button>`;
        });
        filterContainer.innerHTML = filterHtml;
        
        // Attach filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                filterPersonas();
            });
        });
    }
    
    // Filter personas based on active filter and search
    function filterPersonas() {
        let filtered = personas;
        
        // Apply cluster filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(p => p.cluster_id === parseInt(activeFilter));
        }
        
        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.bio.toLowerCase().includes(query) ||
                p.use_cases.some(uc => uc.toLowerCase().includes(query))
            );
        }
        
        filteredPersonas = filtered;
        renderPersonas();
    }
    
    // Search input event
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            filterPersonas();
        });
    }
    
    // Modal functions (optional, keep for compatibility)
    window.openModal = function(id) {
        const persona = personas.find(p => p.id === id);
        if (!persona) return;
        
        const imageUrl = persona.image ? `assets/images/${persona.image}` : '';
        const placeholderStyle = persona.image ? '' : `background: ${persona.color};`;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${persona.name}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-details">
                <div class="modal-image" style="${placeholderStyle} ${imageUrl ? `background-image: url('${imageUrl}')` : ''}">
                    ${imageUrl ? '' : `<div class="placeholder">${persona.name.charAt(0)}</div>`}
                </div>
                <div class="modal-info">
                    <div class="modal-section">
                        <h3>Lexical Blueprint</h3>
                        <p>${persona.description}</p>
                    </div>
                    <div class="modal-section">
                        <h3>Interactive Brain</h3>
                        <p>${persona.bio}</p>
                    </div>
                    <div class="modal-section">
                        <h3>Use Cases</h3>
                        <ul>
                            ${persona.use_cases.map(uc => `<li>${uc}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h3>Musical Style</h3>
                        <p>${persona.style}</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="handleBuy(${persona.id})">License Now</button>
                        <button class="btn btn-secondary modal-close">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        
        // Close buttons
        modalContent.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
        });
    };
    
    window.handleBuy = function(id) {
        alert(`Licensing request for persona ${id} sent to licensing team.`);
        // In production, this would open a contact form or checkout
    };
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
});