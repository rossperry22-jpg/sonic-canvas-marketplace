import re

with open('taskdraft.css', 'r') as f:
    content = f.read()

# Find the UTILITY comment
insertion_point = content.find('/* UTILITY */')
if insertion_point == -1:
    print("Could not find UTILITY comment")
    exit(1)

new_styles = """
/* ADDITIONAL STYLES */
.stats {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    min-width: 150px;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-cyan);
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem;
    color: var(--text-secondary);
    font-size: 1.2rem;
}

footer {
    margin-top: 4rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-note {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.5rem;
}

.roster-section h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}
"""

new_content = content[:insertion_point] + new_styles + content[insertion_point:]

with open('taskdraft.css', 'w') as f:
    f.write(new_content)

print("Added additional styles.")