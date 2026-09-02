#!/bin/sh
# Atomic pre-operation guard for the exact disposable localhost listener.

set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: verify-owned-listener.sh RUNTIME_ROOT EXPECTED_PID" >&2
  exit 64
fi

runtime_root=$(CDPATH= cd -- "$1" && pwd -P)
expected_pid=$2
backend_root="$runtime_root/backend"

case "$expected_pid" in
  ''|*[!0-9]*|0|1) echo "listener safety error: invalid expected PID" >&2; exit 65 ;;
esac
if ! kill -0 "$expected_pid" 2>/dev/null; then
  echo "listener safety error: expected process is not alive" >&2
  exit 66
fi
listener_pid=$(lsof -nP -t -iTCP:3000 -sTCP:LISTEN 2>/dev/null | sort -u || true)
if [ "$listener_pid" != "$expected_pid" ]; then
  echo "listener safety error: port owner does not equal expected PID" >&2
  exit 67
fi
listener_cwd=$(lsof -a -p "$expected_pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
if [ "$listener_cwd" != "$backend_root" ]; then
  echo "listener safety error: listener cwd is outside disposable backend" >&2
  exit 68
fi
printf 'owned listener verified: pid=%s cwd=%s\n' "$expected_pid" "$listener_cwd"
