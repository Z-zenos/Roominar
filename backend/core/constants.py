import enum


class RoleCode(str, enum.Enum):
    AUDIENCE = "AUDIENCE"
    SPEAKER = "SPEAKER"
    ORGANIZER = "ORGANIZER"
    ADMIN = "ADMIN"


class ORGStatusCode(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
