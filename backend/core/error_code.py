class ErrorCode:
    ERR_UNAUTHORIZED = "UNAUTHORIZED"
    ERR_ACCESS_DENIED = "ACCESS_DENIED"
    ERR_INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
    ERR_TOKEN_EXPIRED = "TOKEN_EXPIRED"
    ERR_INVALID_TOKEN = "INVALID_TOKEN"
    ERR_USER_ALREADY_EXISTED = "ERR_USER_ALREADY_EXISTED"
    ERR_PASSWORD_NOT_MATCHING = "ERR_PASSWORD_NOT_MATCHING"
    ERR_TAG_NOT_FOUND = "ERR_TAG_NOT_FOUND"
    ERR_EVENT_NOT_FOUND = "ERR_EVENT_NOT_FOUND"
    ERR_INVALID_PHONE = "ERR_INVALID_PHONE"
    ERR_INVALID_JOB_TYPE_CODE = "ERR_INVALID_JOB_TYPE_CODE"
    ERR_INVALID_INDUSTRY_CODE = "ERR_INVALID_INDUSTRY_CODE"
    ERR_INVALID_PASSWORD = "ERR_INVALID_PASSWORD"
    ERR_INVALID_URL = "ERR_INVALID_URL"
    ERR_EVENT_NO_LONGER_OPEN_APPLY = "ERR_EVENT_NO_LONGER_OPEN_APPLY"
    ERR_TICKET_SOLD_OUT = "ERR_TICKET_SOLD_OUT"
    ERR_USER_NOT_VERIFIED = "ERR_USER_NOT_VERIFIED"
    ERR_GOOGLE_ACCOUNT_NOT_VERIFIED = "ERR_GOOGLE_ACCOUNT_NOT_VERIFIED"
    ERR_ORGANIZATION_NOT_FOUND = "ERR_ORGANIZATION_NOT_FOUND"
    ERR_BOOKMARK_ALREADY_EXISTED = "ERR_BOOKMARK_ALREADY_EXISTED"
    ERR_BOOKMARK_NOT_FOUND = "ERR_BOOKMARK_NOT_FOUND"
    ERR_USER_NOT_FOUND = "ERR_USER_NOT_FOUND"
    ERR_LOGGED_IN_BY_GOOGLE = "ERR_LOGGED_IN_BY_GOOGLE"
    ERR_INVALID_RESET_PASSWORD_TOKEN = "ERR_INVALID_RESET_PASSWORD_TOKEN"
    ERR_INVALID_EMAIL = "ERR_INVALID_EMAIL"
    ERR_EMAIL_ALREADY_EXISTED = "ERR_EMAIL_ALREADY_EXISTED"
    ERR_INVALID_VERIFY_CHANGE_EMAIL_TOKEN = "ERR_INVALID_VERIFY_CHANGE_EMAIL_TOKEN"
    ERR_INVALID_REVERT_EMAIL_TOKEN = "ERR_INVALID_REVERT_EMAIL_TOKEN"
    ERR_APPLICATION_NOT_FOUND = "ERR_APPLICATION_NOT_FOUND"
    ERR_MISSING_FIELDS = "ERR_MISSING_FIELDS"
    ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE = "ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE"
    ERR_OFFLINE_EVENT_MISSING_ADDRESS = "ERR_OFFLINE_EVENT_MISSING_ADDRESS"
    ERR_ONLINE_EVENT_MISSING_ADDRESS = "ERR_ONLINE_EVENT_MISSING_ADDRESS"
    ERR_SURVEY_INVALID_START_END_DATE = "ERR_SURVEY_INVALID_START_END_DATE"
    ERR_SURVEY_NAME_ALREADY_EXISTED = "ERR_SURVEY_NAME_ALREADY_EXISTED"
    ERR_TARGET_ALREADY_EXISTED = "ERR_TARGET_ALREADY_EXISTED"
    ERR_ORGANIZATION_FOLLOW_EXISTED = "ERR_ORGANIZATION_FOLLOW_EXISTED"
    ERR_ORGANIZATION_FOLLOW_NOT_FOUND = "ERR_ORGANIZATION_FOLLOW_NOT_FOUND"
    ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED = (
        "ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED"
    )
    ERR_STRIPE_ERROR = "ERR_STRIPE_ERROR"
    ERR_INVALID_TICKET = "ERR_INVALID_TICKET"
    ERR_TICKET_NOT_FREE = "ERR_TICKET_NOT_FREE"


class ErrorMessage:
    ERR_UNAUTHORIZED = "Unauthorized"
    ERR_PASSWORD_NOT_MATCHING = "The password and confirmation password do not match."
    ERR_TOKEN_EXPIRED = "The token was expired."
    ERR_USER_ALREADY_EXISTED = "This account already existed."
    ERR_INVALID_TOKEN = "Invalid token."
    ERR_TAG_NOT_FOUND = "Unknown tag."
    ERR_EVENT_NOT_FOUND = "The event doesn't exist."
    ERR_INVALID_PHONE = "Invalid phone."
    ERR_INVALID_JOB_TYPE_CODE = "Invalid job type code."
    ERR_INVALID_INDUSTRY_CODE = "Invalid industry code."
    ERR_INVALID_PASSWORD = "Invalid password."
    ERR_INVALID_URL = "Invalid url."
    ERR_EVENT_NO_LONGER_OPEN_APPLY = "The event was no longer open apply."
    ERR_TICKET_SOLD_OUT = "Ticket sold out."
    ERR_USER_NOT_VERIFIED = "The user has not verified."
    ERR_GOOGLE_ACCOUNT_NOT_VERIFIED = "The google account is not verified."
    ERR_ORGANIZATION_NOT_FOUND = "The organization doesn't exist."
    ERR_BOOKMARK_ALREADY_EXISTED = "The bookmark already existed."
    ERR_BOOKMARK_NOT_FOUND = "The bookmark doesn't exist."
    ERR_USER_NOT_FOUND = "The user doesn't exist."
    ERR_LOGGED_IN_BY_GOOGLE = "The email used google for login."
    ERR_INVALID_RESET_PASSWORD_TOKEN = "Invalid reset password token."
    ERR_INVALID_EMAIL = "Invalid email."
    ERR_EMAIL_ALREADY_EXISTED = "The email already existed."
    ERR_INVALID_VERIFY_CHANGE_EMAIL_TOKEN = "Invalid verify change email token."
    ERR_INVALID_REVERT_EMAIL_TOKEN = "Invalid revert email token."
    ERR_APPLICATION_NOT_FOUND = "The application doesn't exist."
    ERR_MISSING_FIELDS = "Missing some important field data."
    ERR_EVENT_NEIHER_ONLINE_NOR_OFFLINE = (
        "You must select either online, offline, or both for the event format."
    )
    ERR_OFFLINE_EVENT_MISSING_ADDRESS = (
        "Missing place, city or address of offline event."
    )
    ERR_ONLINE_EVENT_MISSING_ADDRESS = "Missing meeting tool, url of online event."
    ERR_SURVEY_INVALID_START_END_DATE = "Survey end date must greater than start date."
    ERR_SURVEY_NAME_ALREADY_EXISTED = "The survey name already existed."
    ERR_TARGET_ALREADY_EXISTED = "The target already existed."
    ERR_ORGANIZATION_FOLLOW_EXISTED = "The organization follow existed."
    ERR_ORGANIZATION_FOLLOW_NOT_FOUND = "The organization follow doesn't exist."
    ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED = (
        "The maximum tickets per application reached."
    )
    ERR_STRIPE_ERROR = "An error occurred while processing the payment with Stripe."
    ERR_INVALID_TICKET = "Invalid ticket."
    ERR_TICKET_NOT_FREE = "Ticket not free."
