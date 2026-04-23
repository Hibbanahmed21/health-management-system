const API_URL = "http://127.0.0.1:5000";

window.getPatients = async function () {
    const res = await fetch(`${API_URL}/patients`);
    return res.json();
}

window.addPatient = async function (data) {
    await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

window.deletePatient = async function (id) {
    await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE"
    });
}
