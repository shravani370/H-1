from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

TRADITIONS = [
    {
        "id": 1, "name": "Yellamma", "category": "festival",
        "region": "Maharashtra · Karnataka",
        "description": "A living tradition connected with worship, community rituals, temples and local cultural practices.",
        "history": "Yellamma traditions have deep roots in community worship and regional cultural practices.",
        "lat": 16.85, "lng": 74.58
    },
    {
        "id": 2, "name": "Gondhal", "category": "music",
        "region": "Maharashtra",
        "description": "A vibrant ritual performance tradition combining music, storytelling, devotion and community participation.",
        "history": "Gondhal is a traditional performance practice with strong devotional and storytelling elements.",
        "lat": 18.52, "lng": 73.86
    },
    {
        "id": 3, "name": "Lavani", "category": "dance",
        "region": "Maharashtra",
        "description": "A powerful performance tradition known for expressive dance, rhythm, poetry and distinctive musical forms.",
        "history": "Lavani developed as a major Marathi performance tradition combining poetry, rhythm and expressive movement.",
        "lat": 18.52, "lng": 73.85
    },
    {
        "id": 4, "name": "Jagar", "category": "story",
        "region": "Maharashtra · Karnataka",
        "description": "A community-rooted night tradition involving ritual, music, oral storytelling and local belief systems.",
        "history": "Jagar traditions are transmitted through community practice, oral storytelling, music and ritual.",
        "lat": 16.70, "lng": 74.25
    },
    {
        "id": 5, "name": "Bharud", "category": "music",
        "region": "Maharashtra",
        "description": "A folk performance form blending song, satire, spiritual ideas and social commentary.",
        "history": "Bharud is a Marathi folk-performance form known for accessible storytelling and social themes.",
        "lat": 19.00, "lng": 73.00
    },
    {
        "id": 6, "name": "Warli Art", "category": "craft",
        "region": "Maharashtra",
        "description": "A distinctive visual tradition using simple forms to express everyday life, nature, rituals and community.",
        "history": "Warli visual traditions use geometric forms and scenes of community life, nature and ritual.",
        "lat": 20.05, "lng": 73.00
    }
]


@app.route("/")
def home():
    return render_template("index.html")


@app.get("/api/traditions")
def get_traditions():
    category = request.args.get("category", "all").lower()
    if category == "all":
        data = TRADITIONS
    else:
        data = [t for t in TRADITIONS if t["category"] == category]
    return jsonify({"success": True, "data": data})


@app.get("/api/search")
def search():
    q = request.args.get("q", "").strip().lower()
    if not q:
        return jsonify({"success": True, "data": []})

    results = [
        t for t in TRADITIONS
        if q in t["name"].lower()
        or q in t["region"].lower()
        or q in t["description"].lower()
    ]
    return jsonify({"success": True, "query": q, "data": results})


@app.get("/api/traditions/<int:tradition_id>")
def get_tradition(tradition_id):
    tradition = next((t for t in TRADITIONS if t["id"] == tradition_id), None)
    if not tradition:
        return jsonify({"success": False, "message": "Tradition not found"}), 404
    return jsonify({"success": True, "data": tradition})


@app.get("/api/locations")
def locations():
    return jsonify({
        "success": True,
        "data": [
            {
                "name": t["name"],
                "region": t["region"],
                "lat": t["lat"],
                "lng": t["lng"],
                "tradition_id": t["id"]
            }
            for t in TRADITIONS
        ]
    })


@app.post("/api/ask")
def ask_ai():
    body = request.get_json(silent=True) or {}
    question = body.get("question", "").strip()
    q = question.lower()

    if not question:
        return jsonify({"success": False, "message": "Question is required"}), 400

    if "gondhal" in q:
        answer = (
            "Gondhal is a traditional performance practice associated with "
            "devotion, storytelling, music and community rituals, particularly "
            "in Maharashtra. In the full version, this answer can be generated "
            "from the verified cultural knowledge database."
        )
    elif "yellamma" in q:
        answer = (
            "Yellamma is a significant tradition associated with communities "
            "and sacred places in parts of Maharashtra and Karnataka. The platform "
            "can connect its history, places, local stories and related traditions."
        )
    elif "jagar" in q:
        answer = (
            "Jagar is a community-rooted ritual and performance tradition involving "
            "music, oral storytelling and local cultural practices."
        )
    else:
        answer = (
            "I can help you explore Indian traditions, history, cultural places, "
            "stories and related practices. Connect this endpoint to your AI/RAG "
            "service for full intelligent answers."
        )

    return jsonify({"success": True, "question": question, "answer": answer})


@app.post("/api/experiences")
def add_experience():
    body = request.get_json(silent=True) or {}
    required = ["tradition", "location", "language", "experience"]

    if not all(body.get(k) for k in required):
        return jsonify({
            "success": False,
            "message": "tradition, location, language and experience are required"
        }), 400

    # Later: save this into PostgreSQL/PostGIS.
    return jsonify({
        "success": True,
        "message": "Experience submitted for verification",
        "data": body
    }), 201


@app.get("/api/recommendations")
def recommendations():
    # Demo recommendations. Later this will use user interests/history.
    return jsonify({
        "success": True,
        "data": [TRADITIONS[1], TRADITIONS[3], TRADITIONS[4]]
    })


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
