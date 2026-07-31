"""Serve the Vite production build with React Router SPA fallback.

Usage:
    npm run build
    python -m venv .venv
    source .venv/bin/activate  # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    python server.py
"""
from pathlib import Path
from flask import Flask, send_from_directory

ROOT = Path(__file__).parent
DIST = ROOT / "dist"

if not DIST.exists():
    raise SystemExit("Build not found. Run `npm install` then `npm run build` first.")

app = Flask(__name__, static_folder=str(DIST), static_url_path="")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_app(path: str):
    """Return built assets when present; otherwise let React Router resolve the route."""
    candidate = DIST / path
    if path and candidate.is_file():
        return send_from_directory(DIST, path)
    return send_from_directory(DIST, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
