#!/usr/bin/env python3
import json
import os
import hashlib
import base64
from pathlib import Path

# Paths
workspace = Path("/root/.openclaw/workspace")
personas_json = workspace / "sonic_canvas_personas.json"
visuals_dir = Path("/root/Vector_Vault/sonic-canvas-visuals")
output_dir = Path("/root/.openclaw/workspace/sonic-canvas-marketplace")
data_file = output_dir / "data" / "personas.json"
images_dir = output_dir / "assets" / "images"

# Ensure directories
images_dir.mkdir(parents=True, exist_ok=True)

# Load personas
with open(personas_json, 'r') as f:
    personas = json.load(f)

print(f"Loaded {len(personas)} personas")

# Process each persona
enhanced_personas = []
for idx, p in enumerate(personas):
    name = p["persona_name"]
    folder_name = name.replace(" ", "_").upper()
    # Find debut_lyrics
    lyrics_path = visuals_dir / folder_name / "debut_lyrics.txt"
    lyrics = ""
    if lyrics_path.exists():
        with open(lyrics_path, 'r') as lf:
            lyrics = lf.read().strip()
    # Find portrait
    portrait_path = visuals_dir / folder_name / "portrait.png"
    image_filename = None
    if portrait_path.exists():
        # Copy to assets/images
        dest = images_dir / f"{folder_name}.png"
        import shutil
        shutil.copy2(portrait_path, dest)
        image_filename = f"{folder_name}.png"
    else:
        # No image, will use placeholder
        image_filename = None
    
    # Generate a deterministic color based on name
    name_hash = hashlib.md5(name.encode()).hexdigest()
    hue = int(name_hash[:2], 16) * 1.4  # 0-360
    color = f"hsl({hue % 360}, 70%, 50%)"
    
    # Use cases: parse acquisition_profile
    use_cases = p.get("acquisition_profile", "").split(";")
    if len(use_cases) == 1 and "," in use_cases[0]:
        use_cases = [uc.strip() for uc in use_cases[0].split(",")]
    else:
        use_cases = [uc.strip() for uc in use_cases if uc.strip()]
    
    # Short description: first sentence of lexical_blueprint
    desc = p.get("lexical_blueprint", "")
    if len(desc) > 150:
        desc = desc[:147] + "..."
    
    # Bio (interactive_brain) - sample chatbot text
    bio = p.get("interactive_brain", "")
    # Truncate if too long
    if len(bio) > 300:
        bio = bio[:297] + "..."
    
    enhanced = {
        "id": idx,
        "name": name,
        "imprint": p.get("imprint", "Sonic Canvas Records"),
        "style": p.get("suno_style_prompt", ""),
        "description": desc,
        "bio": bio,
        "visual_identity": p.get("visual_identity", ""),
        "use_cases": use_cases,
        "lyrics": lyrics,
        "image": image_filename,
        "color": color,
        "cluster_id": p.get("cluster_id", 0),
        "delta": p.get("delta", False)
    }
    enhanced_personas.append(enhanced)

# Save to data file
with open(data_file, 'w') as f:
    json.dump(enhanced_personas, f, indent=2)

print(f"Saved {len(enhanced_personas)} enhanced personas to {data_file}")
print(f"Copied {sum(1 for p in enhanced_personas if p['image'])} portrait images")