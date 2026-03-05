import re

with open('taskdraft.js', 'r') as f:
    content = f.read()

# Find the line with DEPLOY OPERATIVE inside the template literal
# Use regex to match the exact line with proper indentation
pattern = r'(\s*)<button class="deploy-btn" data-id="\$\{agent\.id\}">DEPLOY OPERATIVE</button>'
replacement = r'\1<button class="deploy-btn" data-id="${agent.id}">${this.subscriptionActive ? \'INITIATE NEURAL LINK\' : \'DEPLOY OPERATIVE\'}</button>'

new_content = re.sub(pattern, replacement, content)

if new_content == content:
    print("No replacement made; pattern not found.")
    # Try alternative pattern with different spacing
    pattern2 = r'(\s*)<button class="deploy-btn" data-id="\$\{agent\.id\}">DEPLOY OPERATIVE</button>'
    new_content = re.sub(pattern2, replacement, content)
    if new_content == content:
        print("Second attempt failed.")
        exit(1)

with open('taskdraft.js', 'w') as f:
    f.write(new_content)

print("Updated button text in createAgentCard.")