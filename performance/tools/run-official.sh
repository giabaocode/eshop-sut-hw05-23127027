#!/bin/sh
# PREPARED / NOT EXECUTED — exact-PID official scenario runner.
# Requires a human-created attributable plan filename and approved fresh runtime.

set -u

if [ "$#" -ne 5 ]; then
  echo "usage: run-official.sh load|stress|spike RUNTIME_ROOT PRIVATE_CREDENTIAL_FILE OFFICIAL_PLAN_FILE OUTPUT_ROOT" >&2
  exit 64
fi

scenario=$1
runtime_root=$2
credential_file=$3
scenario_file=$4
output_root=$5
k6_bin=/opt/homebrew/bin/k6
marker_file="$runtime_root/.wf03-disposable-runtime"

case "$scenario" in
  load)
    scenario_label=Load
    hard_cap_seconds=480
    ;;
  stress)
    scenario_label=Stress
    hard_cap_seconds=840
    ;;
  spike)
    scenario_label=Spike
    hard_cap_seconds=420
    ;;
  *)
    echo "official runner safety error: scenario must be load, stress, or spike" >&2
    exit 65
    ;;
esac

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
original_root=$(CDPATH= cd -- "$script_dir/../.." && pwd)
plan_basename=$(basename -- "$scenario_file")

case "$plan_basename" in
  "23127027_${scenario_label}_"[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].js) ;;
  *)
    echo "official runner safety error: human-created plan filename is invalid" >&2
    exit 66
    ;;
esac

case "$scenario_file" in
  "$runtime_root"/*) ;;
  *)
    echo "official runner safety error: official plan must be inside disposable runtime" >&2
    exit 67
    ;;
esac

case "$credential_file" in
  "$original_root"/*|"$runtime_root"/*)
    echo "official runner safety error: credential file must remain outside both worktrees" >&2
    exit 68
    ;;
esac

if [ ! -x "$k6_bin" ]; then
  echo "official runner safety error: pinned k6 binary is unavailable" >&2
  exit 69
fi
if [ ! -f "$scenario_file" ] || [ ! -f "$credential_file" ]; then
  echo "official runner safety error: plan or private credential file is missing" >&2
  exit 70
fi
if [ ! -f "$marker_file" ] || [ "$(sed -n '1p' "$marker_file")" != "WF03_DISPOSABLE_RUNTIME" ]; then
  echo "official runner safety error: disposable-runtime marker is invalid" >&2
  exit 71
fi
if [ "$(stat -f '%Lp' "$credential_file")" != "600" ]; then
  echo "official runner safety error: private credential file mode must be 0600" >&2
  exit 72
fi
if [ "$(sed -n '1p' "$credential_file")" != "account_key,email,password,expected_role" ]; then
  echo "official runner safety error: private credential schema is invalid" >&2
  exit 73
fi
credential_rows=$(awk 'END { print NR - 1 }' "$credential_file")
if [ "$credential_rows" -ne 20 ] || grep -q '<generated-at-provisioning>' "$credential_file"; then
  echo "official runner safety error: exactly 20 non-placeholder credential rows are required" >&2
  exit 74
fi
if [ -e "$output_root" ]; then
  echo "official runner safety error: output root must be new" >&2
  exit 75
fi
available_kib=$(df -Pk "$original_root" | awk 'NR == 2 { print $4 }')
case "$available_kib" in
  ''|*[!0-9]*)
    echo "official runner safety error: free disk could not be determined" >&2
    exit 76
    ;;
esac
if [ "$available_kib" -lt 2097152 ]; then
  echo "official runner safety error: at least 2 GiB free disk is required" >&2
  exit 77
fi

raw_dir="$output_root/raw"
report_dir="$output_root/report"
logs_dir="$output_root/logs"
evidence_dir="$output_root/evidence"
if ! mkdir -p "$raw_dir" "$report_dir" "$logs_dir" "$evidence_dir"; then
  echo "official runner safety error: output directories could not be created" >&2
  exit 78
fi

raw_json="$raw_dir/${scenario}-raw.json"
summary_json="$raw_dir/${scenario}-summary.json"
timeseries_csv="$raw_dir/${scenario}-timeseries.csv"
dashboard_html="$report_dir/${scenario}-dashboard.html"
stdout_log="$logs_dir/k6.stdout.log"
stderr_log="$logs_dir/k6.stderr.log"
metadata_file="$evidence_dir/runner-metadata.txt"
command_file="$evidence_dir/k6-command.txt"

start_time=$(date '+%Y-%m-%d %H:%M:%S %z')
start_epoch=$(date '+%s')

case "$scenario" in
  load)
    printf '%s run --no-usage-report --summary-mode=full --summary-export=%s --out json=%s -e WF03_BASE_URL=http://127.0.0.1:3000 -e WF03_CREDENTIALS_FILE=%s %s > %s 2> %s\n' \
      "$k6_bin" "$summary_json" "$raw_json" "$credential_file" "$scenario_file" "$stdout_log" "$stderr_log" > "$command_file"
    "$k6_bin" run --no-usage-report --summary-mode=full \
      --summary-export="$summary_json" --out "json=$raw_json" \
      -e WF03_BASE_URL=http://127.0.0.1:3000 \
      -e "WF03_CREDENTIALS_FILE=$credential_file" \
      "$scenario_file" > "$stdout_log" 2> "$stderr_log" &
    ;;
  stress)
    printf '%s run --no-usage-report --summary-mode=full --summary-export=%s --out json=%s --out csv=%s -e WF03_BASE_URL=http://127.0.0.1:3000 -e WF03_CREDENTIALS_FILE=%s %s > %s 2> %s\n' \
      "$k6_bin" "$summary_json" "$raw_json" "$timeseries_csv" "$credential_file" "$scenario_file" "$stdout_log" "$stderr_log" > "$command_file"
    "$k6_bin" run --no-usage-report --summary-mode=full \
      --summary-export="$summary_json" --out "json=$raw_json" \
      --out "csv=$timeseries_csv" \
      -e WF03_BASE_URL=http://127.0.0.1:3000 \
      -e "WF03_CREDENTIALS_FILE=$credential_file" \
      "$scenario_file" > "$stdout_log" 2> "$stderr_log" &
    ;;
  spike)
    printf 'K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_HOST=127.0.0.1 K6_WEB_DASHBOARD_PORT=0 K6_WEB_DASHBOARD_PERIOD=1s K6_WEB_DASHBOARD_EXPORT=%s %s run --no-usage-report --summary-mode=full --summary-export=%s --out json=%s -e WF03_BASE_URL=http://127.0.0.1:3000 -e WF03_CREDENTIALS_FILE=%s %s > %s 2> %s\n' \
      "$dashboard_html" "$k6_bin" "$summary_json" "$raw_json" "$credential_file" "$scenario_file" "$stdout_log" "$stderr_log" > "$command_file"
    K6_WEB_DASHBOARD=true \
    K6_WEB_DASHBOARD_HOST=127.0.0.1 \
    K6_WEB_DASHBOARD_PORT=0 \
    K6_WEB_DASHBOARD_PERIOD=1s \
    K6_WEB_DASHBOARD_EXPORT="$dashboard_html" \
      "$k6_bin" run --no-usage-report --summary-mode=full \
      --summary-export="$summary_json" --out "json=$raw_json" \
      -e WF03_BASE_URL=http://127.0.0.1:3000 \
      -e "WF03_CREDENTIALS_FILE=$credential_file" \
      "$scenario_file" > "$stdout_log" 2> "$stderr_log" &
    ;;
esac

k6_pid=$!
{
  echo "label=OFFICIAL ${scenario_label} — REAL EXECUTION REQUIRED"
  echo "scenario=$scenario"
  echo "start_time=$start_time"
  echo "start_epoch=$start_epoch"
  echo "hard_cap_seconds=$hard_cap_seconds"
  echo "k6_binary=$k6_bin"
  echo "official_plan=$scenario_file"
  echo "k6_pid=$k6_pid"
  echo "canonical_raw=native granular k6 JSON"
} > "$metadata_file"

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
  for output_file in "$raw_json" "$summary_json" "$timeseries_csv" "$dashboard_html" "$stdout_log" "$stderr_log"; do
    if [ -f "$output_file" ]; then
      echo "artifact_bytes=$(stat -f '%z' "$output_file") artifact=$output_file"
    fi
  done
} >> "$metadata_file"

exit "$k6_exit_code"
