# Mission Control (OpenClaw)

This folder is a lightweight “mission control” for your OpenClaw instance.

## Quick start

From the server:

```bash
cd /root/.openclaw/workspace/mission_control
bash mission.sh
```

## What it shows

- Gateway status + URL/port
- Browser (openclaw profile) status
- Recent gateway log tail
- Cron jobs (if any)

## Notes

- This is **read-only** by default (no destructive actions).
- If you want buttons + a real web UI, we can add it next (but it requires deciding how you want to securely access the loopback-only gateway: SSH port-forward, Tailscale, or exposing behind auth).
