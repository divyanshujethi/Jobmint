#!/usr/bin/env python3
"""
JobMint OCI Ampere A1 Hunter
Runs periodically via GitHub Actions to provision:
  - Shape: VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)
  - Region: ap-mumbai-1 (or configured region)
  - Boot Volume: 200 GB SSD
  - Auto-discovers AD, Subnet, and ARM64 Image
  - Built-in default SSH public key fallback
  - Polite single-shot request per execution
"""

import os
import sys
import json
import subprocess

DEFAULT_SSH_KEY = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC5UUaemRxuEC0kFi+DYT9nzGvDOh+D6DTG6iJGfJ1E/DeKWTMhQkBRwvbV8iOKxSk2METuKCPFjEPQIqIycxg3A7hVl6do2hY35/08aZUnOLoupoadAGSqWkDL0vMAL36GclM5Eicys9mtq7oBIMcPEB3Xg+7MsulZV/gSxoV+YcV94nr7RHHaQ4kseL3xAVXOqiAUfn1di3K7BpBJsqx5oVcH2DanAfjCTM8TZR2q9UZHGAiL7otche/DxWwjDOqpS6B0c7gwEuVTCZ9kqCC+Zn7vRVskduGiGWGo/uWcwuRqwv3QCnS4GziO2uS+d3z/k/aBCIjBUzxuMMOV727v ssh-key-2026-09-22"

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def main():
    print("🐊 JobMint OCI Ampere A1 Hunter Initiated...")

    compartment_id = os.environ.get("OCI_COMPARTMENT_OCID") or os.environ.get("OCI_TENANCY_OCID")
    ssh_public_key = os.environ.get("OCI_SSH_PUBLIC_KEY") or DEFAULT_SSH_KEY
    ad_override = os.environ.get("OCI_AVAILABILITY_DOMAIN")
    subnet_override = os.environ.get("OCI_SUBNET_OCID")
    image_override = os.environ.get("OCI_IMAGE_OCID")

    if not compartment_id:
        print("❌ Missing OCI_COMPARTMENT_OCID or OCI_TENANCY_OCID! Please check GitHub Secrets.")
        sys.exit(1)

    # 1. Check if an Ampere A1 instance is already running
    print("🔍 Checking existing instances in compartment...")
    list_cmd = f"oci compute instance list --compartment-id '{compartment_id}' --lifecycle-state RUNNING"
    code, out, err = run_cmd(list_cmd)
    
    if code == 0 and out:
        try:
            data = json.loads(out)
            for inst in data.get("data", []):
                if inst.get("shape") == "VM.Standard.A1.Flex":
                    print(f"🎉 SUCCESS! An Ampere A1 instance is ALREADY RUNNING: {inst.get('display-name')} ({inst.get('id')})")
                    sys.exit(0)
        except Exception as e:
            print(f"⚠️ Could not parse existing instances: {e}")

    # 2. Resolve Availability Domain
    availability_domain = ad_override
    if not availability_domain:
        print("🔎 Resolving Availability Domain...")
        code, out, err = run_cmd(f"oci iam availability-domain list --compartment-id '{compartment_id}'")
        if code == 0 and out:
            ads = json.loads(out).get("data", [])
            if ads:
                availability_domain = ads[0]["name"]
                print(f"✅ Found Availability Domain: {availability_domain}")
        if not availability_domain:
            print("❌ Could not auto-discover Availability Domain. Please set OCI_AVAILABILITY_DOMAIN.")
            sys.exit(1)

    # 3. Resolve Subnet
    subnet_id = subnet_override
    if not subnet_id:
        print("🔎 Resolving Subnet...")
        code, out, err = run_cmd(f"oci network subnet list --compartment-id '{compartment_id}'")
        if code == 0 and out:
            subnets = json.loads(out).get("data", [])
            for s in subnets:
                if not s.get("prohibit-public-ip-on-vnic", False):
                    subnet_id = s["id"]
                    print(f"✅ Found Public Subnet: {s.get('display-name')} ({subnet_id})")
                    break
            if not subnet_id and subnets:
                subnet_id = subnets[0]["id"]
        if not subnet_id:
            print("❌ Could not auto-discover Subnet. Please set OCI_SUBNET_OCID.")
            sys.exit(1)

    # 4. Resolve ARM64 Image
    image_id = image_override
    if not image_id:
        print("🔎 Resolving compatible ARM64 Image...")
        code, out, err = run_cmd(
            f"oci compute image list --compartment-id '{compartment_id}' --shape 'VM.Standard.A1.Flex' --sort-by TIMECREATED --sort-order DESC"
        )
        if code == 0 and out:
            images = json.loads(out).get("data", [])
            for img in images:
                name = img.get("display-name", "").lower()
                if ("oracle-linux-9" in name or "ubuntu-22.04" in name or "oracle linux 9" in name) and "aarch64" in name:
                    image_id = img["id"]
                    print(f"✅ Found Image: {img.get('display-name')} ({image_id})")
                    break
            if not image_id and images:
                image_id = images[0]["id"]
                print(f"✅ Using default image: {images[0].get('display-name')}")
        if not image_id:
            print("❌ Could not auto-discover Image. Please set OCI_IMAGE_OCID.")
            sys.exit(1)

    # 5. Write SSH public key to temp file
    ssh_key_path = "/tmp/oci_authorized_keys"
    with open(ssh_key_path, "w") as f:
        f.write(ssh_public_key.strip() + "\n")

    # 6. Shape Config for 4 OCPUs and 24 GB RAM
    shape_config = json.dumps({"ocpus": 4, "memoryInGBs": 24})

    print(f"🚀 Attempting to launch VM.Standard.A1.Flex (4 OCPU, 24 GB RAM, 200 GB SSD) in {availability_domain}...")
    launch_cmd = (
        f"oci compute instance launch "
        f"--compartment-id '{compartment_id}' "
        f"--availability-domain '{availability_domain}' "
        f"--shape 'VM.Standard.A1.Flex' "
        f"--shape-config '{shape_config}' "
        f"--image-id '{image_id}' "
        f"--subnet-id '{subnet_id}' "
        f"--display-name 'jobmint-core-arm' "
        f"--assign-public-ip true "
        f"--ssh-authorized-keys-file '{ssh_key_path}' "
        f"--boot-volume-size-in-gbs 200"
    )

    code, out, err = run_cmd(launch_cmd)

    if code == 0:
        print("🎉🎉🎉 BINGO! 4 OCPU / 24 GB RAM Ampere A1 instance successfully created!")
        print(out)
        sys.exit(0)
    else:
        if "Out of host capacity" in err or "Capacity" in err or "500" in err:
            print(f"⏳ Capacity temporarily full in {availability_domain}. Polite exit; will retry in 10 minutes.")
            sys.exit(0)
        elif "TooManyRequests" in err or "429" in err:
            print("⚠️ Rate limit notice received from OCI. Backing off safely.")
            sys.exit(0)
        else:
            print(f"⚠️ OCI response: {err}")
            sys.exit(0)

if __name__ == "__main__":
    main()
