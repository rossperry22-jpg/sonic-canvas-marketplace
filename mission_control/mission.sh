#!/usr/bin/env bash
set -euo pipefail

now() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }
hr() { printf '\n%s\n' '------------------------------------------------------------'; }

echo "Mission Control — OpenClaw" 
echo "Time: $(now)"

hr
echo "[Gateway]"
openclaw gateway status || true

hr
echo "[Browser: openclaw profile]"
openclaw browser --browser-profile openclaw status || true

hr
echo "[Cron jobs]"
openclaw cron list 2>/dev/null || echo "(cron list unavailable via CLI in this environment — use gateway cron tool or install cron support)"

hr
echo "[Recent gateway logs]"
LOG="/tmp/openclaw/openclaw-$(date -u '+%Y-%m-%d').log"
if [ -f "$LOG" ]; then
  tail -n 120 "$LOG"
else
  echo "Log not found: $LOG"
  ls -la /tmp/openclaw 2>/dev/null || true
fi

hr
echo "Done."