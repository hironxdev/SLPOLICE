import time
import requests
import json
import random

BACKEND_URL = "http://localhost:5000/api/forensics/ingest"

def extract_whatsapp_db():
    print("[*] Simulating Kali Linux Python Payload - Bypass active...")
    time.sleep(1)
    print("[*] SQLite database acquired. Decrypting payload...")
    time.sleep(2)
    return {
        "messages_extracted": random.randint(200, 1500),
        "attachments": random.randint(10, 80),
        "last_contact": "+94770000000",
        "keywords_found": ["operation", "rendezvous", "package"]
    }

def send_to_backend(imei, data_type, content):
    payload = {
        "imei": imei,
        "dataType": data_type,
        "dataContent": content,
        "source": "Kali-Python-Simulator"
    }
    try:
        response = requests.post(BACKEND_URL, json=payload)
        print(f"[+] Data ingested successfully by CCID Tracker: {response.status_code}")
    except Exception as e:
        print(f"[-] Failed to connect to backend ingestion server: {e}")

if __name__ == "__main__":
    target_imei = "359881030310000"
    print("==================================================")
    print("   CCID FORENSIC DATA EXTRACTION SIMULATOR v1.0   ")
    print("==================================================")
    print(f"Target Initialization for IMEI: {target_imei}")
    
    extracted_data = extract_whatsapp_db()
    send_to_backend(target_imei, "whatsapp_db", extracted_data)
    print("[*] Payload execution completed. Erasing local traces.")
