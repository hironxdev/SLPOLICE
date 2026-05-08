import time
import requests
import json
import random

BACKEND_URL = "http://localhost:5000/api/emails/metadata"

def analyze_email(target_email):
    print(f"[*] Analyzing target email: {target_email} ...")
    time.sleep(1)
    print("[*] Retrieving headers via mock IMAP node...")
    time.sleep(2)
    
    # Simulate extracting IPs from "Received:" headers
    extracted_ips = [
        f"{random.randint(1,223)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}",
        f"{random.randint(1,223)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"
    ]
    
    metadata = {
        "subject": "RE: Operation details",
        "sender": "anonymous@proton.me",
        "userAgent": "Thunderbird/115.3.1 (Windows NT 10.0; Win64; x64)",
    }
    
    return extracted_ips, metadata

def push_to_tracker(email, ips, meta):
    payload = {
        "targetEmail": email,
        "extractedIPs": ips,
        "metadata": meta
    }
    try:
        res = requests.post(BACKEND_URL, json=payload)
        print(f"[+] Metadata ingested by CSEU trace server: {res.status_code}")
    except Exception as e:
        print(f"[-] Node connection failed: {e}")

if __name__ == "__main__":
    target = "suspect1@example.com"
    print("=========================================")
    print("  CSEU EMAIL METADATA ANALYZER v1.0      ")
    print("=========================================")
    ips, meta = analyze_email(target)
    
    print(f"[*] Found IPs: {ips}")
    print("[*] Pushing to CSEU database for Geo-Resolution...")
    push_to_tracker(target, ips, meta)
