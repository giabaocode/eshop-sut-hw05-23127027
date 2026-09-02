#!/bin/sh
set -eu

root=${1:-performance/results}
failed=0

for scenario in load stress spike; do
  scenario_root="$root/$scenario"
  if [ ! -d "$scenario_root" ]; then
    echo "FAIL $scenario: missing scenario directory" >&2
    failed=1
    continue
  fi
  run_dir=$(find "$scenario_root" -mindepth 1 -maxdepth 1 -type d | sort | tail -1)
  if [ -z "$run_dir" ]; then
    echo "FAIL $scenario: missing run directory" >&2
    failed=1
    continue
  fi
  for part in raw report logs evidence; do
    if [ ! -d "$run_dir/$part" ]; then
      echo "FAIL $scenario: missing $part in $run_dir" >&2
      failed=1
    fi
  done
  if ! find "$run_dir/raw" -type f -name '*-raw.json' -size +0c | grep -q .; then
    echo "FAIL $scenario: missing nonempty native raw JSON" >&2
    failed=1
  fi
  echo "CHECKED $scenario: $run_dir"
done

exit "$failed"
