import logging
import os
from logging.handlers import TimedRotatingFileHandler


class CustomFormatter(logging.Formatter):
    blue = "\x1b[1;38;5;45m"
    yellow = "\x1b[1;38;5;226m"
    red = "\x1b[1;38;5;196m"
    green = "\x1b[1;38;5;47m"
    orange = "\x1b[1;38;5;202m"
    white = "\x1b[1;38;5;256m"

    reset = "\x1b[0m"

    FORMATS = {
        logging.DEBUG: f"{orange}DEBUG:\t  {reset}{white}%(message)s{reset}",
        logging.INFO: f"{green}INFO:\t  {reset}{white}%(message)s{reset}",
        logging.WARNING: f"{yellow}WARNING:\t  {reset}{white}%(message)s{reset}",
        logging.ERROR: f"{red}ERROR:\t  {reset}{white}%(message)s{reset}",
        logging.CRITICAL: f"{red}CRITICAL:\t  {reset}{white}%(message)s{reset}",
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


# === Logger setup ===

log_dir = "backend/logs"
os.makedirs(log_dir, exist_ok=True)

log_file_path = os.path.join(log_dir, "app.log")

# File handler with rotation per day
file_handler = TimedRotatingFileHandler(
    log_file_path,
    when="midnight",
    interval=1,
    backupCount=7,
    encoding="utf-8",
)
file_handler.suffix = "%Y-%m-%d"
file_formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
file_handler.setFormatter(file_formatter)

# Console handler with colored output
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(CustomFormatter())

# Logger
logger = logging.getLogger("myapp")  # Sử dụng tên cụ thể tránh ghi đè root logger
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Đảm bảo logger không nhân đôi log
logger.propagate = False
