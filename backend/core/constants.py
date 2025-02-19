from enum import Enum


class RoleCode(str, Enum):
    AUDIENCE = "AUDIENCE"
    SPEAKER = "SPEAKER"
    ORGANIZER = "ORGANIZER"
    ADMIN = "ADMIN"


class ORGStatusCode(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class IndustryCode(str, Enum):
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


class JobTypeCode(str, Enum):
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


class EventMeetingToolCode(str, Enum):
    ZOOM = "ZOOM"
    GOOGLE_MEET = "MEET"
    DISCORD = "DISCORD"
    ROOMINAR = "ROOMINAR"
    OTHER = "OTHER"
    CONTACT_LATER = "CONTACT_LATER"


class EventStatusCode(str, Enum):
    PUBLIC = "PUBLIC"
    DRAFT = "DRAFT"
    PRIVATE = "PRIVATE"
    DEFERRED = "DEFERRED"


class SurveyStatusCode(str, Enum):
    OPEN = "OPEN"
    ARCHIVE = "ARCHIVE"


class EventSortByCode(str, Enum):
    START_AT = "START_AT"
    PUBLISHED_AT = "PUBLISHED_AT"
    APPLICATION_END_AT = "APPLICATION_END_AT"
    RECOMMENDATION = "RECOMMENDATION"


class QuestionTypeCode(str, Enum):
    SINGLE = "SINGLE"
    MULTIPLE = "MULTIPLE"
    TEXT = "TEXT"


class TicketTypeCode(str, Enum):
    EARLY_BIRD = "EARLY_BIRD"
    VIP = "VIP"
    GROUP = "GROUP"
    CORPORATE = "CORPORATE"
    STUDENT = "STUDENT"
    FREE = "FREE"
    DONATION = "DONATION"
    MULTIDAY = "MULTIDAY"
    DAY_PASS = "DAY_PASS"


class TicketDeliveryMethodCode(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    BOTH = "BOTH"


class TicketStatusCode(str, Enum):
    AVAILABLE = "AVAILABLE"
    SOLD_OUT = "SOLD_OUT"
    CANCELED = "CANCELED"


class TransactionStatusCode(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    CANCELED = "CANCELED"
    FAILED = "FAILED"


class TransactionTypeCode(str, Enum):
    DONATE = "DONATE"
    REFUND_CANCEL_TICKET = "REFUND_CANCEL_TICKET"
    PURCHASED_TICKET = "PURCHASED_TICKET"


class LoginMethodCode(str, Enum):
    NORMAL = "NORMAL"
    GOOGLE = "GOOGLE"
    GITHUB = "GITHUB"
    FACEBOOK = "FACEBOOK"
    X = "X"


class MyEventStatusCode(str, Enum):
    ALL = "ALL"
    BOOKMARKED = "BOOKMARKED"
    APPLIED = "APPLIED"
    ENDED = "ENDED"
    CANCELED = "CANCELED"
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    DEFERRED = "DEFERRED"


class OrganizationTypeCode(str, Enum):
    PERSONAL = "PERSONAL"
    BUSINESS = "BUSINESS"
    GOVERNMENT = "GOVERNMENT"
    EDUCATION = "EDUCATION"


class CityCode(str, Enum):
    ANGIANG = "ANGIANG"
    BACGIANG = "BACGIANG"
    BACKAN = "BACKAN"
    BACLIEU = "BACLIEU"
    BACNINH = "BACNINH"
    BARIAVUNGTAU = "BARIAVUNGTAU"
    BENTRE = "BENTRE"
    BINHDINH = "BINHDINH"
    BINHDUONG = "BINHDUONG"
    BINHPHUOC = "BINHPHUOC"
    BINHTHUAN = "BINHTHUAN"
    CAOBANG = "CAOBANG"
    CAMAU = "CAMAU"
    CANTHO = "CANTHO"
    DANANG = "DANANG"
    DIENBIEN = "DIENBIEN"
    DAKLAK = "DAKLAK"
    DAKNONG = "DAKNONG"
    DONGNAI = "DONGNAI"
    DONGTHAP = "DONGTHAP"
    GIALAI = "GIALAI"
    HANAM = "HANAM"
    HANOI = "HANOI"
    HATINH = "HATINH"
    HAUGIANG = "HAUGIANG"
    HOCHIMINH = "HOCHIMINH"
    HUNGYEN = "HUNGYEN"
    HAIPHONG = "HAIPHONG"
    HAIDUONG = "HAIDUONG"
    HAGIANG = "HAGIANG"
    HOABINH = "HOABINH"
    KHANHHOA = "KHANHHOA"
    KIENGIANG = "KIENGIANG"
    KONTUM = "KONTUM"
    LAICHAU = "LAICHAU"
    LANGSON = "LANGSON"
    LAOCAI = "LAOCAI"
    LAMDONG = "LAMDONG"
    LONGAN = "LONGAN"
    NAMDINH = "NAMDINH"
    NGHEAN = "NGHEAN"
    NINHBINH = "NINHBINH"
    NINHTHUAN = "NINHTHUAN"
    PHUTHO = "PHUTHO"
    PHUYEN = "PHUYEN"
    QUANGBINH = "QUANGBINH"
    QUANGNAM = "QUANGNAM"
    QUANGNGAI = "QUANGNGAI"
    QUANGNINH = "QUANGNINH"
    QUANGTRI = "QUANGTRI"
    SOCTRANG = "SOCTRANG"
    SONLA = "SONLA"
    TAYNINH = "TAYNINH"
    THAIBINH = "THAIBINH"
    THAINGUYEN = "THAINGUYEN"
    THANHHOA = "THANHHOA"
    THUATHIENHUE = "THUATHIENHUE"
    TIENGIANG = "TIENGIANG"
    TRAVINH = "TRAVINH"
    TUYENQUANG = "TUYENQUANG"
    VINHLONG = "VINHLONG"
    VINHPHUC = "VINHPHUC"
    YENBAI = "YENBAI"


class EventTimeStatusCode(str, Enum):
    APPLY_ONGOING = "APPLY_ONGOING"
    IN_PROGRESS = "IN_PROGRESS"  # Apply ended and officially ongoing
    ALL_ENDED = "ALL_ENDED"
    UPCOMING = "UPCOMING"  # Near to start day


class ManageEventSortByCode(str, Enum):
    SOLD_TICKETS_NUMBER = "SOLD_TICKETS_NUMBER"
    START_AT = "START_AT"
    NAME = "NAME"
    VIEW_NUMBER = "VIEW_NUMBER"
    CREATED_AT = "CREATED_AT"


class TagAssociationEntityCode(str, Enum):
    EVENT = "EVENT"
    ORGANIZATION = "ORGANIZATION"
    USER = "USER"
    SPEAKER = "SPEAKER"


class FollowEntityCode(str, Enum):
    ORGANIZATION = "ORGANIZATION"
    SPEAKER = "SPEAKER"


class AttendeeSortByCode(str, Enum):
    APPLY_AT = "APPLY_AT"
    NAME = "NAME"


class CheckInMethodCode(str, Enum):
    MANUAL = "MANUAL"
    QR = "QR"
    # NFC = "NFC"
    FACE = "FACE"
    OTHER = "OTHER"


class RefundReasonCode(str, Enum):
    CUSTOMER_REQUEST = "CUSTOMER_REQUEST"  # Yêu cầu từ khách hàng
    EVENT_CANCELED = "EVENT_CANCELED"  # Sự kiện bị hủy
    EVENT_RESCHEDULED = "EVENT_RESCHEDULED"  # Thay đổi lịch trình
    TECHNICAL_ERROR = "TECHNICAL_ERROR"  # Lỗi hệ thống
    DUPLICATE_PAYMENT = "DUPLICATE_PAYMENT"  # Thanh toán trùng lặp
    POLICY_CHANGE = "POLICY_CHANGE"  # Thay đổi chính sách
    FRAUDULENT_TRANSACTION = "FRAUDULENT_TRANSACTION"  # Giao dịch gian lận
    LEGAL_ISSUE = "LEGAL_ISSUE"  # Vấn đề pháp lý
