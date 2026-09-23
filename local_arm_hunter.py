#!/usr/bin/env python3
"""
JobMint Local OCI Ampere A1 Hunter
Runs safely on your local computer:
  - 0% risk of GitHub abuse detection flags
  - Generates and saves fresh SSH key to D:\\jobapp\\jobmint-arm-ssh.key
  - Polite 3-5 minute intervals with countdown
  - Auto-shuts down immediately upon securing 4 OCPU, 24 GB RAM & 200 GB SSD
"""

import os
import sys
import time
import random
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import oci

PROJECT_DIR = r"D:\jobapp"
KEY_FILE = os.path.join(PROJECT_DIR, "divyanshujethi@gmail.com-2026-09-23T04_14_11.792Z.pem")
SSH_PRIV_KEY = os.path.join(PROJECT_DIR, "jobmint-arm-ssh.key")
SSH_PUB_KEY = os.path.join(PROJECT_DIR, "jobmint-arm-ssh.key.pub")
RESULT_FILE = os.path.join(PROJECT_DIR, "ARM_INSTANCE_READY.txt")

CONFIG = {
    "user": "ocid1.user.oc1..aaaaaaaac2yn7mwsmu5l7z2wgokjrckw2aq63s7myo7zwnaeucixrqoi2w7q",
    "fingerprint": "4d:93:bb:ee:ca:ca:37:b7:7a:46:62:9e:d9:10:e9:6f",
    "key_file": KEY_FILE,
    "tenancy": "ocid1.tenancy.oc1..aaaaaaaay46a6d7geqcyxfnl5ladwp7n7nubxtgu2h4z7qjd3idbgs5lfj4a",
    "region": "ap-mumbai-1"
}

def ensure_ssh_key():
    if not os.path.exists(SSH_PRIV_KEY) or not os.path.exists(SSH_PUB_KEY):
        print("[KEY] Generating a brand new 4096-bit RSA SSH key pair for your ARM VM...")
        cmd = f'ssh-keygen -t rsa -b 4096 -f "{SSH_PRIV_KEY}" -N ""'
        subprocess.run(cmd, shell=True, check=True)
        # Lock down Windows file permissions so OpenSSH is satisfied
        subprocess.run(f'icacls "{SSH_PRIV_KEY}" /inheritance:r /grant:r "%USERNAME%:(R)"', shell=True)
        print(f"[KEY] Created SSH Private Key: {SSH_PRIV_KEY}")
        print(f"[KEY] Created SSH Public Key:  {SSH_PUB_KEY}")
    else:
        print(f"[KEY] Using existing SSH Key: {SSH_PRIV_KEY}")
    with open(SSH_PUB_KEY, "r") as f:
        return f.read().strip()

def main():
    print("=" * 80)
    print("JobMint Local OCI Ampere A1 Hunter")
    print("   • Shape:       VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)")
    print("   • Storage:     200 GB SSD Always Free Volume")
    print("   • Region:      ap-mumbai-1 (Mumbai)")
    print("   • Mode:        Local Background Safe Poller (No GitHub Action risk)")
    print("=" * 80)

    # 1. Initialize OCI Clients
    oci.config.validate_config(CONFIG)
    compute_client = oci.core.ComputeClient(CONFIG)
    identity_client = oci.identity.IdentityClient(CONFIG)
    network_client = oci.core.VirtualNetworkClient(CONFIG)

    compartment_id = CONFIG["tenancy"]
    ssh_public_key = ensure_ssh_key()

    # 2. Check existing instances
    print("\n[OCI] Checking for existing Ampere A1 instances in compartment...")
    instances = compute_client.list_instances(compartment_id=compartment_id).data
    for inst in instances:
        if inst.shape == "VM.Standard.A1.Flex" and inst.lifecycle_state in ["RUNNING", "PROVISIONING", "STARTING"]:
            print(f"[SUCCESS] Ampere A1 instance already exists: {inst.display_name} ({inst.id})")
            print(f"   Status: {inst.lifecycle_state}")
            sys.exit(0)

    # 3. Resolve Availability Domain
    print("[OCI] Resolving Availability Domain in Mumbai...")
    ads = identity_client.list_availability_domains(compartment_id=compartment_id).data
    if not ads:
        print("[ERROR] No Availability Domains found!")
        sys.exit(1)
    availability_domain = ads[0].name
    print(f"[OK] Target Availability Domain: {availability_domain}")

    # 4. Resolve Public Subnet
    print("[OCI] Resolving Public Subnet in VCN...")
    subnets = network_client.list_subnets(compartment_id=compartment_id).data
    target_subnet_id = None
    for s in subnets:
        if not s.prohibit_public_ip_on_vnic:
            target_subnet_id = s.id
            print(f"[OK] Found Public Subnet: {s.display_name} ({s.id})")
            break
    if not target_subnet_id and subnets:
        target_subnet_id = subnets[0].id

    if not target_subnet_id:
        print("[ERROR] No Subnet found! Please ensure your VCN has a public subnet.")
        sys.exit(1)

    # 5. Resolve ARM64 Image
    print("[OCI] Resolving latest Oracle Linux 9 / Ubuntu ARM64 image...")
    images = compute_client.list_images(
        compartment_id=compartment_id,
        shape="VM.Standard.A1.Flex",
        sort_by="TIMECREATED",
        sort_order="DESC"
    ).data
    target_image_id = None
    for img in images:
        name = img.display_name.lower()
        if ("oracle-linux-9" in name or "ubuntu-22.04" in name or "oracle linux 9" in name) and "aarch64" in name:
            target_image_id = img.id
            print(f"[OK] Found ARM64 Image: {img.display_name} ({img.id})")
            break
    if not target_image_id and images:
        target_image_id = images[0].id

    # 6. Hunting Loop
    attempt = 1
    consecutive_server_errors = 0
    recent_requests = []  # Timestamps for rolling 60-minute window (Target: 6-10 req/hour)

    while True:
        # Enforce strict 1-hour rolling request cap (Never exceed 10 requests in any 60-min window)
        current_time = time.time()
        recent_requests = [t for t in recent_requests if current_time - t < 3600]

        if len(recent_requests) >= 10:
            oldest_request = recent_requests[0]
            budget_wait = max(45.0, 3600.0 - (current_time - oldest_request) + random.uniform(30.0, 90.0))
            b_mins = int(budget_wait // 60)
            b_secs = int(budget_wait % 60)
            print(f"\n[HUMAN PACE GUARD] 10 requests reached in last 60 minutes.")
            print(f"Pausing {b_mins}m {b_secs}s to maintain an organic human rhythm of 6-10 requests/hour...")
            remaining = budget_wait
            while remaining > 0:
                step = min(10.0, remaining)
                r_min = int(remaining // 60)
                r_sec = int(remaining % 60)
                print(f"   Pace reset in {r_min:02d}m {r_sec:02d}s (Press Ctrl+C to stop)...", end="\r", flush=True)
                time.sleep(step)
                remaining -= step
            recent_requests = [t for t in recent_requests if time.time() - t < 3600]

        reqs_in_last_hour = len(recent_requests) + 1
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f"\n[{timestamp}] Attempt #{attempt} | Human Pace: {reqs_in_last_hour}/10 reqs/hr | Target: 4 OCPU, 24 GB RAM, 200 GB SSD")
        recent_requests.append(time.time())

        launch_details = oci.core.models.LaunchInstanceDetails(
            compartment_id=compartment_id,
            availability_domain=availability_domain,
            shape="VM.Standard.A1.Flex",
            shape_config=oci.core.models.LaunchInstanceShapeConfigDetails(
                ocpus=4.0,
                memory_in_gbs=24.0
            ),
            source_details=oci.core.models.InstanceSourceViaImageDetails(
                source_type="image",
                image_id=target_image_id,
                boot_volume_size_in_gbs=200
            ),
            create_vnic_details=oci.core.models.CreateVnicDetails(
                subnet_id=target_subnet_id,
                assign_public_ip=True
            ),
            display_name="jobmint-core-arm",
            metadata={
                "ssh_authorized_keys": ssh_public_key
            }
        )

        circuit_breaker = False
        server_error_escalation = False

        try:
            response = compute_client.launch_instance(launch_instance_details=launch_details)
            instance = response.data
            consecutive_server_errors = 0

            print("\n" + "*" * 80)
            print("🎉🎉🎉 BINGO! YOUR 4 OCPU / 24 GB RAM AMPERE A1 INSTANCE IS SECURED! 🎉🎉🎉")
            print("*" * 80)
            print(f"   Instance Name:   {instance.display_name}")
            print(f"   Instance ID:     {instance.id}")
            print(f"   Shape:           VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)")
            print(f"   Boot Volume:     200 GB SSD Always Free")
            print(f"   Private SSH Key: {SSH_PRIV_KEY}")
            print(f"   Public SSH Key:  {SSH_PUB_KEY}")
            print("*" * 80)
            print("📋 EXACT SSH COMMAND TO CONNECT (Once status is RUNNING):")
            print(f'   ssh -i "{SSH_PRIV_KEY}" opc@<PUBLIC_IP>')
            print("*" * 80)

            with open(RESULT_FILE, "w") as f:
                f.write(f"JOBMINT AMPERE A1 INSTANCE DETAILS\n")
                f.write(f"Instance ID: {instance.id}\n")
                f.write(f"Shape: 4 OCPU, 24 GB RAM, 200 GB SSD\n")
                f.write(f"Private Key Path: {SSH_PRIV_KEY}\n")
                f.write(f"To connect once RUNNING:\n")
                f.write(f'ssh -i "{SSH_PRIV_KEY}" opc@<PUBLIC_IP>\n')

            print(f"\n📁 Connection details saved to: {RESULT_FILE}")
            print("\a")  # Audible sound notification
            print("\n🛑 HUNT COMPLETED SUCCESSFULLY: Process has cut further attempts.")
            print("   This window will REMAIN OPEN so you can copy your details.")
            print("=" * 80)
            try:
                input("\n👉 Press [Enter] whenever you are done to close this window...")
            except Exception:
                pass
            sys.exit(0)

        except oci.exceptions.ServiceError as e:
            # Case A: Standard Capacity Limit (Normal business logic)
            if "Out of host capacity" in str(e.message) or "Capacity" in str(e.message):
                consecutive_server_errors = 0
                print(f"[CAPACITY] Slots temporarily full in {availability_domain}.")

            # Case B: Rate Limit (HTTP 429) -> Immediate Circuit Breaker
            elif e.status == 429 or "TooManyRequests" in str(e.message):
                circuit_breaker = True
                consecutive_server_errors = 0
                print("\n" + "!" * 80)
                print("[CIRCUIT BREAKER TRIGGERED] Oracle HTTP 429 Too Many Requests detected!")
                print("Enforcing strict 15-20 minute safety cooldown to protect account from rate limits...")
                print("!" * 80)

            # Case C: True Server Errors (500 InternalServerError, 502, 503 Service Unavailable)
            elif e.status in [500, 502, 503, 504]:
                consecutive_server_errors += 1
                print(f"[SERVER ERROR] Oracle returned HTTP {e.status} ({consecutive_server_errors} in a row): {e.message}")
                if consecutive_server_errors >= 5:
                    server_error_escalation = True
                    print("\n" + "!" * 80)
                    print(f"[BACKOFF ESCALATION] {consecutive_server_errors} consecutive server errors detected!")
                    print("Oracle control plane is under heavy internal load. Doubling sleep timer to protect account...")
                    print("!" * 80)

            # Case D: Other OCI Message
            else:
                consecutive_server_errors = 0
                print(f"[OCI] [{e.status}] {e.message}")

        # Compute next sleep interval using Human Behavior States
        if circuit_breaker:
            # 15 to 20 minute complete circuit breaker cooldown
            wait_seconds = random.uniform(900.0, 1200.0)
            mins = int(wait_seconds // 60)
            secs = int(wait_seconds % 60)
            print(f"[COOLING OFF] Sleeping for {mins}m {secs}s before resetting circuit breaker...")

        elif server_error_escalation:
            # Consecutive failure backoff multiplier (2x base jitter)
            multiplier = min(4, 2 ** (consecutive_server_errors - 4))
            base_jitter = random.uniform(180.0, 360.0)
            wait_seconds = base_jitter * multiplier
            mins = int(wait_seconds // 60)
            secs = int(wait_seconds % 60)
            print(f"[SERVER BACKOFF] Scaled sleep to {mins}m {secs}s ({multiplier}x multiplier) to stabilize...")

        else:
            # Human Behavioral State Model:
            # 1. Quick Followup (35%): 2m to 3.5m (User actively checking back)
            # 2. Focused Working Lull (50%): 4m to 7m (User working on another tab/task)
            # 3. Step-Away Break (15%): 9m to 14m (User stepped away from desk)
            behavior_roll = random.random()
            if behavior_roll < 0.35:
                behavior_label = "Active Check"
                wait_seconds = random.uniform(120.0, 210.0)
            elif behavior_roll < 0.85:
                behavior_label = "Working Lull"
                wait_seconds = random.uniform(240.0, 420.0)
            else:
                behavior_label = "Desk Break"
                wait_seconds = random.uniform(540.0, 840.0)

            mins = int(wait_seconds // 60)
            secs = int(wait_seconds % 60)
            print(f"[HUMAN PACE: {behavior_label}] Waiting {mins}m {secs:02d}s ({wait_seconds:.1f}s) | Target: 6-10 reqs/hr...")

        # Countdown with human-friendly display
        remaining = wait_seconds
        while remaining > 0:
            step = min(10.0, remaining)
            r_min = int(remaining // 60)
            r_sec = int(remaining % 60)
            print(f"   Next check in {r_min:02d}m {r_sec:02d}s (Press Ctrl+C to stop)...", end="\r", flush=True)
            time.sleep(step)
            remaining -= step

        attempt += 1

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nHunter stopped by user. Run anytime to resume!")
        sys.exit(0)
