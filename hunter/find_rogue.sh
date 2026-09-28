#!/bin/bash
for p in /proc/[0-9]*/cmdline; do
  cmd=$(tr '\0' ' ' < "$p" 2>/dev/null)
  if echo "$cmd" | grep -qE "scanner|xmrig|masscan|sysn|d20|worker|pool|stratum|softirq"; then
    echo "FOUND: $cmd (PATH: $p)"
  fi
done
