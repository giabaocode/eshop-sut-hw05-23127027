#!/bin/sh
# CORRECTED PILOT RUNNER — exact-PID watchdog; not an official scenario runner.

set -u

if [ "$#" -ne 3 ]; then
  echo "usage: run-pilot.sh RUNTIME_ROOT PRIVATE_CREDENTIAL_FILE OUTPUT_ROOT" >&2
  exit 64
fi

runtime_root=$1
credential_file=$2
output_root=$3
k6_bin=/opt/homebrew/bin/k6
scenario_file="$runtime_root/performance/scenarios/pilot.js"
marker_file="$runtime_root/.wf03-disposable-runtime"
hard_cap_seconds=300

if [ ! -x "$k6_bin" ]; then
  echo "pilot runner safety error: pinned k6 binary is unavailable" >&2
  exit 65
fi
if [ ! -f "$scenario_file" ] || [ ! -f "$credential_file" ]; then
  echo "pilot runner safety error: scenario or private credential file is missing" >&2
  exit 66
fi
if [ ! -f "$marker_file" ] || [ "$(sed -n '1p' "$marker_file")" != "WF03_DISPOSABLE_RUNTIME" ]; then
  echo "pilot runner safety error: disposable-runtime marker is invalid" >&2
  exit 67
fi
if [ "$(stat -f '%Lp' "$credential_file")" != "600" ]; then
  echo "pilot runner safety error: private credential file mode must be 0600" >&2
  exit 68
fi

raw_dir="$output_root/raw"
logs_dir="$output_root/logs"
evidence_dir="$output_root/evidence"
mkdir -p "$raw_dir" "$logs_dir" "$evidence_dir"

raw_json="$raw_dir/pilot-raw.json"
summary_json="$raw_dir/pilot-summary.json"
stdout_log="$logs_dir/k6.stdout.log"
stderr_log="$logs_dir/k6.stderr.log"
metadata_file="$evidence_dir/runner-metadata.txt"
command_file="$evidence_dir/k6-command.txt"

for output_file in "$raw_json" "$summary_json" "$stdout_log" "$stderr_log" "$metadata_file" "$command_file"; do
  if [ -e "$output_file" ]; then
    echo "pilot runner safety error: output path already exists" >&2
    exit 69
  fi
done

start_time=$(date '+%Y-%m-%d %H:%M:%S %z')
start_epoch=$(date '+%s')

{
  echo "CORRECTED PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT"
  echo "Start timestamp: $start_time"
  printf '%s run --no-usage-report --summary-mode=full --summary-export=%s --out json=%s -e WF03_BASE_URL=http://127.0.0.1:3000 -e WF03_CREDENTIALS_FILE=%s %s > %s 2> %s\n' \
    "$k6_bin" "$summary_json" "$raw_json" "$credential_file" "$scenario_file" "$stdout_log" "$stderr_log"
} > "$command_file"

{
  echo "label=CORRECTED PILOT / RUNTIME VALIDATION — NOT OFFICIAL LOAD RESULT"
  echo "start_time=$start_time"
  echo "start_epoch=$start_epoch"
  echo "hard_cap_seconds=$hard_cap_seconds"
  echo "k6_binary=$k6_bin"
  echo "scenario_file=$scenario_file"
  echo "raw_output=native granular k6 JSON"
  echo "csv_output=disabled"
  echo "web_dashboard=disabled"
} > "$metadata_file"

"$k6_bin" run \
  --no-usage-report \
  --summary-mode=full \
  --summary-export="$summary_json" \
  --out "json=$raw_json" \
  -e WF03_BASE_URL=http://127.0.0.1:3000 \
  -e "WF03_CREDENTIALS_FILE=$credential_file" \
  "$scenario_file" > "$stdout_log" 2> "$stderr_log" &
k6_pid=$!
echo "k6_pid=$k6_pid" >> "$metadata_file"

interrupted=0
stop_owned_k6() {
  if [ "$k6_pid" -gt 1 ] && kill -0 "$k6_pid" 2>/dev/null; then
    kill -TERM "$k6_pid" 2>/dev/null || true
  fi
}
trap 'interrupted=1; stop_owned_k6' INT TERM HUP

watchdog_fired=no
while kill -0 "$k6_pid" 2>/dev/null; do
  current_epoch=$(date '+%s')
  if [ $((current_epoch - start_epoch)) -ge "$hard_cap_seconds" ]; then
    watchdog_fired=yes
    echo "watchdog_fired_time=$(date '+%Y-%m-%d %H:%M:%S %z')" >> "$metadata_file"
    stop_owned_k6
    grace_start=$current_epoch
    while kill -0 "$k6_pid" 2>/dev/null; do
      current_epoch=$(date '+%s')
      if [ $((current_epoch - grace_start)) -ge 5 ]; then
        kill -KILL "$k6_pid" 2>/dev/null || true
        echo "watchdog_escalated_to_kill=yes" >> "$metadata_file"
        break
      fi
      sleep 1
    done
    break
  fi
  sleep 1
done

wait "$k6_pid"
k6_exit_code=$?
process_exit_time=$(date '+%Y-%m-%d %H:%M:%S %z')
process_exit_epoch=$(date '+%s')

# wait(2) completes only after k6 has closed its redirected output descriptors.
artifact_flush_time=$(date '+%Y-%m-%d %H:%M:%S %z')
artifact_flush_epoch=$(date '+%s')

{
  echo "process_exit_time=$process_exit_time"
  echo "process_exit_epoch=$process_exit_epoch"
  echo "artifact_flush_completion_time=$artifact_flush_time"
  echo "artifact_flush_completion_epoch=$artifact_flush_epoch"
  echo "wall_clock_seconds=$((artifact_flush_epoch - start_epoch))"
  echo "k6_exit_code=$k6_exit_code"
  echo "watchdog_fired=$watchdog_fired"
  echo "runner_interrupted=$interrupted"
  for output_file in "$raw_json" "$summary_json" "$stdout_log" "$stderr_log"; do
    if [ -f "$output_file" ]; then
      echo "artifact_bytes=$(stat -f '%z' "$output_file") artifact=$output_file"
    else
      echo "artifact_missing=$output_file"
    fi
  done
} >> "$metadata_file"

exit "$k6_exit_code"
