# Bharat Heritage — Flask Website

## Run on Windows / VS Code

1. Open this folder in VS Code.
2. Create and activate a virtual environment:
   python -m venv venv
   venv\Scripts\activate
3. Install:
   pip install -r requirements.txt
4. Start:
   python app.py
5. Open:
   http://127.0.0.1:5000

## Structure

app.py
templates/index.html
static/css/style.css
static/js/script.js
requirements.txt

## Current Flask APIs

GET  /api/traditions
GET  /api/search?q=Yellamma
GET  /api/traditions/<id>
GET  /api/locations
POST /api/ask
POST /api/experiences
GET  /api/recommendations

The cultural data is currently demo data inside app.py.
Next, replace TRADITIONS with PostgreSQL/PostGIS queries and connect /api/ask to the AI/RAG service.
