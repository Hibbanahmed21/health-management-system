# Health Management System (HDIMS)

A simple full-stack web application to manage patient health records with real-time database integration.

## 🚀 Features
- Add patient details (Name, Age, Disease)
- View patients in real-time
- Delete patient records
- Clean mobile UI (phone-style)
- Splash screen with smooth animation

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Database:** Firebase Firestore
- **Styling:** Custom CSS / Tailwind (UI components)

## 📂 Project Structure
code/
├── backend/
│ ├── app.py
│ ├── firebase_config.py
├── frontend/
│ ├── index.html
│ ├── css/
│ └── js/
└── README.md



## ⚙️ Setup Instructions

### 1. Clone the repo
git clone https://github.com/Hibbanahmed21/health-management-system.git

cd health-management-system


### 2. Backend setup

cd backend
pip install flask firebase-admin flask-cors
python app.py


### 3. Frontend
Open `frontend/index.html` using Live Server.

## 🔐 Note
Firebase service account key is not included for security reasons.

## 📌 Future Improvements
- User authentication (JWT)
- Role-based dashboards (Doctor/Admin/Patient)
- Appointment scheduling
- Medical history tracking

---

## 👨‍💻 Author
Hibban Ahmed Shariff