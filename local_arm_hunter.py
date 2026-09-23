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
    while True:
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f"\n[{timestamp}] Attempt #{attempt}: Requesting 4 OCPU / 24 GB RAM / 200 GB SSD...")

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

        try:
            response = compute_client.launch_instance(launch_instance_details=launch_details)
            instance = response.data
            print("\n" + "=" * 80)
            print("SUCCESS! YOUR 4 OCPU / 24 GB RAM AMPERE A1 INSTANCE IS CREATED!")
            print("=" * 80)
            print(f"   Instance Name: {instance.display_name}")
            print(f"   Instance ID:   {instance.id}")
            print(f"   Shape:         VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)")
            print(f"   Boot Volume:   200 GB SSD")
            print(f"   Private Key:   {SSH_PRIV_KEY}")

            with open(RESULT_FILE, "w") as f:
                f.write(f"JOBMINT AMPERE A1 INSTANCE DETAILS\n")
                f.write(f"Instance ID: {instance.id}\n")
                f.write(f"Shape: 4 OCPU, 24 GB RAM, 200 GB SSD\n")
                f.write(f"Private Key Path: {SSH_PRIV_KEY}\n")
                f.write(f"To connect once RUNNING:\n")
                f.write(f'ssh -i "{SSH_PRIV_KEY}" opc@<PUBLIC_IP>\n')

            print(f"\nConnection details saved to: {RESULT_FILE}")
            print("\a")
            print("AUTO-SHUTDOWN: Work complete. Hunter is now stopping.")
            sys.exit(0)

        except oci.exceptions.ServiceError as e:
            if "Out of host capacity" in e.message or e.status == 500:
                print(f"Status: Capacity temporarily full in {availability_domain}.")
            elif e.status == 429:
                print("⚠️ Rate limit (429) detected from Oracle. Backing off for 10 minutes safely...")
                time.sleep(600)
                continue
            else:
                print(f"OCI Message: [{e.status}] {e.message}")

        # Human-like random jitter: e.g. 172s, 194s, 231s, 276s, etc.
        # Uses normal distribution centered around ~215 seconds with wide variance
        raw_jitter = int(random.gauss(215, 40))
        wait_seconds = max(160, min(320, raw_jitter))

        # Every 8 attempts, simulate a human stepping away (coffee break: +5 to 8 mins)
        if attempt % 8 == 0:
            break_seconds = random.randint(300, 480)
            wait_seconds += break_seconds
            print(f"\n[HUMAN JITTER] Simulating natural break (+{break_seconds//60} mins) to blend with normal browser traffic...")

        print(f"Waiting {wait_seconds}s (human-randomized jitter) before retry #{attempt+1} (Press Ctrl+C to stop)...")
        for remaining in range(wait_seconds, 0, -10):
            print(f"   Next check in {remaining:3d}s...", end="\r", flush=True)
            time.sleep(min(10, remaining))
        attempt += 1

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nHunter stopped by user. Run anytime to resume!")
        sys.exit(0)
