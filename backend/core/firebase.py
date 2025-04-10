import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate(
    "backend/credentials/firebase-adminsdk-vievent-327c1.json"
)
firebase_admin.initialize_app(cred)
