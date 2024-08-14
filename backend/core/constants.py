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


class IndustryCode(str, enum.Enum):
    REAL_ESTATE = "REAL_ESTATE"
    CONSTRUCTION = "CONSTRUCTION"
    FOOD_DRINK = "FOOD_DRINK"
    COSMETICS_MANUFACTURING = "COSMETICS_MANUFACTURING"
    ELECTRONICS_MANUFACTURING = "ELECTRONICS_MANUFACTURING"
    PRECISION_MANUFACTURING = "PRECISION_MANUFACTURING"
    AUTOMOTIVE_MANUFACTURING = "AUTOMOTIVE_MANUFACTURING"
    FASHION_MANUFACTURING = "FASHION_MANUFACTURING"
    B2C_MANUFACTURING = "B2C_MANUFACTURING"
    B2B_MANUFACTURING = "B2B_MANUFACTURING"
    LOGISTICS = "LOGISTICS"
    IT_COMMUNICATIONS = "IT_COMMUNICATIONS"
    CONTRACT_DEVELOPMENT = "CONTRACT_DEVELOPMENT"
    RETAIL = "RETAIL"
    WHOLESALE = "WHOLESALE"
    FINANCE = "FINANCE"
    HOSPITALITY = "HOSPITALITY"
    CONSULTING = "CONSULTING"
    HEALTHCARE = "HEALTHCARE"
    ADVERTISING = "ADVERTISING"
    ENTERTAINMENT = "ENTERTAINMENT"
    EDUCATION = "EDUCATION"
    MEDIA = "MEDIA"
    MINING = "MINING"
    TRANSPORTATION = "TRANSPORTATION"
    WAREHOUSING = "WAREHOUSING"
    CHEMICAL = "CHEMICAL"
    OTHER = "OTHER"


class JobTypeCode(str, enum.Enum):
    DEV = "DEV"  # Developer
    QA = "QA"  # Quality Assurance
    PM = "PM"  # Project Manager
    TESTER = "TESTER"  # Tester
    SYSADMIN = "SYSADMIN"  # System Administrator
    DBA = "DBA"  # Database Administrator
    SA = "SA"  # Solution Architect

    ACC = "ACC"  # Accountant
    FIN = "FIN"  # Financial Analyst
    CFA = "CFA"  # Certified Financial Analyst
    TAX = "TAX"  # Tax Consultant
    AUD = "AUD"  # Auditor

    SEO = "SEO"  # Search Engine Optimization Specialist
    SMM = "SMM"  # Social Media Manager
    PR = "PR"  # Public Relations Specialist
    AD = "AD"  # Advertising Manager
    CMM = "CMM"  # Content Marketing

    TEACHER = "TEACHER"  # Teacher
    LECTURER = "LECTURER"  # Lecturer
    TUTOR = "TUTOR"  # Tutor
    PRINCIPAL = "PRINCIPAL"  # Principal
    COUNSELOR = "COUNSELOR"  # School Counselor

    DOCTOR = "DOCTOR"  # Doctor
    NURSE = "NURSE"  # Nurse
    PHARM = "PHARM"  # Pharmacist
    SURGEON = "SURGEON"  # Surgeon
    THER = "THER"  # Therapist

    ARCH = "ARCH"  # Architect
    ENG = "ENG"  # Engineer
    CIVIL = "CIVIL"  # Civil Engineer
    CON = "CON"  # Contractor
    QS = "QS"  # Quantity Surveyor

    DESIGNER = "DESIGNER"  # Designer
    ARTIST = "ARTIST"  # Artist
    WRITER = "WRITER"  # Writer
    MUSICIAN = "MUSICIAN"  # Musician
    ACTOR = "ACTOR"  # Actor

    CS = "CS"  # Customer Service Representative
    SALES = "SALES"  # Salesperson
    CRM = "CRM"  # Customer Relationship Manager
    CASHIER = "CASHIER"  # Cashier
    MERCH = "MERCH"  # Merchandiser

    DRIVER = "DRIVER"  # Driver
    LOG = "LOG"  # Logistician
    WAREHOUSE = "WAREHOUSE"  # Warehouse Manager
    SHIP = "SHIP"  # Shipping Coordinator

    FARMER = "FARMER"  # Farmer
    AGR = "AGR"  # Agricultural Engineer
    VET = "VET"  # Veterinarian
    HORT = "HORT"  # Horticulturist


class EventMeetingToolCode(str, enum.Enum):
    ZOOM = "ZOOM"
    GOOGLE_MEET = "MEET"
    DISCORD = "DISCORD"
    ROOMINAR = "ROOMINAR"
    OTHER = "OTHER"
    CONTACT_LATER = "CONTACT_LATER"


class EventStatusCode(str, enum.Enum):
    PUBLIC = "PUBLIC"
    DRAFT = "DRAFT"
    PRIVATE = "PRIVATE"


class QuestionnaireStatusCode(str, enum.Enum):
    OPEN = "OPEN"
    ARCHIVE = "ARCHIVE"


class EventSortByCode(str, enum.Enum):
    START_AT = "START_AT"
    PUBLIC_AT = "PUBLIC_AT"
    APPLICATION_END_AT = "APPLICATION_END_AT"
    RECOMMEDATION = "RECOMMEDATION"
