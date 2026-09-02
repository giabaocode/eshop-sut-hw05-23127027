#!/bin/sh
# Start one detached disposable backend and fail closed unless it owns port 3000.

set -eu

if [ "$#" -ne 3 ]; then
  echo "usage: start-disposable-backend.sh RUNTIME_ROOT LOG_FILE PID_FILE" >&2
  exit 64
fi

runtime_root=$(CDPATH= cd -- "$1" && pwd -P)
log_file=$2
pid_file=$3
marker="$runtime_root/.wf03-disposable-runtime"
backend_root="$runtime_root/backend"

case "$runtime_root" in
  /private/tmp/*) ;;
  *) echo "backend start safety error: runtime must be under /private/tmp" >&2; exit 65 ;;
esac
if [ ! -f "$marker" ] || [ "$(sed -n '1p' "$marker")" != WF03_DISPOSABLE_RUNTIME ]; then
  echo "backend start safety error: disposable marker is invalid" >&2
  exit 66
fi
if [ -e "$pid_file" ] || [ -e "$log_file" ]; then
  echo "backend start safety error: log and PID paths must be new" >&2
  exit 67
fi
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "backend start safety error: port 3000 is already occupied" >&2
  exit 68
fi

mkdir -p "$(dirname -- "$log_file")" "$(dirname -- "$pid_file")"
nohup sh -c 'cd "$1" && exec /opt/homebrew/bin/node server.js' sh "$backend_root" \
  >> "$log_file" 2>&1 &
backend_pid=$!

stop_child() {
  if kill -0 "$backend_pid" 2>/dev/null; then kill -TERM "$backend_pid" 2>/dev/null || true; fi
}
trap stop_child INT TERM HUP

attempt=0
while [ "$attempt" -lt 20 ]; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    echo "backend start safety error: owned process exited before validation" >&2
    exit 69
  fi
  listener_pid=$(lsof -nP -t -iTCP:3000 -sTCP:LISTEN 2>/dev/null | sort -u || true)
  if [ "$listener_pid" = "$backend_pid" ]; then break; fi
  if [ -n "$listener_pid" ]; then
    stop_child
    echo "backend start safety error: a different PID acquired port 3000" >&2
    exit 70
  fi
  sleep 0.25
  attempt=$((attempt + 1))
done

if [ "${listener_pid:-}" != "$backend_pid" ]; then
  stop_child
  echo "backend start safety error: owned process did not acquire port 3000" >&2
  exit 71
fi

listener_cwd=$(lsof -a -p "$backend_pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
if [ "$listener_cwd" != "$backend_root" ]; then
  stop_child
  echo "backend start safety error: listener cwd is outside disposable backend" >&2
  exit 72
fi

printf '%s\n' "$backend_pid" > "$pid_file"
chmod 600 "$pid_file" "$log_file"
trap - INT TERM HUP
printf 'disposable backend ready: pid=%s cwd=%s\n' "$backend_pid" "$listener_cwd"
