import uvicorn
import os
import sys

# Add current directory to path so main can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Court Backend on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
