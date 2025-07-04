from enum import Enum
from typing import Literal


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
    ENDED = "ENDED"


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
    REGULAR = "REGULAR"
    LATE_BIRD = "LATE_BIRD"
    ONLINE = "ONLINE"
    ONSITE = "ONSITE"
    PRESS = "PRESS"
    SPEAKER = "SPEAKER"
    STAFF = "STAFF"
    EXHIBITOR = "EXHIBITOR"
    SPONSOR = "SPONSOR"
    ACCESS_PASS = "ACCESS_PASS"
    SEASON_PASS = "SEASON_PASS"
    DISCOUNTED = "DISCOUNTED"
    ALUMNI = "ALUMNI"
    FAMILY = "FAMILY"
    CHILD = "CHILD"
    EARLY_ACCESS = "EARLY_ACCESS"
    WORKSHOP_PASS = "WORKSHOP_PASS"
    OFFICIAL = "OFFICIAL"


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
    REFUNDED = "REFUNDED"


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


class TagStatsCategoryCode(str, Enum):
    INDUSTRY = "INDUSTRY"
    JOB_CATEGORY = "JOB_CATEGORY"
    TAG = "TAG"


class UserActionTypeCode(str, Enum):
    VIEW = "VIEW"
    BOOKMARK = "BOOKMARK"
    SHARE = "SHARE"
    COMMENT = "COMMENT"
    FOLLOW = "FOLLOW"
    RATE = "RATE"
    CHECK_IN = "CHECK_IN"
    CHECK_OUT = "CHECK_OUT"
    PURCHASE_TICKET = "PURCHASE_TICKET"
    SEARCH = "SEARCH"
    DOWNLOAD = "DOWNLOAD"
    UPGRADE_PLAN = "UPGRADE_PLAN"
    WATCH_VIDEO = "WATCH_VIDEO"
    SUBMIT_SURVEY = "SUBMIT_SURVEY"
    CANCEL_TICKET = "CANCEL_TICKET"
    ADD_TO_CALENDAR = "ADD_TO_CALENDAR"
    INVITE_FRIEND = "INVITE_FRIEND"
    ANSWER_APPLICATION_SURVEY = "ANSWER_APPLICATION_SURVEY"
    UNBOOKMARK = "UNBOOKMARK"
    FEEDBACK = "FEEDBACK"


class TrackingTimeRangeCode(str, Enum):
    TODAY = "TODAY"
    LAST_7_DAYS = "LAST_7_DAYS"
    LAST_30_DAYS = "LAST_30_DAYS"
    LAST_90_DAYS = "LAST_90_DAYS"
    DAILY = "DAILY"
    HOURLY = "HOURLY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    YEARLY = "YEARLY"


class PaymentMethodCode(str, Enum):
    CREDIT_CARD = "CREDIT_CARD"
    PAYPAL = "PAYPAL"
    MOMO = "MOMO"
    ZALOPAY = "ZALOPAY"
    STRIPE = "STRIPE"
    VNPAY = "VNPAY"
    OTHER = "OTHER"
    FREE = "FREE"


class CurrencyCode(str, Enum):
    VND = "VND"
    USD = "USD"
    EUR = "EUR"
    JPY = "JPY"
    CNY = "CNY"


class CancelTicketReasonCode(str, Enum):
    # Các lý do từ hệ thống hoặc ban tổ chức
    EVENT_CANCELED = "EVENT_CANCELED"
    EVENT_RESCHEDULED = "EVENT_RESCHEDULED"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    VENUE_CAPACITY_LIMIT = "VENUE_CAPACITY_LIMIT"
    FRAUDULENT_PURCHASE = "FRAUDULENT_PURCHASE"
    VIOLATION_OF_TERMS = "VIOLATION_OF_TERMS"

    # Các lý do từ người dùng
    CHANGE_PLAN = "CHANGE_PLAN"
    FINANCIAL_ISSUE = "FINANCIAL_ISSUE"
    PERSONAL_REASON = "PERSONAL_REASON"
    TIME_CONFLICT = "TIME_CONFLICT"
    HEALTH_ISSUE = "HEALTH_ISSUE"
    TRANSPORT_ISSUE = "TRANSPORT_ISSUE"
    PURCHASE_ERROR = "PURCHASE_ERROR"
    NO_COMPANION = "NO_COMPANION"
    VISA_ISSUE = "VISA_ISSUE"
    POLICY_ISSUE = "POLICY_ISSUE"
    BAD_CUSTOMER_SERVICE = "BAD_CUSTOMER_SERVICE"
    WEATHER_ISSUE = "WEATHER_ISSUE"


class TicketCancellationPolicyCode(str, Enum):
    NO_REFUND = "NO_REFUND"  # Không hoàn tiền khi hủy vé
    FULL_REFUND = "FULL_REFUND"  # Hoàn tiền 100% khi hủy
    PARTIAL_REFUND = "PARTIAL_REFUND"  # Hoàn tiền một phần, tỷ lệ có thể quy định riêng
    # Hoàn tiền theo thời gian hủy (VD: Hủy trước 7 ngày hoàn 80%, trước 3 ngày hoàn 50%)
    REFUND_BY_DATETIME = "REFUND_BY_DATETIME"
    EXCHANGE_ONLY = "EXCHANGE_ONLY"  # Không hoàn tiền nhưng cho phép đổi sang vé khác
    NON_TRANSFERABLE = "NON_TRANSFERABLE"  # Vé không thể hủy, hoàn, hoặc chuyển nhượng
    REFUND_IF_EVENT_CANCELED = (
        "REFUND_IF_EVENT_CANCELED"  # Chỉ hoàn tiền nếu sự kiện bị hủy
    )
    # Chỉ hoàn tiền nếu sự kiện bị dời ngày và khách không đồng ý tham gia
    REFUND_IF_RESCHEDULED = "REFUND_IF_RESCHEDULED"
    CREDIT_ONLY = (
        "CREDIT_ONLY"  # Không hoàn tiền nhưng cấp credit để mua vé khác trong tương lai
    )
    # Tuân theo chính sách hủy của bên thứ ba (VD: khi mua qua đại lý)
    THIRD_PARTY_POLICY = "THIRD_PARTY_POLICY"
    INSURANCE_REQUIRED = (
        "INSURANCE_REQUIRED"  # Chỉ hoàn tiền nếu khách có mua bảo hiểm hủy vé
    )
    OTHER = "OTHER"  # Chính sách khác tùy từng sự kiện cụ thể


class RefundMethodCode(str, Enum):
    # Hoàn tiền về phương thức thanh toán ban đầu (thẻ tín dụng, ví điện tử, v.v.)
    ORIGINAL_PAYMENT_METHOD = "ORIGINAL_PAYMENT_METHOD"
    BANK_TRANSFER = "BANK_TRANSFER"  # Hoàn tiền qua chuyển khoản ngân hàng
    EVENT_CREDIT = (
        "EVENT_CREDIT"  # Cấp credit để sử dụng cho sự kiện khác thay vì hoàn tiền
    )
    VOUCHER = "VOUCHER"  # Cấp voucher giảm giá cho sự kiện khác
    # Hoàn tiền qua hệ thống của bên thứ ba (VD: Ticketmaster, Eventbrite, Stripe)
    THIRD_PARTY_REFUND = "THIRD_PARTY_REFUND"
    CASH = "CASH"  # Hoàn tiền mặt
    OTHER = "OTHER"  # Các phương thức khác


class NotificationTypeCode(str, Enum):
    BOOKMARK_EVENT = "BOOKMARK_EVENT"
    PUBLISH_NEW_EVENT = "PUBLISH_NEW_EVENT"
    APPLY_EVENT = "APPLY_EVENT"
    CANCEL_EVENT = "CANCEL_EVENT"
    REMIND_EVENT_START_TIME_BEFORE_7D = "REMIND_EVENT_START_TIME_BEFORE_7D"
    REMIND_EVENT_START_TIME_BEFORE_3D = "REMIND_EVENT_START_TIME_BEFORE_3D"
    REMIND_EVENT_START_TIME_BEFORE_1D = "REMIND_EVENT_START_TIME_BEFORE_1D"
    REMIND_EVENT_START_TIME_BEFORE_10M = "REMIND_EVENT_START_TIME_BEFORE_10M"
    CHECK_IN_EVENT = "CHECK_IN_EVENT"
    REQUEST_FEEDBACK_EVENT = "REQUEST_FEEDBACK_EVENT"


class DeviceTypeCode(str, Enum):
    DESKTOP = "DESKTOP"
    ANDROID = "ANDROID"
    IOS = "IOS"
    TABLET = "TABLET"
    WEB = "WEB"
    OTHER = "OTHER"


Lang = Literal["vi", "en"]


class ReminderTypeCode(str, Enum):
    SEVEN_DAYS_BEFORE = "SEVEN_DAYS_BEFORE"
    THREE_DAYS_BEFORE = "THREE_DAYS_BEFORE"
    ONE_DAY_BEFORE = "ONE_DAY_BEFORE"
    TEN_MINUTES_BEFORE = "TEN_MINUTES_BEFORE"


class VoteTypeCode(str, Enum):
    UPVOTE = "UPVOTE"
    DOWNVOTE = "DOWNVOTE"
