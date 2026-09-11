# Daymark Todo

A small Flask todo app for Vercel. Tasks are stored in the browser with `localStorage`, so this proof of concept needs no database or account system.

## Run locally

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app app run --debug
```

Open `http://127.0.0.1:5000`.

## Deploy to Vercel

Install the Vercel CLI, log in, and run:

```powershell
npm install -g vercel
vercel
```

The included `vercel.json` routes requests to the Flask entrypoint in `app.py`.