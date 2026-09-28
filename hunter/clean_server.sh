#!/bin/bash
set -x

# Remove immutable and append-only flags from directories and files
/usr/bin/chattr -R -i -a -u -s /etc/cron.d/rondo /etc/rondo /etc/crontab 2>/dev/null || true

# Remove malicious files
rm -rf /etc/cron.d/rondo /etc/rondo /tmp/.c /opt/jobmint/app/apps/web/.next/.c

# Clean crontab
> /etc/crontab

# Restore clean sudoers for ubuntu
echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/99-ubuntu
chmod 0440 /etc/sudoers.d/99-ubuntu

# Kill any rogue processes
killall -9 rondo xmrig.bin xmrig 2>/dev/null || true

echo "REMEDIATION_COMPLETE"
