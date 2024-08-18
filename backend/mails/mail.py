from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from jinja2 import Environment, FileSystemLoader

from backend.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_USERNAME,
    MAIL_PASSWORD=settings.EMAIL_PASSWORD,
    MAIL_FROM=settings.AUD_SENDER_EMAIL,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=settings.TEMPLATE_FOLDER,
)


class Email:
    def __init__(self):
        self.aud_sender_email = settings.AUD_SENDER_EMAIL
        self.org_sender_email = settings.ORG_SENDER_EMAIL
        self.aud_sender_name = settings.AUD_SENDER_NAME
        self.org_sender_name = settings.ORG_SENDER_NAME
        self.constant_data = {"homepage_url": f"{settings.AUD_FRONTEND_URL}/home"}

    async def send_aud_email(
        self, receivers: str | list, template: str, subject: str, data
    ):
        content = self.read_template(template, {**self.constant_data, **data})

        if isinstance(receivers, str):
            receivers = [receivers]

        message = MessageSchema(
            subject=subject,
            recipients=list(receivers),
            template_body=content,
            subtype=MessageType.html,
        )
        await FastMail(conf).send_message(message)

    def read_template(self, template: str, data):
        template_folder = settings.TEMPLATE_FOLDER

        env = Environment(loader=FileSystemLoader(template_folder))
        j2template = env.get_template(template)

        html = j2template.render(data)
        return html
