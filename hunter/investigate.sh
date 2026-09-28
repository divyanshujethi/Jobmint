#!/bin/bash
echo "=== Top 10 CPU Processes ==="
ps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu | head -n 11

echo -e "\n=== Docker Containers ==="
docker ps -a

echo -e "\n=== Listening Ports ==="
ss -tulpn

echo -e "\n=== Crontabs ==="
crontab -l 2>/dev/null
sudo crontab -l 2>/dev/null
ls -la /etc/cron*

echo -e "\n=== Check /tmp and /var/tmp ==="
ls -la /tmp
ls -la /var/tmp
