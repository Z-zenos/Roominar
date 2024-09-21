import logging


class CustomFormatter(logging.Formatter):
    # COLOR
    blue = "\x1b[1;38;5;45m"
    yellow = "\x1b[1;38;5;226m"
    red = "\x1b[1;38;5;196m"
    green = "\x1b[1;38;5;47m"
    orange = "\x1b[1;38;5;202m"
    white = "\x1b[1;38;5;256m"

    # TYPE
    reset = "\x1b[0m"
    bright = "\x1b[1m"
    dim = "\x1b[2m"
    italic = "\x1b[3m"
    underscore = "\x1b[4m"
    blink = "\x1b[5m"
    reverse = "\x1b[7m"
    hidden = "\x1b[8m"

    # HTTP METHOD
    GET = "\x1b[1;38;5;47m"
    POST = "\x1b[1;38;5;226m"
    PATCH = "\x1b[1;38;5;202m"
    DELETE = "\x1b[1;38;5;196m"
    OPTIONS = "\x1b[1;38;5;165m"

    # FORMAT
    time = "%(asctime)s"
    level = "%(levelname)s"
    message = "%(message)s"

    FORMATS = {
        logging.DEBUG: f"{orange}{level}:\t  {reset}{white}{message}{reset}",
        logging.INFO: f"{green}{level}:\t  {reset}{white}{message}{reset}",
        logging.WARNING: f"{yellow}{level}:\t  {reset}{white}{message}{reset}",
        logging.ERROR: f"{red}{level}:\t  {reset}{white}{message}{reset}",
        logging.CRITICAL: f"{red}{level}:\t  {reset}{white}{message}{reset}",
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)
