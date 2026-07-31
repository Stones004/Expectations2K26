# Expectations 2K26 — Odyssey

A Vite + React multi-page event platform served via a Python backend.

## Getting Started

Follow these steps from scratch to set up and run the project locally.

### 1. Get the Source Code
Clone the repository and navigate into the project directory:
```bash
git clone <repository-url>
cd Expectations2K26
```
*(If you already have the project cloned, simply navigate into the folder and run `git pull` to fetch the latest changes).*

### 2. Build the Frontend
Install the Node dependencies and generate the static production build:
```bash
npm install
npm run build
```

### 3. Set up the Python Virtual Environment
Create a virtual environment (`venv`) to isolate the Python dependencies:

```bash
# Create the virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate

# Activate the virtual environment (macOS/Linux)
source venv/bin/activate
```

### 4. Install Backend Dependencies
With your virtual environment active, install the required Python packages:

```bash
pip install -r requirements.txt
```

### 5. Run the Server
Finally, start the Python server:

```bash
python server.py
```

The application will now be running and accessible at `http://localhost:8000`.
