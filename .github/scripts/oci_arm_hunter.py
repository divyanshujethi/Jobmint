#!/usr/bin/env python3
"""
JobMint OCI Ampere A1 Hunter
Runs periodically via GitHub Actions to provision:
  - Shape: VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)
  - Region: ap-mumbai-1
  - Boot Volume: 200 GB SSD
  - Rate-limit friendly: Gentle single-shot request per execution
"""

import os
import sys
import json
import subprocess

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def main():
    print("JobMint OCI Ampere A1 Hunter Initiated...")

    compartment_id = os.environ.get("OCI_COMPARTMENT_OCID")
    subnet_id = os.environ.get("OCI_SUBNET_OCID")
    image_id = os.environ.get("OCI_IMAGE_OCID")
    availability_domain = os.environ.get("OCI_AVAILABILITY_DOMAIN")
    ssh_public_key = os.environ.get("OCI_SSH_PUBLIC_KEY")

    if not all([compartment_id, subnet_id, image_id, availability_domain, ssh_public_key]):
        print("Missing required OCI environment variables! Please check GitHub Secrets.")
        sys.exit(1)

    print("Checking existing instances in compartment...")
    list_cmd = f"oci compute instance list --compartment-id '{compartment_id}' --lifecycle-state RUNNING"
    code, out, err = run_cmd(list_cmd)
    
    if code == 0 and out:
        try:
            data = json.loads(out)
            for inst in data.get("data", []):
                if inst.get("shape") == "VM.Standard.A1.Flex":
                    print(f"SUCCESS! An Ampere A1 instance is ALREADY RUNNING: {inst.get('display-name')} ({inst.get('id')})")
                    sys.exit(0)
        except Exception as e:
            print(f"Could not parse existing instances: {e}")

    ssh_key_path = "/tmp/oci_authorized_keys"
    with open(ssh_key_path, "w") as f:
        f.write(ssh_public_key.strip() + "\n")

    shape_config = json.dumps({"ocpus": 4, "memoryInGBs": 24})

    print(f"Attempting to launch VM.Standard.A1.Flex in {availability_domain}...")
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
        print("SUCCESS: 4 OCPU / 24 GB RAM Ampere A1 instance successfully created!")
        print(out)
        sys.exit(0)
    else:
        if "Out of host capacity" in err or "Capacity" in err or "500" in err:
            print(f"Capacity temporarily full in {availability_domain}. Polite exit; will retry next schedule.")
            sys.exit(0)
        elif "TooManyRequests" in err or "429" in err:
            print("Rate limit notice received from OCI. Backing off safely.")
            sys.exit(0)
        else:
            print(f"OCI returned message: {err}")
            sys.exit(0)

if __name__ == "__main__":
    main()
