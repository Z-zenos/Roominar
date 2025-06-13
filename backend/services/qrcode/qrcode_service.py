import json
from io import BytesIO

import cloudinary.uploader
import qrcode

from backend.core.cloudinary_config import cloudinary
from backend.core.config import settings
from backend.core.security import generate_checksum


class QrcodeService:
    def __init__(self, upload_folder: str = "qr_codes/"):
        self.upload_folder = upload_folder

    def generate_qr_data(self, qr_code_id: str, user_id: int, event_id: int) -> str:
        checksum = generate_checksum(
            qr_code_id, user_id, event_id, settings.QR_CHECK_IN_SECRET_KEY.encode()
        )
        return json.dumps(
            {
                "qrCodeId": qr_code_id,
                "userId": user_id,
                "eventId": event_id,
                "checksum": checksum,
            }
        )

    def generate_qr_image(self, data: dict) -> BytesIO:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.ERROR_CORRECT_L,
            box_size=8,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer

    def upload_qr_to_cloudinary(self, buffer: BytesIO, filename: str) -> str:
        """
        Uploads the QR code image to Cloudinary and returns the secure URL.
        """

        result = cloudinary.uploader.upload(
            buffer,
            public_id=f"{self.upload_folder}{filename}",
            resource_type="image",
            overwrite=True,
            format="png",
            folder=self.upload_folder.rstrip("/"),
        )
        return result["secure_url"]
