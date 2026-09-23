#!/usr/bin/env python3
"""
JobMint OCI Ampere A1 Hunter
Runs periodically via GitHub Actions to provision:
  - Shape: VM.Standard.A1.Flex (4 OCPU, 24 GB RAM)
  - Region: ap-mumbai-1 (or configured region)
  - Boot Volume: 200 GB SSD
  - Auto-discovers AD, Subnet, and ARM64 Image
  - Auto-generates brand new SSH Key pair if none provided
  - Polite single-shot request per execution
"""

import os
import sys
import json
import subprocess

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def main():
    print("🐊 JobMint OCI Ampere A1 Hunter Initiated...")

    compartment_id = os.environ.get("OCI_COMPARTMENT_OCID") or os.environ.get("OCI_TENANCY_OCID")
    ssh_public_key = os.environ.get("OCI_SSH_PUBLIC_KEY")
    ad_override = os.environ.get("OCI_AVAILABILITY_DOMAIN")
    subnet_override = os.environ.get("OCI_SUBNET_OCID")
    image_override = os.environ.get("OCI_IMAGE_OCID")

    if not compartment_id:
        print("❌ Missing OCI_COMPARTMENT_OCID or OCI_TENANCY_OCID! Please check GitHub Secrets.")
        sys.exit(1)

    # 1. Check if an Ampere A1 instance is already created or provisioning
    print("🔍 Checking existing instances in compartment...")
    code, out, err = run_cmd(f"oci compute instance list --compartment-id '{compartment_id}'")
    
    if code == 0 and out:
        try:
            data = json.loads(out)
            for inst in data.get("data", []):
                state = inst.get("lifecycle-state", "").upper()
                if inst.get("shape") == "VM.Standard.A1.Flex" and state in ["RUNNING", "PROVISIONING", "STARTING"]:
                    print(f"🎉 Ampere A1 instance already exists in state '{state}': {inst.get('display-name')} ({inst.get('id')})")
                    github_output = os.environ.get("GITHUB_OUTPUT")
                    if github_output:
                        with open(github_output, "a") as f:
                            f.write("instance_acquired=true\n")
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

    # 5. Handle SSH Key (Auto-generate if none provided)
    ssh_key_path = "/tmp/oci_authorized_keys"
    generated_private_key = None
    if ssh_public_key and ssh_public_key.strip():
        with open(ssh_key_path, "w") as f:
            f.write(ssh_public_key.strip() + "\n")
    else:
        print("🔑 No SSH key provided; generating a brand new 4096-bit RSA key pair...")
        priv_path = "/tmp/oci_new_rsa"
        pub_path = "/tmp/oci_new_rsa.pub"
        run_cmd(f"ssh-keygen -t rsa -b 4096 -f '{priv_path}' -N ''")
        if os.path.exists(pub_path):
            with open(pub_path, "r") as f:
                ssh_public_key = f.read().strip()
            with open(priv_path, "r") as f:
                generated_private_key = f.read().strip()
            with open(ssh_key_path, "w") as f:
                f.write(ssh_public_key + "\n")
            print("✅ Generated new SSH key pair.")
        else:
            print("❌ Failed to generate SSH key pair.")
            sys.exit(1)

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
        print("\n" + "="*80)
        print("🎉🎉🎉 BINGO! 4 OCPU / 24 GB RAM Ampere A1 instance successfully created!")
        print("="*80)
        print(out)
        github_output = os.environ.get("GITHUB_OUTPUT")
        if github_output:
            with open(github_output, "a") as f:
                f.write("instance_acquired=true\n")
        if generated_private_key:
            print("\n" + "#"*80)
            print("🔑 YOUR PRIVATE SSH KEY (SAVE THIS TO A FILE e.g. jobmint_arm.key):")
            print("#"*80)
            print(generated_private_key)
            print("#"*80 + "\n")
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
