from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_config import db

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Backend running ✅"})

@app.route("/test-firebase")
def test_firebase():
    db.collection("test").add({"name": "Hibban"})
    return jsonify({"message": "Firebase working ✅"})

# ================== PATIENT CRUD ==================

@app.route("/patients", methods=["POST"])
def add_patient():
    data = request.json
    db.collection("patients").add(data)
    return jsonify({"message": "Patient added successfully"})

@app.route("/patients", methods=["GET"])
def get_patients():
    patients = []
    for doc in db.collection("patients").stream():
        p = doc.to_dict()
        p["id"] = doc.id
        patients.append(p)
    return jsonify(patients)

@app.route("/patients/<id>", methods=["DELETE"])
def delete_patient(id):
    db.collection("patients").document(id).delete()
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True)

    