@echo off
title JobMint OCI Ampere A1 Hunter
echo Starting JobMint OCI Ampere A1 Hunter in background...
cd /d "D:\jobapp"
".venv\Scripts\python.exe" local_arm_hunter.py
pause
