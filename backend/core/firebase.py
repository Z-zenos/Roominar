import os

import firebase_admin
from firebase_admin import credentials

from backend.core.config import logger


def get_firebase_app():
    """
    Initialize Firebase app if not already initialized and return the app instance.
    Uses a singleton pattern to ensure only one instance exists.
    """
    try:
        if not firebase_admin._apps:
            # Get absolute path to credentials file
            base_dir = os.path.dirname(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            )
            creds_path = os.path.join(
                base_dir,
                "backend",
                "credentials",
                "vievent-327c1-firebase-adminsdk-fbsvc-c81d71a6c8.json",
            )

            if not os.path.exists(creds_path):
                logger.error(f"Firebase credentials file not found at {creds_path}")
                raise FileNotFoundError(
                    f"Firebase credentials file not found at {creds_path}"
                )

            cred = credentials.Certificate(creds_path)

            # Initialize with explicit options that help with connectivity
            return firebase_admin.initialize_app(
                cred,
                {
                    "httpTimeout": 30,  # Increased timeout
                },
            )
        else:
            return firebase_admin.get_app()
    except Exception as e:
        logger.error(f"Firebase initialization error: {str(e)}")
        raise
