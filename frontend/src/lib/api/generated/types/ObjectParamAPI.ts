import type { HttpInfo } from '../http/http';
import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import type { Configuration} from '../configuration'

import { AnalyzeAdvanced } from '../models/AnalyzeAdvanced';
import { AnalyzeEventCheckInsByMinuteItem } from '../models/AnalyzeEventCheckInsByMinuteItem';
import { AnalyzeEventCheckInsByTicketTypeItem } from '../models/AnalyzeEventCheckInsByTicketTypeItem';
import type { AnalyzeEventCheckInsResponse } from '../models/AnalyzeEventCheckInsResponse';
import { AnalyzeEventTicketsOverview } from '../models/AnalyzeEventTicketsOverview';
import { AnalyzeEventTicketsOverviewTickets } from '../models/AnalyzeEventTicketsOverviewTickets';
import type { AnalyzeEventTicketsResponse } from '../models/AnalyzeEventTicketsResponse';
import { AnswerItem } from '../models/AnswerItem';
import { ApplicationTicket } from '../models/ApplicationTicket';
import { AttendeeAppliedEvent } from '../models/AttendeeAppliedEvent';
import { AttendeePurchasedTickets } from '../models/AttendeePurchasedTickets';
import type { AttendeeSortByCode } from '../models/AttendeeSortByCode';
import { AttendeeSurveyResponseResultItem } from '../models/AttendeeSurveyResponseResultItem';
import { AttendeeTicketTransaction } from '../models/AttendeeTicketTransaction';
import { AttendeeTicketTransactionItem } from '../models/AttendeeTicketTransactionItem';
import { CancelTicketReasonCode } from '../models/CancelTicketReasonCode';
import type { CancelTicketsRequest } from '../models/CancelTicketsRequest';
import type { ChangeEmailRequest } from '../models/ChangeEmailRequest';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { CheckinStatByTime } from '../models/CheckinStatByTime';
import { CityCode } from '../models/CityCode';
import type { CommentEventRequest } from '../models/CommentEventRequest';
import { CreateAnswerItem } from '../models/CreateAnswerItem';
import type { CreateApplicationCheckoutSessionResponse } from '../models/CreateApplicationCheckoutSessionResponse';
import type { CreateApplicationRequest } from '../models/CreateApplicationRequest';
import type { CreateCommentReplyRequest } from '../models/CreateCommentReplyRequest';
import { CreateQuestionAnswerRequest } from '../models/CreateQuestionAnswerRequest';
import type { CreateSurveyRequest } from '../models/CreateSurveyRequest';
import type { CreateTargetRequest } from '../models/CreateTargetRequest';
import type { CreateTicketRequest } from '../models/CreateTicketRequest';
import { CurrencyCode } from '../models/CurrencyCode';
import { DeviceTypeCode } from '../models/DeviceTypeCode';
import { ErrorResponse400 } from '../models/ErrorResponse400';
import { ErrorResponse401 } from '../models/ErrorResponse401';
import { ErrorResponse403 } from '../models/ErrorResponse403';
import type { EventMeetingToolCode } from '../models/EventMeetingToolCode';
import type { EventSortByCode } from '../models/EventSortByCode';
import type { EventStatusCode } from '../models/EventStatusCode';
import type { EventTimeStatusCode } from '../models/EventTimeStatusCode';
import type { FeedbackEventRequest } from '../models/FeedbackEventRequest';
import { FeedbackRating } from '../models/FeedbackRating';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { ForgotPasswordResponse } from '../models/ForgotPasswordResponse';
import type { GenerateEventAIRequest } from '../models/GenerateEventAIRequest';
import type { GenerateEventAIResponse } from '../models/GenerateEventAIResponse';
import type { GetAttendeeDetailResponse } from '../models/GetAttendeeDetailResponse';
import type { GetDraftEventResponse } from '../models/GetDraftEventResponse';
import type { GetEventDetailResponse } from '../models/GetEventDetailResponse';
import type { GetMeResponse } from '../models/GetMeResponse';
import type { GetOrganizationDashboardResponse } from '../models/GetOrganizationDashboardResponse';
import type { GetOrganizationDetailResponse } from '../models/GetOrganizationDetailResponse';
import { GetOrganizationOngoingEventsItem } from '../models/GetOrganizationOngoingEventsItem';
import type { GetSpeakerDetailResponse } from '../models/GetSpeakerDetailResponse';
import type { GetTagStatsResponse } from '../models/GetTagStatsResponse';
import type { GetTicketStatsResponse } from '../models/GetTicketStatsResponse';
import type { GetTransactionStatusCountsResponse } from '../models/GetTransactionStatusCountsResponse';
import { GetUserFeedback } from '../models/GetUserFeedback';
import { HTTPValidationError } from '../models/HTTPValidationError';
import type { IndustryCode } from '../models/IndustryCode';
import type { JobTypeCode } from '../models/JobTypeCode';
import { ListingAttendeesItem } from '../models/ListingAttendeesItem';
import type { ListingAttendeesRankingItem } from '../models/ListingAttendeesRankingItem';
import type { ListingAttendeesResponse } from '../models/ListingAttendeesResponse';
import { ListingCommentRepliesItem } from '../models/ListingCommentRepliesItem';
import type { ListingCommentRepliesResponse } from '../models/ListingCommentRepliesResponse';
import { ListingEventCommentsItem } from '../models/ListingEventCommentsItem';
import type { ListingEventCommentsResponse } from '../models/ListingEventCommentsResponse';
import { ListingEventOptionsItem } from '../models/ListingEventOptionsItem';
import type { ListingEventOptionsResponse } from '../models/ListingEventOptionsResponse';
import { ListingEventPurchasedTicketsItem } from '../models/ListingEventPurchasedTicketsItem';
import type { ListingEventPurchasedTicketsResponse } from '../models/ListingEventPurchasedTicketsResponse';
import { ListingEventRankItem } from '../models/ListingEventRankItem';
import type { ListingEventRankResponse } from '../models/ListingEventRankResponse';
import { ListingFeedbackCriteriaItem } from '../models/ListingFeedbackCriteriaItem';
import type { ListingFeedbackCriteriaResponse } from '../models/ListingFeedbackCriteriaResponse';
import { ListingFeedbacksItem } from '../models/ListingFeedbacksItem';
import type { ListingFeedbacksResponse } from '../models/ListingFeedbacksResponse';
import type { ListingMyEventsResponse } from '../models/ListingMyEventsResponse';
import { ListingMyTransactionTicketItem } from '../models/ListingMyTransactionTicketItem';
import { ListingMyTransactionsItem } from '../models/ListingMyTransactionsItem';
import type { ListingMyTransactionsResponse } from '../models/ListingMyTransactionsResponse';
import type { ListingNotificationsResponse } from '../models/ListingNotificationsResponse';
import { ListingOrganizationEventsItem } from '../models/ListingOrganizationEventsItem';
import type { ListingOrganizationEventsResponse } from '../models/ListingOrganizationEventsResponse';
import type { ListingOrganizationEventsTimelineItem } from '../models/ListingOrganizationEventsTimelineItem';
import { ListingRandomOrganizationsItem } from '../models/ListingRandomOrganizationsItem';
import type { ListingRandomOrganizationsResponse } from '../models/ListingRandomOrganizationsResponse';
import { ListingRandomSpeakersItem } from '../models/ListingRandomSpeakersItem';
import type { ListingRandomSpeakersResponse } from '../models/ListingRandomSpeakersResponse';
import type { ListingRecommendationEventsResponse } from '../models/ListingRecommendationEventsResponse';
import { ListingRelatedEventsItem } from '../models/ListingRelatedEventsItem';
import type { ListingRelatedEventsResponse } from '../models/ListingRelatedEventsResponse';
import type { ListingSurveyOptionsItem } from '../models/ListingSurveyOptionsItem';
import type { ListingTagRankResponse } from '../models/ListingTagRankResponse';
import type { ListingTagsResponse } from '../models/ListingTagsResponse';
import type { ListingTargetOptionsItem } from '../models/ListingTargetOptionsItem';
import { ListingTopOrganizationEventsItem } from '../models/ListingTopOrganizationEventsItem';
import type { ListingTopOrganizationEventsResponse } from '../models/ListingTopOrganizationEventsResponse';
import type { ListingTrendingEventsResponse } from '../models/ListingTrendingEventsResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LogoutRequest } from '../models/LogoutRequest';
import type { ManageEventSortByCode } from '../models/ManageEventSortByCode';
import type { ManualCheckInRequest } from '../models/ManualCheckInRequest';
import { MyEventItem } from '../models/MyEventItem';
import type { MyEventStatusCode } from '../models/MyEventStatusCode';
import { MyTicketTransaction } from '../models/MyTicketTransaction';
import { MyTicketTransactionItem } from '../models/MyTicketTransactionItem';
import { NotificationItem } from '../models/NotificationItem';
import { NotificationTypeCode } from '../models/NotificationTypeCode';
import { OrganizationEventTicketItem } from '../models/OrganizationEventTicketItem';
import { OrganizationTypeCode } from '../models/OrganizationTypeCode';
import { PaymentMethodCode } from '../models/PaymentMethodCode';
import type { PublishEventRequest } from '../models/PublishEventRequest';
import type { QRCheckInRequest } from '../models/QRCheckInRequest';
import { QuestionAnswerItem } from '../models/QuestionAnswerItem';
import { QuestionTypeCode } from '../models/QuestionTypeCode';
import { RefundMethodCode } from '../models/RefundMethodCode';
import type { RegisterAudienceRequest } from '../models/RegisterAudienceRequest';
import type { RegisterAudienceResponse } from '../models/RegisterAudienceResponse';
import type { RegisterNotificationDeviceTokenRequest } from '../models/RegisterNotificationDeviceTokenRequest';
import type { RegisterNotificationDeviceTokenResponse } from '../models/RegisterNotificationDeviceTokenResponse';
import type { RegisterOrganizationRequest } from '../models/RegisterOrganizationRequest';
import type { RegisterOrganizationResponse } from '../models/RegisterOrganizationResponse';
import type { RequestChangeEmailResponse } from '../models/RequestChangeEmailResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import { RevenueByTicketType } from '../models/RevenueByTicketType';
import { SalesSpeedStat } from '../models/SalesSpeedStat';
import type { SaveDraftEventRequest } from '../models/SaveDraftEventRequest';
import { SearchEventsItem } from '../models/SearchEventsItem';
import type { SearchEventsResponse } from '../models/SearchEventsResponse';
import type { SocialAuthRequest } from '../models/SocialAuthRequest';
import { SurveyDetail } from '../models/SurveyDetail';
import { SurveyResponseResultItem } from '../models/SurveyResponseResultItem';
import { SurveyStatusCode } from '../models/SurveyStatusCode';
import { TagGroup } from '../models/TagGroup';
import { TagItem } from '../models/TagItem';
import { TagStatsCategoryCode } from '../models/TagStatsCategoryCode';
import { TagStatsItem } from '../models/TagStatsItem';
import type { Ticket } from '../models/Ticket';
import { TicketCancellationPolicyCode } from '../models/TicketCancellationPolicyCode';
import { TicketDeliveryMethodCode } from '../models/TicketDeliveryMethodCode';
import { TicketGranularity } from '../models/TicketGranularity';
import type { TicketItem } from '../models/TicketItem';
import { TicketStatByTime } from '../models/TicketStatByTime';
import type { TicketStatusCode } from '../models/TicketStatusCode';
import type { TicketTypeCode } from '../models/TicketTypeCode';
import { TimeToSoldOutStat } from '../models/TimeToSoldOutStat';
import type { TokenResponse } from '../models/TokenResponse';
import { TopHourStat } from '../models/TopHourStat';
import { TrackUserActionsItem } from '../models/TrackUserActionsItem';
import type { TrackUserActionsResponse } from '../models/TrackUserActionsResponse';
import type { TrackingTimeRangeCode } from '../models/TrackingTimeRangeCode';
import type { TransactionStatusCode } from '../models/TransactionStatusCode';
import type { UpdateCommentReplyRequest } from '../models/UpdateCommentReplyRequest';
import type { UpdateEventCommentRequest } from '../models/UpdateEventCommentRequest';
import type { UpdateFeedbackRequest } from '../models/UpdateFeedbackRequest';
import type { UpdateTicketRequest } from '../models/UpdateTicketRequest';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserActionTypeCode } from '../models/UserActionTypeCode';
import { UserFeedbackRating } from '../models/UserFeedbackRating';
import { ValidationError } from '../models/ValidationError';
import { ValidationErrorLocInner } from '../models/ValidationErrorLocInner';
import type { VerifyAudienceRequest } from '../models/VerifyAudienceRequest';
import type { VoteCommentRequest } from '../models/VoteCommentRequest';
import { VoteTypeCode } from '../models/VoteTypeCode';

import { ObservableApplicationsApi } from "./ObservableAPI";
import type { ApplicationsApiRequestFactory, ApplicationsApiResponseProcessor} from "../apis/ApplicationsApi";

export interface ApplicationsApiCreateCheckoutSessionRequest {
    /**
     *
     * @type CreateApplicationRequest
     * @memberof ApplicationsApicreateCheckoutSession
     */
    createApplicationRequest?: CreateApplicationRequest
}

export interface ApplicationsApiCreateFreeApplicationRequest {
    /**
     *
     * @type CreateApplicationRequest
     * @memberof ApplicationsApicreateFreeApplication
     */
    createApplicationRequest?: CreateApplicationRequest
}

export class ObjectApplicationsApi {
    private api: ObservableApplicationsApi

    public constructor(configuration: Configuration, requestFactory?: ApplicationsApiRequestFactory, responseProcessor?: ApplicationsApiResponseProcessor) {
        this.api = new ObservableApplicationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Checkout Session
     * @param param the request object
     */
    public createCheckoutSessionWithHttpInfo(param: ApplicationsApiCreateCheckoutSessionRequest = {}, options?: Configuration): Promise<HttpInfo<CreateApplicationCheckoutSessionResponse>> {
        return this.api.createCheckoutSessionWithHttpInfo(param.createApplicationRequest,  options).toPromise();
    }

    /**
     * Create Checkout Session
     * @param param the request object
     */
    public createCheckoutSession(param: ApplicationsApiCreateCheckoutSessionRequest = {}, options?: Configuration): Promise<CreateApplicationCheckoutSessionResponse> {
        return this.api.createCheckoutSession(param.createApplicationRequest,  options).toPromise();
    }

    /**
     * Create Free Application
     * @param param the request object
     */
    public createFreeApplicationWithHttpInfo(param: ApplicationsApiCreateFreeApplicationRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createFreeApplicationWithHttpInfo(param.createApplicationRequest,  options).toPromise();
    }

    /**
     * Create Free Application
     * @param param the request object
     */
    public createFreeApplication(param: ApplicationsApiCreateFreeApplicationRequest = {}, options?: Configuration): Promise<number> {
        return this.api.createFreeApplication(param.createApplicationRequest,  options).toPromise();
    }

}

import { ObservableAuthApi } from "./ObservableAPI";
import type { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";

export interface AuthApiChangePasswordRequest {
    /**
     *
     * @type ChangePasswordRequest
     * @memberof AuthApichangePassword
     */
    changePasswordRequest?: ChangePasswordRequest
}

export interface AuthApiForgotPasswordRequest {
    /**
     *
     * @type ForgotPasswordRequest
     * @memberof AuthApiforgotPassword
     */
    forgotPasswordRequest?: ForgotPasswordRequest
}

export interface AuthApiLoginRequest {
    /**
     *
     * @type string
     * @memberof AuthApilogin
     */
    userAgent?: string
    /**
     *
     * @type LoginRequest
     * @memberof AuthApilogin
     */
    loginRequest?: LoginRequest
}

export interface AuthApiLogoutRequest {
    /**
     *
     * @type LogoutRequest
     * @memberof AuthApilogout
     */
    logoutRequest?: LogoutRequest
}

export interface AuthApiMeRequest {
}

export interface AuthApiRefreshTokenRequest {
    /**
     *
     * @type string
     * @memberof AuthApirefreshToken
     */
    token: string
}

export interface AuthApiRegisterAudienceRequest {
    /**
     *
     * @type RegisterAudienceRequest
     * @memberof AuthApiregisterAudience
     */
    registerAudienceRequest?: RegisterAudienceRequest
}

export interface AuthApiRequestChangeEmailRequest {
    /**
     *
     * @type ChangeEmailRequest
     * @memberof AuthApirequestChangeEmail
     */
    changeEmailRequest?: ChangeEmailRequest
}

export interface AuthApiResetPasswordRequest {
    /**
     *
     * @type string
     * @memberof AuthApiresetPassword
     */
    token: string
    /**
     *
     * @type ResetPasswordRequest
     * @memberof AuthApiresetPassword
     */
    resetPasswordRequest?: ResetPasswordRequest
}

export interface AuthApiRevertEmailRequest {
    /**
     *
     * @type string
     * @memberof AuthApirevertEmail
     */
    token: string
}

export interface AuthApiSocialAuthRequest {
    /**
     *
     * @type SocialAuthRequest
     * @memberof AuthApisocialAuth
     */
    socialAuthRequest: SocialAuthRequest
}

export interface AuthApiVerifyAudienceRequest {
    /**
     *
     * @type string
     * @memberof AuthApiverifyAudience
     */
    token: string
    /**
     *
     * @type VerifyAudienceRequest
     * @memberof AuthApiverifyAudience
     */
    verifyAudienceRequest?: VerifyAudienceRequest
}

export interface AuthApiVerifyChangeEmailRequest {
    /**
     *
     * @type string
     * @memberof AuthApiverifyChangeEmail
     */
    token: string
}

export class ObjectAuthApi {
    private api: ObservableAuthApi

    public constructor(configuration: Configuration, requestFactory?: AuthApiRequestFactory, responseProcessor?: AuthApiResponseProcessor) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Change Password
     * @param param the request object
     */
    public changePasswordWithHttpInfo(param: AuthApiChangePasswordRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.changePasswordWithHttpInfo(param.changePasswordRequest,  options).toPromise();
    }

    /**
     * Change Password
     * @param param the request object
     */
    public changePassword(param: AuthApiChangePasswordRequest = {}, options?: Configuration): Promise<void> {
        return this.api.changePassword(param.changePasswordRequest,  options).toPromise();
    }

    /**
     * Forgot Password
     * @param param the request object
     */
    public forgotPasswordWithHttpInfo(param: AuthApiForgotPasswordRequest = {}, options?: Configuration): Promise<HttpInfo<ForgotPasswordResponse>> {
        return this.api.forgotPasswordWithHttpInfo(param.forgotPasswordRequest,  options).toPromise();
    }

    /**
     * Forgot Password
     * @param param the request object
     */
    public forgotPassword(param: AuthApiForgotPasswordRequest = {}, options?: Configuration): Promise<ForgotPasswordResponse> {
        return this.api.forgotPassword(param.forgotPasswordRequest,  options).toPromise();
    }

    /**
     * Login
     * @param param the request object
     */
    public loginWithHttpInfo(param: AuthApiLoginRequest = {}, options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        return this.api.loginWithHttpInfo(param.userAgent, param.loginRequest,  options).toPromise();
    }

    /**
     * Login
     * @param param the request object
     */
    public login(param: AuthApiLoginRequest = {}, options?: Configuration): Promise<TokenResponse> {
        return this.api.login(param.userAgent, param.loginRequest,  options).toPromise();
    }

    /**
     * Log out user from the current device
     * Logout
     * @param param the request object
     */
    public logoutWithHttpInfo(param: AuthApiLogoutRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.logoutWithHttpInfo(param.logoutRequest,  options).toPromise();
    }

    /**
     * Log out user from the current device
     * Logout
     * @param param the request object
     */
    public logout(param: AuthApiLogoutRequest = {}, options?: Configuration): Promise<void> {
        return this.api.logout(param.logoutRequest,  options).toPromise();
    }

    /**
     * Me
     * @param param the request object
     */
    public meWithHttpInfo(param: AuthApiMeRequest = {}, options?: Configuration): Promise<HttpInfo<GetMeResponse>> {
        return this.api.meWithHttpInfo( options).toPromise();
    }

    /**
     * Me
     * @param param the request object
     */
    public me(param: AuthApiMeRequest = {}, options?: Configuration): Promise<GetMeResponse> {
        return this.api.me( options).toPromise();
    }

    /**
     * Refresh Token
     * @param param the request object
     */
    public refreshTokenWithHttpInfo(param: AuthApiRefreshTokenRequest, options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        return this.api.refreshTokenWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * Refresh Token
     * @param param the request object
     */
    public refreshToken(param: AuthApiRefreshTokenRequest, options?: Configuration): Promise<TokenResponse> {
        return this.api.refreshToken(param.token,  options).toPromise();
    }

    /**
     * Register Audience
     * @param param the request object
     */
    public registerAudienceWithHttpInfo(param: AuthApiRegisterAudienceRequest = {}, options?: Configuration): Promise<HttpInfo<RegisterAudienceResponse>> {
        return this.api.registerAudienceWithHttpInfo(param.registerAudienceRequest,  options).toPromise();
    }

    /**
     * Register Audience
     * @param param the request object
     */
    public registerAudience(param: AuthApiRegisterAudienceRequest = {}, options?: Configuration): Promise<RegisterAudienceResponse> {
        return this.api.registerAudience(param.registerAudienceRequest,  options).toPromise();
    }

    /**
     * Request Change Email
     * @param param the request object
     */
    public requestChangeEmailWithHttpInfo(param: AuthApiRequestChangeEmailRequest = {}, options?: Configuration): Promise<HttpInfo<RequestChangeEmailResponse>> {
        return this.api.requestChangeEmailWithHttpInfo(param.changeEmailRequest,  options).toPromise();
    }

    /**
     * Request Change Email
     * @param param the request object
     */
    public requestChangeEmail(param: AuthApiRequestChangeEmailRequest = {}, options?: Configuration): Promise<RequestChangeEmailResponse> {
        return this.api.requestChangeEmail(param.changeEmailRequest,  options).toPromise();
    }

    /**
     * Reset Password
     * @param param the request object
     */
    public resetPasswordWithHttpInfo(param: AuthApiResetPasswordRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.resetPasswordWithHttpInfo(param.token, param.resetPasswordRequest,  options).toPromise();
    }

    /**
     * Reset Password
     * @param param the request object
     */
    public resetPassword(param: AuthApiResetPasswordRequest, options?: Configuration): Promise<void> {
        return this.api.resetPassword(param.token, param.resetPasswordRequest,  options).toPromise();
    }

    /**
     * Revert Email
     * @param param the request object
     */
    public revertEmailWithHttpInfo(param: AuthApiRevertEmailRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.revertEmailWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * Revert Email
     * @param param the request object
     */
    public revertEmail(param: AuthApiRevertEmailRequest, options?: Configuration): Promise<void> {
        return this.api.revertEmail(param.token,  options).toPromise();
    }

    /**
     * Social Auth
     * @param param the request object
     */
    public socialAuthWithHttpInfo(param: AuthApiSocialAuthRequest, options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        return this.api.socialAuthWithHttpInfo(param.socialAuthRequest,  options).toPromise();
    }

    /**
     * Social Auth
     * @param param the request object
     */
    public socialAuth(param: AuthApiSocialAuthRequest, options?: Configuration): Promise<TokenResponse> {
        return this.api.socialAuth(param.socialAuthRequest,  options).toPromise();
    }

    /**
     * Verify Audience
     * @param param the request object
     */
    public verifyAudienceWithHttpInfo(param: AuthApiVerifyAudienceRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.verifyAudienceWithHttpInfo(param.token, param.verifyAudienceRequest,  options).toPromise();
    }

    /**
     * Verify Audience
     * @param param the request object
     */
    public verifyAudience(param: AuthApiVerifyAudienceRequest, options?: Configuration): Promise<number> {
        return this.api.verifyAudience(param.token, param.verifyAudienceRequest,  options).toPromise();
    }

    /**
     * Verify Change Email
     * @param param the request object
     */
    public verifyChangeEmailWithHttpInfo(param: AuthApiVerifyChangeEmailRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.verifyChangeEmailWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * Verify Change Email
     * @param param the request object
     */
    public verifyChangeEmail(param: AuthApiVerifyChangeEmailRequest, options?: Configuration): Promise<void> {
        return this.api.verifyChangeEmail(param.token,  options).toPromise();
    }

}

import { ObservableCommentsApi } from "./ObservableAPI";
import type { CommentsApiRequestFactory, CommentsApiResponseProcessor} from "../apis/CommentsApi";

export interface CommentsApiDeleteCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApideleteComment
     */
    commentId: number
}

export interface CommentsApiDeleteCommentReplyRequest {
    /**
     *
     * @type number
     * @memberof CommentsApideleteCommentReply
     */
    replyId: number
}

export interface CommentsApiListingCommentRepliesRequest {
    /**
     *
     * @type number
     * @memberof CommentsApilistingCommentReplies
     */
    commentId: number
    /**
     *
     * @type number
     * @memberof CommentsApilistingCommentReplies
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof CommentsApilistingCommentReplies
     */
    page?: number
}

export interface CommentsApiPinCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApipinComment
     */
    commentId: number
}

export interface CommentsApiReplyCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApireplyComment
     */
    commentId: number
    /**
     *
     * @type CreateCommentReplyRequest
     * @memberof CommentsApireplyComment
     */
    createCommentReplyRequest?: CreateCommentReplyRequest
}

export interface CommentsApiUnpinCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApiunpinComment
     */
    commentId: number
}

export interface CommentsApiUpdateCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApiupdateComment
     */
    commentId: number
    /**
     *
     * @type UpdateEventCommentRequest
     * @memberof CommentsApiupdateComment
     */
    updateEventCommentRequest?: UpdateEventCommentRequest
}

export interface CommentsApiUpdateCommentReplyRequest {
    /**
     *
     * @type number
     * @memberof CommentsApiupdateCommentReply
     */
    replyId: number
    /**
     *
     * @type UpdateCommentReplyRequest
     * @memberof CommentsApiupdateCommentReply
     */
    updateCommentReplyRequest?: UpdateCommentReplyRequest
}

export interface CommentsApiVoteCommentRequest {
    /**
     *
     * @type number
     * @memberof CommentsApivoteComment
     */
    commentId: number
    /**
     *
     * @type VoteCommentRequest
     * @memberof CommentsApivoteComment
     */
    voteCommentRequest?: VoteCommentRequest
}

export class ObjectCommentsApi {
    private api: ObservableCommentsApi

    public constructor(configuration: Configuration, requestFactory?: CommentsApiRequestFactory, responseProcessor?: CommentsApiResponseProcessor) {
        this.api = new ObservableCommentsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete Comment
     * @param param the request object
     */
    public deleteCommentWithHttpInfo(param: CommentsApiDeleteCommentRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteCommentWithHttpInfo(param.commentId,  options).toPromise();
    }

    /**
     * Delete Comment
     * @param param the request object
     */
    public deleteComment(param: CommentsApiDeleteCommentRequest, options?: Configuration): Promise<void> {
        return this.api.deleteComment(param.commentId,  options).toPromise();
    }

    /**
     * Delete Comment Reply
     * @param param the request object
     */
    public deleteCommentReplyWithHttpInfo(param: CommentsApiDeleteCommentReplyRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteCommentReplyWithHttpInfo(param.replyId,  options).toPromise();
    }

    /**
     * Delete Comment Reply
     * @param param the request object
     */
    public deleteCommentReply(param: CommentsApiDeleteCommentReplyRequest, options?: Configuration): Promise<void> {
        return this.api.deleteCommentReply(param.replyId,  options).toPromise();
    }

    /**
     * Listing Comment Replies
     * @param param the request object
     */
    public listingCommentRepliesWithHttpInfo(param: CommentsApiListingCommentRepliesRequest, options?: Configuration): Promise<HttpInfo<ListingCommentRepliesResponse>> {
        return this.api.listingCommentRepliesWithHttpInfo(param.commentId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Comment Replies
     * @param param the request object
     */
    public listingCommentReplies(param: CommentsApiListingCommentRepliesRequest, options?: Configuration): Promise<ListingCommentRepliesResponse> {
        return this.api.listingCommentReplies(param.commentId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Pin Comment
     * @param param the request object
     */
    public pinCommentWithHttpInfo(param: CommentsApiPinCommentRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.pinCommentWithHttpInfo(param.commentId,  options).toPromise();
    }

    /**
     * Pin Comment
     * @param param the request object
     */
    public pinComment(param: CommentsApiPinCommentRequest, options?: Configuration): Promise<number> {
        return this.api.pinComment(param.commentId,  options).toPromise();
    }

    /**
     * Reply Comment
     * @param param the request object
     */
    public replyCommentWithHttpInfo(param: CommentsApiReplyCommentRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.replyCommentWithHttpInfo(param.commentId, param.createCommentReplyRequest,  options).toPromise();
    }

    /**
     * Reply Comment
     * @param param the request object
     */
    public replyComment(param: CommentsApiReplyCommentRequest, options?: Configuration): Promise<number> {
        return this.api.replyComment(param.commentId, param.createCommentReplyRequest,  options).toPromise();
    }

    /**
     * Unpin Comment
     * @param param the request object
     */
    public unpinCommentWithHttpInfo(param: CommentsApiUnpinCommentRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.unpinCommentWithHttpInfo(param.commentId,  options).toPromise();
    }

    /**
     * Unpin Comment
     * @param param the request object
     */
    public unpinComment(param: CommentsApiUnpinCommentRequest, options?: Configuration): Promise<void> {
        return this.api.unpinComment(param.commentId,  options).toPromise();
    }

    /**
     * Update Comment
     * @param param the request object
     */
    public updateCommentWithHttpInfo(param: CommentsApiUpdateCommentRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.updateCommentWithHttpInfo(param.commentId, param.updateEventCommentRequest,  options).toPromise();
    }

    /**
     * Update Comment
     * @param param the request object
     */
    public updateComment(param: CommentsApiUpdateCommentRequest, options?: Configuration): Promise<number> {
        return this.api.updateComment(param.commentId, param.updateEventCommentRequest,  options).toPromise();
    }

    /**
     * Update Comment Reply
     * @param param the request object
     */
    public updateCommentReplyWithHttpInfo(param: CommentsApiUpdateCommentReplyRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.updateCommentReplyWithHttpInfo(param.replyId, param.updateCommentReplyRequest,  options).toPromise();
    }

    /**
     * Update Comment Reply
     * @param param the request object
     */
    public updateCommentReply(param: CommentsApiUpdateCommentReplyRequest, options?: Configuration): Promise<number> {
        return this.api.updateCommentReply(param.replyId, param.updateCommentReplyRequest,  options).toPromise();
    }

    /**
     * Vote Comment
     * @param param the request object
     */
    public voteCommentWithHttpInfo(param: CommentsApiVoteCommentRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.voteCommentWithHttpInfo(param.commentId, param.voteCommentRequest,  options).toPromise();
    }

    /**
     * Vote Comment
     * @param param the request object
     */
    public voteComment(param: CommentsApiVoteCommentRequest, options?: Configuration): Promise<number> {
        return this.api.voteComment(param.commentId, param.voteCommentRequest,  options).toPromise();
    }

}

import { ObservableDefaultApi } from "./ObservableAPI";
import type { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiHealthcheckHealthcheckGetRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Healthcheck
     * @param param the request object
     */
    public healthcheckHealthcheckGetWithHttpInfo(param: DefaultApiHealthcheckHealthcheckGetRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.healthcheckHealthcheckGetWithHttpInfo( options).toPromise();
    }

    /**
     * Healthcheck
     * @param param the request object
     */
    public healthcheckHealthcheckGet(param: DefaultApiHealthcheckHealthcheckGetRequest = {}, options?: Configuration): Promise<void> {
        return this.api.healthcheckHealthcheckGet( options).toPromise();
    }

}

import { ObservableEventsApi } from "./ObservableAPI";
import type { EventsApiRequestFactory, EventsApiResponseProcessor} from "../apis/EventsApi";

export interface EventsApiCommentEventRequest {
    /**
     *
     * @type number
     * @memberof EventsApicommentEvent
     */
    eventId: number
    /**
     *
     * @type CommentEventRequest
     * @memberof EventsApicommentEvent
     */
    commentEventRequest?: CommentEventRequest
}

export interface EventsApiCreateEventBookmarkRequest {
    /**
     *
     * @type number
     * @memberof EventsApicreateEventBookmark
     */
    eventId: number
}

export interface EventsApiDeleteEventBookmarkRequest {
    /**
     *
     * @type number
     * @memberof EventsApideleteEventBookmark
     */
    eventId: number
}

export interface EventsApiDeleteManualCheckInRequest {
    /**
     *
     * @type number
     * @memberof EventsApideleteManualCheckIn
     */
    checkInId: number
}

export interface EventsApiFeedbackEventRequest {
    /**
     *
     * @type number
     * @memberof EventsApifeedbackEvent
     */
    eventId: number
    /**
     *
     * @type FeedbackEventRequest
     * @memberof EventsApifeedbackEvent
     */
    feedbackEventRequest?: FeedbackEventRequest
}

export interface EventsApiGenerateEventAiRequest {
    /**
     *
     * @type GenerateEventAIRequest
     * @memberof EventsApigenerateEventAi
     */
    generateEventAIRequest?: GenerateEventAIRequest
}

export interface EventsApiGetDraftEventRequest {
}

export interface EventsApiGetEventDetailRequest {
    /**
     *
     * @type string
     * @memberof EventsApigetEventDetail
     */
    slug: string
}

export interface EventsApiGetEventIdBySlugRequest {
    /**
     *
     * @type string
     * @memberof EventsApigetEventIdBySlug
     */
    slug: string
}

export interface EventsApiListingEventCommentsRequest {
    /**
     *
     * @type number
     * @memberof EventsApilistingEventComments
     */
    eventId: number
    /**
     *
     * @type number
     * @memberof EventsApilistingEventComments
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingEventComments
     */
    page?: number
}

export interface EventsApiListingEventOptionsRequest {
}

export interface EventsApiListingEventPurchasedTicketsRequest {
    /**
     *
     * @type string
     * @memberof EventsApilistingEventPurchasedTickets
     */
    slug: string
    /**
     *
     * @type string
     * @memberof EventsApilistingEventPurchasedTickets
     */
    keyword?: string
    /**
     *
     * @type boolean
     * @memberof EventsApilistingEventPurchasedTickets
     */
    isCheckedIn?: boolean
    /**
     *
     * @type number
     * @memberof EventsApilistingEventPurchasedTickets
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingEventPurchasedTickets
     */
    page?: number
}

export interface EventsApiListingEventRankRequest {
}

export interface EventsApiListingFeedbackCriteriaRequest {
    /**
     *
     * @type number
     * @memberof EventsApilistingFeedbackCriteria
     */
    eventId: number
}

export interface EventsApiListingFeedbacksRequest {
    /**
     *
     * @type number
     * @memberof EventsApilistingFeedbacks
     */
    eventId: number
    /**
     *
     * @type number
     * @memberof EventsApilistingFeedbacks
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingFeedbacks
     */
    page?: number
}

export interface EventsApiListingMyEventsRequest {
    /**
     *
     * @type string
     * @memberof EventsApilistingMyEvents
     */
    keyword?: string
    /**
     *
     * @type MyEventStatusCode
     * @memberof EventsApilistingMyEvents
     */
    status?: MyEventStatusCode
    /**
     *
     * @type number
     * @memberof EventsApilistingMyEvents
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingMyEvents
     */
    page?: number
}

export interface EventsApiListingRecommendationEventsRequest {
    /**
     *
     * @type string
     * @memberof EventsApilistingRecommendationEvents
     */
    keyword?: string
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isOnline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isOffline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isApplyOngoing?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isApplyEnded?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isToday?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isFree?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingRecommendationEvents
     */
    isPaid?: boolean
    /**
     *
     * @type Array&lt;JobTypeCode&gt;
     * @memberof EventsApilistingRecommendationEvents
     */
    jobTypeCodes?: Array<JobTypeCode>
    /**
     *
     * @type Array&lt;IndustryCode&gt;
     * @memberof EventsApilistingRecommendationEvents
     */
    industryCodes?: Array<IndustryCode>
    /**
     *
     * @type Array&lt;string&gt;
     * @memberof EventsApilistingRecommendationEvents
     */
    cityCodes?: Array<string>
    /**
     *
     * @type Array&lt;number&gt;
     * @memberof EventsApilistingRecommendationEvents
     */
    tags?: Array<number>
    /**
     *
     * @type string
     * @memberof EventsApilistingRecommendationEvents
     */
    startAtFrom?: string
    /**
     *
     * @type string
     * @memberof EventsApilistingRecommendationEvents
     */
    startAtTo?: string
    /**
     *
     * @type number
     * @memberof EventsApilistingRecommendationEvents
     */
    organizationId?: number
    /**
     *
     * @type EventSortByCode
     * @memberof EventsApilistingRecommendationEvents
     */
    sortBy?: EventSortByCode
    /**
     *
     * @type number
     * @memberof EventsApilistingRecommendationEvents
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingRecommendationEvents
     */
    page?: number
}

export interface EventsApiListingRelatedEventsRequest {
    /**
     *
     * @type string
     * @memberof EventsApilistingRelatedEvents
     */
    slug: string
}

export interface EventsApiListingTicketsOfEventRequest {
    /**
     *
     * @type number
     * @memberof EventsApilistingTicketsOfEvent
     */
    eventId: number
}

export interface EventsApiListingTrendingEventsRequest {
    /**
     *
     * @type string
     * @memberof EventsApilistingTrendingEvents
     */
    keyword?: string
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isOnline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isOffline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isApplyOngoing?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isApplyEnded?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isToday?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isFree?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApilistingTrendingEvents
     */
    isPaid?: boolean
    /**
     *
     * @type Array&lt;JobTypeCode&gt;
     * @memberof EventsApilistingTrendingEvents
     */
    jobTypeCodes?: Array<JobTypeCode>
    /**
     *
     * @type Array&lt;IndustryCode&gt;
     * @memberof EventsApilistingTrendingEvents
     */
    industryCodes?: Array<IndustryCode>
    /**
     *
     * @type Array&lt;string&gt;
     * @memberof EventsApilistingTrendingEvents
     */
    cityCodes?: Array<string>
    /**
     *
     * @type Array&lt;number&gt;
     * @memberof EventsApilistingTrendingEvents
     */
    tags?: Array<number>
    /**
     *
     * @type string
     * @memberof EventsApilistingTrendingEvents
     */
    startAtFrom?: string
    /**
     *
     * @type string
     * @memberof EventsApilistingTrendingEvents
     */
    startAtTo?: string
    /**
     *
     * @type number
     * @memberof EventsApilistingTrendingEvents
     */
    organizationId?: number
    /**
     *
     * @type EventSortByCode
     * @memberof EventsApilistingTrendingEvents
     */
    sortBy?: EventSortByCode
    /**
     *
     * @type number
     * @memberof EventsApilistingTrendingEvents
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApilistingTrendingEvents
     */
    page?: number
}

export interface EventsApiManualCheckInRequest {
    /**
     *
     * @type ManualCheckInRequest
     * @memberof EventsApimanualCheckIn
     */
    manualCheckInRequest?: ManualCheckInRequest
}

export interface EventsApiPublishEventRequest {
    /**
     *
     * @type number
     * @memberof EventsApipublishEvent
     */
    eventId: number
    /**
     *
     * @type PublishEventRequest
     * @memberof EventsApipublishEvent
     */
    publishEventRequest?: PublishEventRequest
}

export interface EventsApiQrCheckInRequest {
    /**
     *
     * @type number
     * @memberof EventsApiqrCheckIn
     */
    eventId: number
    /**
     *
     * @type QRCheckInRequest
     * @memberof EventsApiqrCheckIn
     */
    qRCheckInRequest?: QRCheckInRequest
}

export interface EventsApiSaveDraftEventRequest {
    /**
     *
     * @type number
     * @memberof EventsApisaveDraftEvent
     */
    eventId: number
    /**
     *
     * @type SaveDraftEventRequest
     * @memberof EventsApisaveDraftEvent
     */
    saveDraftEventRequest?: SaveDraftEventRequest
}

export interface EventsApiSearchEventsRequest {
    /**
     *
     * @type string
     * @memberof EventsApisearchEvents
     */
    keyword?: string
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isOnline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isOffline?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isApplyOngoing?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isApplyEnded?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isToday?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isFree?: boolean
    /**
     *
     * @type boolean
     * @memberof EventsApisearchEvents
     */
    isPaid?: boolean
    /**
     *
     * @type Array&lt;JobTypeCode&gt;
     * @memberof EventsApisearchEvents
     */
    jobTypeCodes?: Array<JobTypeCode>
    /**
     *
     * @type Array&lt;IndustryCode&gt;
     * @memberof EventsApisearchEvents
     */
    industryCodes?: Array<IndustryCode>
    /**
     *
     * @type Array&lt;string&gt;
     * @memberof EventsApisearchEvents
     */
    cityCodes?: Array<string>
    /**
     *
     * @type Array&lt;number&gt;
     * @memberof EventsApisearchEvents
     */
    tags?: Array<number>
    /**
     *
     * @type string
     * @memberof EventsApisearchEvents
     */
    startAtFrom?: string
    /**
     *
     * @type string
     * @memberof EventsApisearchEvents
     */
    startAtTo?: string
    /**
     *
     * @type number
     * @memberof EventsApisearchEvents
     */
    organizationId?: number
    /**
     *
     * @type EventSortByCode
     * @memberof EventsApisearchEvents
     */
    sortBy?: EventSortByCode
    /**
     *
     * @type number
     * @memberof EventsApisearchEvents
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof EventsApisearchEvents
     */
    page?: number
}

export class ObjectEventsApi {
    private api: ObservableEventsApi

    public constructor(configuration: Configuration, requestFactory?: EventsApiRequestFactory, responseProcessor?: EventsApiResponseProcessor) {
        this.api = new ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Comment Event
     * @param param the request object
     */
    public commentEventWithHttpInfo(param: EventsApiCommentEventRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.commentEventWithHttpInfo(param.eventId, param.commentEventRequest,  options).toPromise();
    }

    /**
     * Comment Event
     * @param param the request object
     */
    public commentEvent(param: EventsApiCommentEventRequest, options?: Configuration): Promise<number> {
        return this.api.commentEvent(param.eventId, param.commentEventRequest,  options).toPromise();
    }

    /**
     * Create Event Bookmark
     * @param param the request object
     */
    public createEventBookmarkWithHttpInfo(param: EventsApiCreateEventBookmarkRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createEventBookmarkWithHttpInfo(param.eventId,  options).toPromise();
    }

    /**
     * Create Event Bookmark
     * @param param the request object
     */
    public createEventBookmark(param: EventsApiCreateEventBookmarkRequest, options?: Configuration): Promise<number> {
        return this.api.createEventBookmark(param.eventId,  options).toPromise();
    }

    /**
     * Delete Event Bookmark
     * @param param the request object
     */
    public deleteEventBookmarkWithHttpInfo(param: EventsApiDeleteEventBookmarkRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteEventBookmarkWithHttpInfo(param.eventId,  options).toPromise();
    }

    /**
     * Delete Event Bookmark
     * @param param the request object
     */
    public deleteEventBookmark(param: EventsApiDeleteEventBookmarkRequest, options?: Configuration): Promise<void> {
        return this.api.deleteEventBookmark(param.eventId,  options).toPromise();
    }

    /**
     * Delete Manual Check In
     * @param param the request object
     */
    public deleteManualCheckInWithHttpInfo(param: EventsApiDeleteManualCheckInRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteManualCheckInWithHttpInfo(param.checkInId,  options).toPromise();
    }

    /**
     * Delete Manual Check In
     * @param param the request object
     */
    public deleteManualCheckIn(param: EventsApiDeleteManualCheckInRequest, options?: Configuration): Promise<void> {
        return this.api.deleteManualCheckIn(param.checkInId,  options).toPromise();
    }

    /**
     * Feedback Event
     * @param param the request object
     */
    public feedbackEventWithHttpInfo(param: EventsApiFeedbackEventRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.feedbackEventWithHttpInfo(param.eventId, param.feedbackEventRequest,  options).toPromise();
    }

    /**
     * Feedback Event
     * @param param the request object
     */
    public feedbackEvent(param: EventsApiFeedbackEventRequest, options?: Configuration): Promise<number> {
        return this.api.feedbackEvent(param.eventId, param.feedbackEventRequest,  options).toPromise();
    }

    /**
     * Generate Event Ai
     * @param param the request object
     */
    public generateEventAiWithHttpInfo(param: EventsApiGenerateEventAiRequest = {}, options?: Configuration): Promise<HttpInfo<GenerateEventAIResponse>> {
        return this.api.generateEventAiWithHttpInfo(param.generateEventAIRequest,  options).toPromise();
    }

    /**
     * Generate Event Ai
     * @param param the request object
     */
    public generateEventAi(param: EventsApiGenerateEventAiRequest = {}, options?: Configuration): Promise<GenerateEventAIResponse> {
        return this.api.generateEventAi(param.generateEventAIRequest,  options).toPromise();
    }

    /**
     * Get Draft Event
     * @param param the request object
     */
    public getDraftEventWithHttpInfo(param: EventsApiGetDraftEventRequest = {}, options?: Configuration): Promise<HttpInfo<GetDraftEventResponse>> {
        return this.api.getDraftEventWithHttpInfo( options).toPromise();
    }

    /**
     * Get Draft Event
     * @param param the request object
     */
    public getDraftEvent(param: EventsApiGetDraftEventRequest = {}, options?: Configuration): Promise<GetDraftEventResponse> {
        return this.api.getDraftEvent( options).toPromise();
    }

    /**
     * Get Event Detail
     * @param param the request object
     */
    public getEventDetailWithHttpInfo(param: EventsApiGetEventDetailRequest, options?: Configuration): Promise<HttpInfo<GetEventDetailResponse>> {
        return this.api.getEventDetailWithHttpInfo(param.slug,  options).toPromise();
    }

    /**
     * Get Event Detail
     * @param param the request object
     */
    public getEventDetail(param: EventsApiGetEventDetailRequest, options?: Configuration): Promise<GetEventDetailResponse> {
        return this.api.getEventDetail(param.slug,  options).toPromise();
    }

    /**
     * Get Event Id By Slug
     * @param param the request object
     */
    public getEventIdBySlugWithHttpInfo(param: EventsApiGetEventIdBySlugRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.getEventIdBySlugWithHttpInfo(param.slug,  options).toPromise();
    }

    /**
     * Get Event Id By Slug
     * @param param the request object
     */
    public getEventIdBySlug(param: EventsApiGetEventIdBySlugRequest, options?: Configuration): Promise<number> {
        return this.api.getEventIdBySlug(param.slug,  options).toPromise();
    }

    /**
     * Listing Event Comments
     * @param param the request object
     */
    public listingEventCommentsWithHttpInfo(param: EventsApiListingEventCommentsRequest, options?: Configuration): Promise<HttpInfo<ListingEventCommentsResponse>> {
        return this.api.listingEventCommentsWithHttpInfo(param.eventId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Event Comments
     * @param param the request object
     */
    public listingEventComments(param: EventsApiListingEventCommentsRequest, options?: Configuration): Promise<ListingEventCommentsResponse> {
        return this.api.listingEventComments(param.eventId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Event Options
     * @param param the request object
     */
    public listingEventOptionsWithHttpInfo(param: EventsApiListingEventOptionsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingEventOptionsResponse>> {
        return this.api.listingEventOptionsWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Event Options
     * @param param the request object
     */
    public listingEventOptions(param: EventsApiListingEventOptionsRequest = {}, options?: Configuration): Promise<ListingEventOptionsResponse> {
        return this.api.listingEventOptions( options).toPromise();
    }

    /**
     * Listing Event Purchased Tickets
     * @param param the request object
     */
    public listingEventPurchasedTicketsWithHttpInfo(param: EventsApiListingEventPurchasedTicketsRequest, options?: Configuration): Promise<HttpInfo<ListingEventPurchasedTicketsResponse>> {
        return this.api.listingEventPurchasedTicketsWithHttpInfo(param.slug, param.keyword, param.isCheckedIn, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Event Purchased Tickets
     * @param param the request object
     */
    public listingEventPurchasedTickets(param: EventsApiListingEventPurchasedTicketsRequest, options?: Configuration): Promise<ListingEventPurchasedTicketsResponse> {
        return this.api.listingEventPurchasedTickets(param.slug, param.keyword, param.isCheckedIn, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Event Rank
     * @param param the request object
     */
    public listingEventRankWithHttpInfo(param: EventsApiListingEventRankRequest = {}, options?: Configuration): Promise<HttpInfo<ListingEventRankResponse>> {
        return this.api.listingEventRankWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Event Rank
     * @param param the request object
     */
    public listingEventRank(param: EventsApiListingEventRankRequest = {}, options?: Configuration): Promise<ListingEventRankResponse> {
        return this.api.listingEventRank( options).toPromise();
    }

    /**
     * Listing Feedback Criteria
     * @param param the request object
     */
    public listingFeedbackCriteriaWithHttpInfo(param: EventsApiListingFeedbackCriteriaRequest, options?: Configuration): Promise<HttpInfo<ListingFeedbackCriteriaResponse>> {
        return this.api.listingFeedbackCriteriaWithHttpInfo(param.eventId,  options).toPromise();
    }

    /**
     * Listing Feedback Criteria
     * @param param the request object
     */
    public listingFeedbackCriteria(param: EventsApiListingFeedbackCriteriaRequest, options?: Configuration): Promise<ListingFeedbackCriteriaResponse> {
        return this.api.listingFeedbackCriteria(param.eventId,  options).toPromise();
    }

    /**
     * Listing Feedbacks
     * @param param the request object
     */
    public listingFeedbacksWithHttpInfo(param: EventsApiListingFeedbacksRequest, options?: Configuration): Promise<HttpInfo<ListingFeedbacksResponse>> {
        return this.api.listingFeedbacksWithHttpInfo(param.eventId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Feedbacks
     * @param param the request object
     */
    public listingFeedbacks(param: EventsApiListingFeedbacksRequest, options?: Configuration): Promise<ListingFeedbacksResponse> {
        return this.api.listingFeedbacks(param.eventId, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing My Events
     * @param param the request object
     */
    public listingMyEventsWithHttpInfo(param: EventsApiListingMyEventsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingMyEventsResponse>> {
        return this.api.listingMyEventsWithHttpInfo(param.keyword, param.status, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing My Events
     * @param param the request object
     */
    public listingMyEvents(param: EventsApiListingMyEventsRequest = {}, options?: Configuration): Promise<ListingMyEventsResponse> {
        return this.api.listingMyEvents(param.keyword, param.status, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Recommendation Events
     * @param param the request object
     */
    public listingRecommendationEventsWithHttpInfo(param: EventsApiListingRecommendationEventsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingRecommendationEventsResponse>> {
        return this.api.listingRecommendationEventsWithHttpInfo(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Recommendation Events
     * @param param the request object
     */
    public listingRecommendationEvents(param: EventsApiListingRecommendationEventsRequest = {}, options?: Configuration): Promise<ListingRecommendationEventsResponse> {
        return this.api.listingRecommendationEvents(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Related Events
     * @param param the request object
     */
    public listingRelatedEventsWithHttpInfo(param: EventsApiListingRelatedEventsRequest, options?: Configuration): Promise<HttpInfo<ListingRelatedEventsResponse>> {
        return this.api.listingRelatedEventsWithHttpInfo(param.slug,  options).toPromise();
    }

    /**
     * Listing Related Events
     * @param param the request object
     */
    public listingRelatedEvents(param: EventsApiListingRelatedEventsRequest, options?: Configuration): Promise<ListingRelatedEventsResponse> {
        return this.api.listingRelatedEvents(param.slug,  options).toPromise();
    }

    /**
     * Listing Tickets Of Event
     * @param param the request object
     */
    public listingTicketsOfEventWithHttpInfo(param: EventsApiListingTicketsOfEventRequest, options?: Configuration): Promise<HttpInfo<Array<TicketItem>>> {
        return this.api.listingTicketsOfEventWithHttpInfo(param.eventId,  options).toPromise();
    }

    /**
     * Listing Tickets Of Event
     * @param param the request object
     */
    public listingTicketsOfEvent(param: EventsApiListingTicketsOfEventRequest, options?: Configuration): Promise<Array<TicketItem>> {
        return this.api.listingTicketsOfEvent(param.eventId,  options).toPromise();
    }

    /**
     * Listing Trending Events
     * @param param the request object
     */
    public listingTrendingEventsWithHttpInfo(param: EventsApiListingTrendingEventsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingTrendingEventsResponse>> {
        return this.api.listingTrendingEventsWithHttpInfo(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Trending Events
     * @param param the request object
     */
    public listingTrendingEvents(param: EventsApiListingTrendingEventsRequest = {}, options?: Configuration): Promise<ListingTrendingEventsResponse> {
        return this.api.listingTrendingEvents(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Manual Check In
     * @param param the request object
     */
    public manualCheckInWithHttpInfo(param: EventsApiManualCheckInRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.manualCheckInWithHttpInfo(param.manualCheckInRequest,  options).toPromise();
    }

    /**
     * Manual Check In
     * @param param the request object
     */
    public manualCheckIn(param: EventsApiManualCheckInRequest = {}, options?: Configuration): Promise<number> {
        return this.api.manualCheckIn(param.manualCheckInRequest,  options).toPromise();
    }

    /**
     * Publish Event
     * @param param the request object
     */
    public publishEventWithHttpInfo(param: EventsApiPublishEventRequest, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.publishEventWithHttpInfo(param.eventId, param.publishEventRequest,  options).toPromise();
    }

    /**
     * Publish Event
     * @param param the request object
     */
    public publishEvent(param: EventsApiPublishEventRequest, options?: Configuration): Promise<string> {
        return this.api.publishEvent(param.eventId, param.publishEventRequest,  options).toPromise();
    }

    /**
     * Qr Check In
     * @param param the request object
     */
    public qrCheckInWithHttpInfo(param: EventsApiQrCheckInRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.qrCheckInWithHttpInfo(param.eventId, param.qRCheckInRequest,  options).toPromise();
    }

    /**
     * Qr Check In
     * @param param the request object
     */
    public qrCheckIn(param: EventsApiQrCheckInRequest, options?: Configuration): Promise<number> {
        return this.api.qrCheckIn(param.eventId, param.qRCheckInRequest,  options).toPromise();
    }

    /**
     * Save Draft Event
     * @param param the request object
     */
    public saveDraftEventWithHttpInfo(param: EventsApiSaveDraftEventRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.saveDraftEventWithHttpInfo(param.eventId, param.saveDraftEventRequest,  options).toPromise();
    }

    /**
     * Save Draft Event
     * @param param the request object
     */
    public saveDraftEvent(param: EventsApiSaveDraftEventRequest, options?: Configuration): Promise<number> {
        return this.api.saveDraftEvent(param.eventId, param.saveDraftEventRequest,  options).toPromise();
    }

    /**
     * Search Events
     * @param param the request object
     */
    public searchEventsWithHttpInfo(param: EventsApiSearchEventsRequest = {}, options?: Configuration): Promise<HttpInfo<SearchEventsResponse>> {
        return this.api.searchEventsWithHttpInfo(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Search Events
     * @param param the request object
     */
    public searchEvents(param: EventsApiSearchEventsRequest = {}, options?: Configuration): Promise<SearchEventsResponse> {
        return this.api.searchEvents(param.keyword, param.isOnline, param.isOffline, param.isApplyOngoing, param.isApplyEnded, param.isToday, param.isFree, param.isPaid, param.jobTypeCodes, param.industryCodes, param.cityCodes, param.tags, param.startAtFrom, param.startAtTo, param.organizationId, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

}

import { ObservableFeedbacksApi } from "./ObservableAPI";
import type { FeedbacksApiRequestFactory, FeedbacksApiResponseProcessor} from "../apis/FeedbacksApi";

export interface FeedbacksApiDeleteFeedbackRequest {
    /**
     *
     * @type number
     * @memberof FeedbacksApideleteFeedback
     */
    feedbackId: number
}

export interface FeedbacksApiUpdateFeedbackRequest {
    /**
     *
     * @type number
     * @memberof FeedbacksApiupdateFeedback
     */
    feedbackId: number
    /**
     *
     * @type UpdateFeedbackRequest
     * @memberof FeedbacksApiupdateFeedback
     */
    updateFeedbackRequest?: UpdateFeedbackRequest
}

export class ObjectFeedbacksApi {
    private api: ObservableFeedbacksApi

    public constructor(configuration: Configuration, requestFactory?: FeedbacksApiRequestFactory, responseProcessor?: FeedbacksApiResponseProcessor) {
        this.api = new ObservableFeedbacksApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete Feedback
     * @param param the request object
     */
    public deleteFeedbackWithHttpInfo(param: FeedbacksApiDeleteFeedbackRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteFeedbackWithHttpInfo(param.feedbackId,  options).toPromise();
    }

    /**
     * Delete Feedback
     * @param param the request object
     */
    public deleteFeedback(param: FeedbacksApiDeleteFeedbackRequest, options?: Configuration): Promise<void> {
        return this.api.deleteFeedback(param.feedbackId,  options).toPromise();
    }

    /**
     * Update Feedback
     * @param param the request object
     */
    public updateFeedbackWithHttpInfo(param: FeedbacksApiUpdateFeedbackRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.updateFeedbackWithHttpInfo(param.feedbackId, param.updateFeedbackRequest,  options).toPromise();
    }

    /**
     * Update Feedback
     * @param param the request object
     */
    public updateFeedback(param: FeedbacksApiUpdateFeedbackRequest, options?: Configuration): Promise<number> {
        return this.api.updateFeedback(param.feedbackId, param.updateFeedbackRequest,  options).toPromise();
    }

}

import { ObservableNotificationsApi } from "./ObservableAPI";
import type { NotificationsApiRequestFactory, NotificationsApiResponseProcessor} from "../apis/NotificationsApi";

export interface NotificationsApiRegisterNotificationDeviceTokenRequest {
    /**
     *
     * @type RegisterNotificationDeviceTokenRequest
     * @memberof NotificationsApiregisterNotificationDeviceToken
     */
    registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest
}

export interface NotificationsApiRemoveNotificationDeviceTokenRequest {
    /**
     *
     * @type string
     * @memberof NotificationsApiremoveNotificationDeviceToken
     */
    fcmToken: string
}

export class ObjectNotificationsApi {
    private api: ObservableNotificationsApi

    public constructor(configuration: Configuration, requestFactory?: NotificationsApiRequestFactory, responseProcessor?: NotificationsApiResponseProcessor) {
        this.api = new ObservableNotificationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param param the request object
     */
    public registerNotificationDeviceTokenWithHttpInfo(param: NotificationsApiRegisterNotificationDeviceTokenRequest = {}, options?: Configuration): Promise<HttpInfo<RegisterNotificationDeviceTokenResponse>> {
        return this.api.registerNotificationDeviceTokenWithHttpInfo(param.registerNotificationDeviceTokenRequest,  options).toPromise();
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param param the request object
     */
    public registerNotificationDeviceToken(param: NotificationsApiRegisterNotificationDeviceTokenRequest = {}, options?: Configuration): Promise<RegisterNotificationDeviceTokenResponse> {
        return this.api.registerNotificationDeviceToken(param.registerNotificationDeviceTokenRequest,  options).toPromise();
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param param the request object
     */
    public removeNotificationDeviceTokenWithHttpInfo(param: NotificationsApiRemoveNotificationDeviceTokenRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.removeNotificationDeviceTokenWithHttpInfo(param.fcmToken,  options).toPromise();
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param param the request object
     */
    public removeNotificationDeviceToken(param: NotificationsApiRemoveNotificationDeviceTokenRequest, options?: Configuration): Promise<void> {
        return this.api.removeNotificationDeviceToken(param.fcmToken,  options).toPromise();
    }

}

import { ObservableOrganizationsApi } from "./ObservableAPI";
import type { OrganizationsApiRequestFactory, OrganizationsApiResponseProcessor} from "../apis/OrganizationsApi";

export interface OrganizationsApiAnalyzeEventCheckInsRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApianalyzeEventCheckIns
     */
    slug: string
}

export interface OrganizationsApiAnalyzeEventTicketsRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApianalyzeEventTickets
     */
    slug: string
    /**
     * The granularity of the data.
     * @type &#39;daily&#39; | &#39;weekly&#39; | &#39;monthly&#39;
     * @memberof OrganizationsApianalyzeEventTickets
     */
    granularity?: 'daily' | 'weekly' | 'monthly'
}

export interface OrganizationsApiCreateOrganizationFollowRequest {
    /**
     *
     * @type number
     * @memberof OrganizationsApicreateOrganizationFollow
     */
    organizationId: number
}

export interface OrganizationsApiDeleteOrganizationFollowRequest {
    /**
     *
     * @type number
     * @memberof OrganizationsApideleteOrganizationFollow
     */
    organizationId: number
}

export interface OrganizationsApiDownloadAttendeesCsvRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    keyword?: string
    /**
     *
     * @type Date
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    applyAtFrom?: Date
    /**
     *
     * @type Date
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    applyAtTo?: Date
    /**
     *
     * @type boolean
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    isCheckedIn?: boolean
    /**
     *
     * @type JobTypeCode
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    jobTypeCode?: JobTypeCode
    /**
     *
     * @type IndustryCode
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    industryCode?: IndustryCode
    /**
     *
     * @type AttendeeSortByCode
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    sortBy?: AttendeeSortByCode
    /**
     *
     * @type boolean
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    withFilter?: boolean
    /**
     *
     * @type number
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    page?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApidownloadAttendeesCsv
     */
    perPage?: number
}

export interface OrganizationsApiGetAttendeeDetailRequest {
    /**
     *
     * @type number
     * @memberof OrganizationsApigetAttendeeDetail
     */
    attendeeId: number
}

export interface OrganizationsApiGetOrganizationDashboardRequest {
}

export interface OrganizationsApiGetOrganizationDetailRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApigetOrganizationDetail
     */
    organizationSlug: string
}

export interface OrganizationsApiGetTagStatsRequest {
}

export interface OrganizationsApiGetTicketStatsRequest {
    /**
     *
     * @type number
     * @memberof OrganizationsApigetTicketStats
     */
    eventId?: number
    /**
     *
     * @type Date
     * @memberof OrganizationsApigetTicketStats
     */
    startDate?: Date
    /**
     *
     * @type Date
     * @memberof OrganizationsApigetTicketStats
     */
    endDate?: Date
    /**
     *
     * @type TicketTypeCode
     * @memberof OrganizationsApigetTicketStats
     */
    ticketType?: TicketTypeCode
    /**
     *
     * @type TicketStatusCode
     * @memberof OrganizationsApigetTicketStats
     */
    ticketStatus?: TicketStatusCode
}

export interface OrganizationsApiListingAttendeesRequest {
    /**
     * Event slug
     * @type string
     * @memberof OrganizationsApilistingAttendees
     */
    slug?: string
    /**
     * Event ID
     * @type number
     * @memberof OrganizationsApilistingAttendees
     */
    eventId?: number
    /**
     * user name | event name | phone | email
     * @type string
     * @memberof OrganizationsApilistingAttendees
     */
    keyword?: string
    /**
     *
     * @type Date
     * @memberof OrganizationsApilistingAttendees
     */
    applyAtFrom?: Date
    /**
     *
     * @type Date
     * @memberof OrganizationsApilistingAttendees
     */
    applyAtTo?: Date
    /**
     *
     * @type boolean
     * @memberof OrganizationsApilistingAttendees
     */
    isCheckedIn?: boolean
    /**
     *
     * @type JobTypeCode
     * @memberof OrganizationsApilistingAttendees
     */
    jobTypeCode?: JobTypeCode
    /**
     *
     * @type IndustryCode
     * @memberof OrganizationsApilistingAttendees
     */
    industryCode?: IndustryCode
    /**
     *
     * @type TicketTypeCode
     * @memberof OrganizationsApilistingAttendees
     */
    ticketTypeCode?: TicketTypeCode
    /**
     *
     * @type AttendeeSortByCode
     * @memberof OrganizationsApilistingAttendees
     */
    sortBy?: AttendeeSortByCode
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendees
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendees
     */
    page?: number
}

export interface OrganizationsApiListingAttendeesRankingRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    keyword?: string
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    eventId?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    month?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    year?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    page?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingAttendeesRanking
     */
    perPage?: number
}

export interface OrganizationsApiListingOrganizationEventsRequest {
    /**
     *
     * @type string
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    keyword?: string
    /**
     *
     * @type Array&lt;number&gt;
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    tags?: Array<number>
    /**
     *
     * @type Array&lt;EventMeetingToolCode&gt;
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    meetingToolCodes?: Array<EventMeetingToolCode>
    /**
     *
     * @type string
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    startAtFrom?: string
    /**
     *
     * @type string
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    startAtTo?: string
    /**
     *
     * @type Array&lt;EventStatusCode&gt;
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    eventStatus?: Array<EventStatusCode>
    /**
     *
     * @type EventTimeStatusCode
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    timeStatus?: EventTimeStatusCode
    /**
     *
     * @type ManageEventSortByCode
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    sortBy?: ManageEventSortByCode
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingOrganizationEvents
     */
    page?: number
}

export interface OrganizationsApiListingOrganizationEventsTimelineRequest {
}

export interface OrganizationsApiListingRandomOrganizationsRequest {
}

export interface OrganizationsApiListingTopOrganizationEventsRequest {
    /**
     *
     * @type number
     * @memberof OrganizationsApilistingTopOrganizationEvents
     */
    organizationId: number
}

export interface OrganizationsApiRegisterOrganizationRequest {
    /**
     *
     * @type RegisterOrganizationRequest
     * @memberof OrganizationsApiregisterOrganization
     */
    registerOrganizationRequest?: RegisterOrganizationRequest
}

export interface OrganizationsApiTrackUserActionsRequest {
    /**
     *
     * @type TrackingTimeRangeCode
     * @memberof OrganizationsApitrackUserActions
     */
    timeRange?: TrackingTimeRangeCode
    /**
     *
     * @type TrackingTimeRangeCode
     * @memberof OrganizationsApitrackUserActions
     */
    groupBy?: TrackingTimeRangeCode
    /**
     *
     * @type Array&lt;UserActionTypeCode&gt;
     * @memberof OrganizationsApitrackUserActions
     */
    actionTypes?: Array<UserActionTypeCode>
    /**
     *
     * @type number
     * @memberof OrganizationsApitrackUserActions
     */
    eventId?: number
    /**
     *
     * @type number
     * @memberof OrganizationsApitrackUserActions
     */
    topN?: number
}

export class ObjectOrganizationsApi {
    private api: ObservableOrganizationsApi

    public constructor(configuration: Configuration, requestFactory?: OrganizationsApiRequestFactory, responseProcessor?: OrganizationsApiResponseProcessor) {
        this.api = new ObservableOrganizationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Analyze Event Check Ins
     * @param param the request object
     */
    public analyzeEventCheckInsWithHttpInfo(param: OrganizationsApiAnalyzeEventCheckInsRequest, options?: Configuration): Promise<HttpInfo<AnalyzeEventCheckInsResponse>> {
        return this.api.analyzeEventCheckInsWithHttpInfo(param.slug,  options).toPromise();
    }

    /**
     * Analyze Event Check Ins
     * @param param the request object
     */
    public analyzeEventCheckIns(param: OrganizationsApiAnalyzeEventCheckInsRequest, options?: Configuration): Promise<AnalyzeEventCheckInsResponse> {
        return this.api.analyzeEventCheckIns(param.slug,  options).toPromise();
    }

    /**
     * Analyze Event Tickets
     * @param param the request object
     */
    public analyzeEventTicketsWithHttpInfo(param: OrganizationsApiAnalyzeEventTicketsRequest, options?: Configuration): Promise<HttpInfo<AnalyzeEventTicketsResponse>> {
        return this.api.analyzeEventTicketsWithHttpInfo(param.slug, param.granularity,  options).toPromise();
    }

    /**
     * Analyze Event Tickets
     * @param param the request object
     */
    public analyzeEventTickets(param: OrganizationsApiAnalyzeEventTicketsRequest, options?: Configuration): Promise<AnalyzeEventTicketsResponse> {
        return this.api.analyzeEventTickets(param.slug, param.granularity,  options).toPromise();
    }

    /**
     * Create Organization Follow
     * @param param the request object
     */
    public createOrganizationFollowWithHttpInfo(param: OrganizationsApiCreateOrganizationFollowRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createOrganizationFollowWithHttpInfo(param.organizationId,  options).toPromise();
    }

    /**
     * Create Organization Follow
     * @param param the request object
     */
    public createOrganizationFollow(param: OrganizationsApiCreateOrganizationFollowRequest, options?: Configuration): Promise<number> {
        return this.api.createOrganizationFollow(param.organizationId,  options).toPromise();
    }

    /**
     * Delete Organization Follow
     * @param param the request object
     */
    public deleteOrganizationFollowWithHttpInfo(param: OrganizationsApiDeleteOrganizationFollowRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteOrganizationFollowWithHttpInfo(param.organizationId,  options).toPromise();
    }

    /**
     * Delete Organization Follow
     * @param param the request object
     */
    public deleteOrganizationFollow(param: OrganizationsApiDeleteOrganizationFollowRequest, options?: Configuration): Promise<void> {
        return this.api.deleteOrganizationFollow(param.organizationId,  options).toPromise();
    }

    /**
     * Download Attendees Csv
     * @param param the request object
     */
    public downloadAttendeesCsvWithHttpInfo(param: OrganizationsApiDownloadAttendeesCsvRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.downloadAttendeesCsvWithHttpInfo(param.keyword, param.applyAtFrom, param.applyAtTo, param.isCheckedIn, param.jobTypeCode, param.industryCode, param.sortBy, param.withFilter, param.page, param.perPage,  options).toPromise();
    }

    /**
     * Download Attendees Csv
     * @param param the request object
     */
    public downloadAttendeesCsv(param: OrganizationsApiDownloadAttendeesCsvRequest = {}, options?: Configuration): Promise<void> {
        return this.api.downloadAttendeesCsv(param.keyword, param.applyAtFrom, param.applyAtTo, param.isCheckedIn, param.jobTypeCode, param.industryCode, param.sortBy, param.withFilter, param.page, param.perPage,  options).toPromise();
    }

    /**
     * Get Attendee Detail
     * @param param the request object
     */
    public getAttendeeDetailWithHttpInfo(param: OrganizationsApiGetAttendeeDetailRequest, options?: Configuration): Promise<HttpInfo<GetAttendeeDetailResponse>> {
        return this.api.getAttendeeDetailWithHttpInfo(param.attendeeId,  options).toPromise();
    }

    /**
     * Get Attendee Detail
     * @param param the request object
     */
    public getAttendeeDetail(param: OrganizationsApiGetAttendeeDetailRequest, options?: Configuration): Promise<GetAttendeeDetailResponse> {
        return this.api.getAttendeeDetail(param.attendeeId,  options).toPromise();
    }

    /**
     * Get Organization Dashboard
     * @param param the request object
     */
    public getOrganizationDashboardWithHttpInfo(param: OrganizationsApiGetOrganizationDashboardRequest = {}, options?: Configuration): Promise<HttpInfo<GetOrganizationDashboardResponse>> {
        return this.api.getOrganizationDashboardWithHttpInfo( options).toPromise();
    }

    /**
     * Get Organization Dashboard
     * @param param the request object
     */
    public getOrganizationDashboard(param: OrganizationsApiGetOrganizationDashboardRequest = {}, options?: Configuration): Promise<GetOrganizationDashboardResponse> {
        return this.api.getOrganizationDashboard( options).toPromise();
    }

    /**
     * Get Organization Detail
     * @param param the request object
     */
    public getOrganizationDetailWithHttpInfo(param: OrganizationsApiGetOrganizationDetailRequest, options?: Configuration): Promise<HttpInfo<GetOrganizationDetailResponse>> {
        return this.api.getOrganizationDetailWithHttpInfo(param.organizationSlug,  options).toPromise();
    }

    /**
     * Get Organization Detail
     * @param param the request object
     */
    public getOrganizationDetail(param: OrganizationsApiGetOrganizationDetailRequest, options?: Configuration): Promise<GetOrganizationDetailResponse> {
        return this.api.getOrganizationDetail(param.organizationSlug,  options).toPromise();
    }

    /**
     * Get Tag Stats
     * @param param the request object
     */
    public getTagStatsWithHttpInfo(param: OrganizationsApiGetTagStatsRequest = {}, options?: Configuration): Promise<HttpInfo<GetTagStatsResponse>> {
        return this.api.getTagStatsWithHttpInfo( options).toPromise();
    }

    /**
     * Get Tag Stats
     * @param param the request object
     */
    public getTagStats(param: OrganizationsApiGetTagStatsRequest = {}, options?: Configuration): Promise<GetTagStatsResponse> {
        return this.api.getTagStats( options).toPromise();
    }

    /**
     * Get Ticket Stats
     * @param param the request object
     */
    public getTicketStatsWithHttpInfo(param: OrganizationsApiGetTicketStatsRequest = {}, options?: Configuration): Promise<HttpInfo<GetTicketStatsResponse>> {
        return this.api.getTicketStatsWithHttpInfo(param.eventId, param.startDate, param.endDate, param.ticketType, param.ticketStatus,  options).toPromise();
    }

    /**
     * Get Ticket Stats
     * @param param the request object
     */
    public getTicketStats(param: OrganizationsApiGetTicketStatsRequest = {}, options?: Configuration): Promise<GetTicketStatsResponse> {
        return this.api.getTicketStats(param.eventId, param.startDate, param.endDate, param.ticketType, param.ticketStatus,  options).toPromise();
    }

    /**
     * Listing Attendees
     * @param param the request object
     */
    public listingAttendeesWithHttpInfo(param: OrganizationsApiListingAttendeesRequest = {}, options?: Configuration): Promise<HttpInfo<ListingAttendeesResponse>> {
        return this.api.listingAttendeesWithHttpInfo(param.slug, param.eventId, param.keyword, param.applyAtFrom, param.applyAtTo, param.isCheckedIn, param.jobTypeCode, param.industryCode, param.ticketTypeCode, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Attendees
     * @param param the request object
     */
    public listingAttendees(param: OrganizationsApiListingAttendeesRequest = {}, options?: Configuration): Promise<ListingAttendeesResponse> {
        return this.api.listingAttendees(param.slug, param.eventId, param.keyword, param.applyAtFrom, param.applyAtTo, param.isCheckedIn, param.jobTypeCode, param.industryCode, param.ticketTypeCode, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Attendees Ranking
     * @param param the request object
     */
    public listingAttendeesRankingWithHttpInfo(param: OrganizationsApiListingAttendeesRankingRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ListingAttendeesRankingItem>>> {
        return this.api.listingAttendeesRankingWithHttpInfo(param.keyword, param.eventId, param.month, param.year, param.page, param.perPage,  options).toPromise();
    }

    /**
     * Listing Attendees Ranking
     * @param param the request object
     */
    public listingAttendeesRanking(param: OrganizationsApiListingAttendeesRankingRequest = {}, options?: Configuration): Promise<Array<ListingAttendeesRankingItem>> {
        return this.api.listingAttendeesRanking(param.keyword, param.eventId, param.month, param.year, param.page, param.perPage,  options).toPromise();
    }

    /**
     * Listing Organization Events
     * @param param the request object
     */
    public listingOrganizationEventsWithHttpInfo(param: OrganizationsApiListingOrganizationEventsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingOrganizationEventsResponse>> {
        return this.api.listingOrganizationEventsWithHttpInfo(param.keyword, param.tags, param.meetingToolCodes, param.startAtFrom, param.startAtTo, param.eventStatus, param.timeStatus, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Organization Events
     * @param param the request object
     */
    public listingOrganizationEvents(param: OrganizationsApiListingOrganizationEventsRequest = {}, options?: Configuration): Promise<ListingOrganizationEventsResponse> {
        return this.api.listingOrganizationEvents(param.keyword, param.tags, param.meetingToolCodes, param.startAtFrom, param.startAtTo, param.eventStatus, param.timeStatus, param.sortBy, param.perPage, param.page,  options).toPromise();
    }

    /**
     * Listing Organization Events Timeline
     * @param param the request object
     */
    public listingOrganizationEventsTimelineWithHttpInfo(param: OrganizationsApiListingOrganizationEventsTimelineRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ListingOrganizationEventsTimelineItem>>> {
        return this.api.listingOrganizationEventsTimelineWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Organization Events Timeline
     * @param param the request object
     */
    public listingOrganizationEventsTimeline(param: OrganizationsApiListingOrganizationEventsTimelineRequest = {}, options?: Configuration): Promise<Array<ListingOrganizationEventsTimelineItem>> {
        return this.api.listingOrganizationEventsTimeline( options).toPromise();
    }

    /**
     * Listing Random Organizations
     * @param param the request object
     */
    public listingRandomOrganizationsWithHttpInfo(param: OrganizationsApiListingRandomOrganizationsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingRandomOrganizationsResponse>> {
        return this.api.listingRandomOrganizationsWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Random Organizations
     * @param param the request object
     */
    public listingRandomOrganizations(param: OrganizationsApiListingRandomOrganizationsRequest = {}, options?: Configuration): Promise<ListingRandomOrganizationsResponse> {
        return this.api.listingRandomOrganizations( options).toPromise();
    }

    /**
     * Listing Top Organization Events
     * @param param the request object
     */
    public listingTopOrganizationEventsWithHttpInfo(param: OrganizationsApiListingTopOrganizationEventsRequest, options?: Configuration): Promise<HttpInfo<ListingTopOrganizationEventsResponse>> {
        return this.api.listingTopOrganizationEventsWithHttpInfo(param.organizationId,  options).toPromise();
    }

    /**
     * Listing Top Organization Events
     * @param param the request object
     */
    public listingTopOrganizationEvents(param: OrganizationsApiListingTopOrganizationEventsRequest, options?: Configuration): Promise<ListingTopOrganizationEventsResponse> {
        return this.api.listingTopOrganizationEvents(param.organizationId,  options).toPromise();
    }

    /**
     * Register Organization
     * @param param the request object
     */
    public registerOrganizationWithHttpInfo(param: OrganizationsApiRegisterOrganizationRequest = {}, options?: Configuration): Promise<HttpInfo<RegisterOrganizationResponse>> {
        return this.api.registerOrganizationWithHttpInfo(param.registerOrganizationRequest,  options).toPromise();
    }

    /**
     * Register Organization
     * @param param the request object
     */
    public registerOrganization(param: OrganizationsApiRegisterOrganizationRequest = {}, options?: Configuration): Promise<RegisterOrganizationResponse> {
        return this.api.registerOrganization(param.registerOrganizationRequest,  options).toPromise();
    }

    /**
     * Track User Actions
     * @param param the request object
     */
    public trackUserActionsWithHttpInfo(param: OrganizationsApiTrackUserActionsRequest = {}, options?: Configuration): Promise<HttpInfo<TrackUserActionsResponse>> {
        return this.api.trackUserActionsWithHttpInfo(param.timeRange, param.groupBy, param.actionTypes, param.eventId, param.topN,  options).toPromise();
    }

    /**
     * Track User Actions
     * @param param the request object
     */
    public trackUserActions(param: OrganizationsApiTrackUserActionsRequest = {}, options?: Configuration): Promise<TrackUserActionsResponse> {
        return this.api.trackUserActions(param.timeRange, param.groupBy, param.actionTypes, param.eventId, param.topN,  options).toPromise();
    }

}

import { ObservableSpeakersApi } from "./ObservableAPI";
import type { SpeakersApiRequestFactory, SpeakersApiResponseProcessor} from "../apis/SpeakersApi";

export interface SpeakersApiGetSpeakerDetailRequest {
    /**
     *
     * @type string
     * @memberof SpeakersApigetSpeakerDetail
     */
    slug: string
}

export interface SpeakersApiListingRandomSpeakersRequest {
}

export class ObjectSpeakersApi {
    private api: ObservableSpeakersApi

    public constructor(configuration: Configuration, requestFactory?: SpeakersApiRequestFactory, responseProcessor?: SpeakersApiResponseProcessor) {
        this.api = new ObservableSpeakersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Speaker Detail
     * @param param the request object
     */
    public getSpeakerDetailWithHttpInfo(param: SpeakersApiGetSpeakerDetailRequest, options?: Configuration): Promise<HttpInfo<GetSpeakerDetailResponse>> {
        return this.api.getSpeakerDetailWithHttpInfo(param.slug,  options).toPromise();
    }

    /**
     * Get Speaker Detail
     * @param param the request object
     */
    public getSpeakerDetail(param: SpeakersApiGetSpeakerDetailRequest, options?: Configuration): Promise<GetSpeakerDetailResponse> {
        return this.api.getSpeakerDetail(param.slug,  options).toPromise();
    }

    /**
     * Listing Random Speakers
     * @param param the request object
     */
    public listingRandomSpeakersWithHttpInfo(param: SpeakersApiListingRandomSpeakersRequest = {}, options?: Configuration): Promise<HttpInfo<ListingRandomSpeakersResponse>> {
        return this.api.listingRandomSpeakersWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Random Speakers
     * @param param the request object
     */
    public listingRandomSpeakers(param: SpeakersApiListingRandomSpeakersRequest = {}, options?: Configuration): Promise<ListingRandomSpeakersResponse> {
        return this.api.listingRandomSpeakers( options).toPromise();
    }

}

import { ObservableSurveysApi } from "./ObservableAPI";
import type { SurveysApiRequestFactory, SurveysApiResponseProcessor} from "../apis/SurveysApi";

export interface SurveysApiCreateSurveyRequest {
    /**
     *
     * @type CreateSurveyRequest
     * @memberof SurveysApicreateSurvey
     */
    createSurveyRequest?: CreateSurveyRequest
}

export interface SurveysApiListingSurveyOptionsRequest {
}

export class ObjectSurveysApi {
    private api: ObservableSurveysApi

    public constructor(configuration: Configuration, requestFactory?: SurveysApiRequestFactory, responseProcessor?: SurveysApiResponseProcessor) {
        this.api = new ObservableSurveysApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Survey
     * @param param the request object
     */
    public createSurveyWithHttpInfo(param: SurveysApiCreateSurveyRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createSurveyWithHttpInfo(param.createSurveyRequest,  options).toPromise();
    }

    /**
     * Create Survey
     * @param param the request object
     */
    public createSurvey(param: SurveysApiCreateSurveyRequest = {}, options?: Configuration): Promise<number> {
        return this.api.createSurvey(param.createSurveyRequest,  options).toPromise();
    }

    /**
     * Listing Survey Options
     * @param param the request object
     */
    public listingSurveyOptionsWithHttpInfo(param: SurveysApiListingSurveyOptionsRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ListingSurveyOptionsItem>>> {
        return this.api.listingSurveyOptionsWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Survey Options
     * @param param the request object
     */
    public listingSurveyOptions(param: SurveysApiListingSurveyOptionsRequest = {}, options?: Configuration): Promise<Array<ListingSurveyOptionsItem>> {
        return this.api.listingSurveyOptions( options).toPromise();
    }

}

import { ObservableTagsApi } from "./ObservableAPI";
import type { TagsApiRequestFactory, TagsApiResponseProcessor} from "../apis/TagsApi";

export interface TagsApiListingTagRankRequest {
}

export interface TagsApiListingTagsRequest {
}

export class ObjectTagsApi {
    private api: ObservableTagsApi

    public constructor(configuration: Configuration, requestFactory?: TagsApiRequestFactory, responseProcessor?: TagsApiResponseProcessor) {
        this.api = new ObservableTagsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Listing Tag Rank
     * @param param the request object
     */
    public listingTagRankWithHttpInfo(param: TagsApiListingTagRankRequest = {}, options?: Configuration): Promise<HttpInfo<ListingTagRankResponse>> {
        return this.api.listingTagRankWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Tag Rank
     * @param param the request object
     */
    public listingTagRank(param: TagsApiListingTagRankRequest = {}, options?: Configuration): Promise<ListingTagRankResponse> {
        return this.api.listingTagRank( options).toPromise();
    }

    /**
     * Listing Tags
     * @param param the request object
     */
    public listingTagsWithHttpInfo(param: TagsApiListingTagsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingTagsResponse>> {
        return this.api.listingTagsWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Tags
     * @param param the request object
     */
    public listingTags(param: TagsApiListingTagsRequest = {}, options?: Configuration): Promise<ListingTagsResponse> {
        return this.api.listingTags( options).toPromise();
    }

}

import { ObservableTargetsApi } from "./ObservableAPI";
import type { TargetsApiRequestFactory, TargetsApiResponseProcessor} from "../apis/TargetsApi";

export interface TargetsApiCreateTargetRequest {
    /**
     *
     * @type CreateTargetRequest
     * @memberof TargetsApicreateTarget
     */
    createTargetRequest?: CreateTargetRequest
}

export interface TargetsApiListingTargetOptionsRequest {
}

export class ObjectTargetsApi {
    private api: ObservableTargetsApi

    public constructor(configuration: Configuration, requestFactory?: TargetsApiRequestFactory, responseProcessor?: TargetsApiResponseProcessor) {
        this.api = new ObservableTargetsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Target
     * @param param the request object
     */
    public createTargetWithHttpInfo(param: TargetsApiCreateTargetRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createTargetWithHttpInfo(param.createTargetRequest,  options).toPromise();
    }

    /**
     * Create Target
     * @param param the request object
     */
    public createTarget(param: TargetsApiCreateTargetRequest = {}, options?: Configuration): Promise<number> {
        return this.api.createTarget(param.createTargetRequest,  options).toPromise();
    }

    /**
     * Listing Target Options
     * @param param the request object
     */
    public listingTargetOptionsWithHttpInfo(param: TargetsApiListingTargetOptionsRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ListingTargetOptionsItem>>> {
        return this.api.listingTargetOptionsWithHttpInfo( options).toPromise();
    }

    /**
     * Listing Target Options
     * @param param the request object
     */
    public listingTargetOptions(param: TargetsApiListingTargetOptionsRequest = {}, options?: Configuration): Promise<Array<ListingTargetOptionsItem>> {
        return this.api.listingTargetOptions( options).toPromise();
    }

}

import { ObservableTicketsApi } from "./ObservableAPI";
import type { TicketsApiRequestFactory, TicketsApiResponseProcessor} from "../apis/TicketsApi";

export interface TicketsApiCancelTicketsRequest {
    /**
     *
     * @type CancelTicketsRequest
     * @memberof TicketsApicancelTickets
     */
    cancelTicketsRequest?: CancelTicketsRequest
}

export interface TicketsApiCreateTicketRequest {
    /**
     *
     * @type CreateTicketRequest
     * @memberof TicketsApicreateTicket
     */
    createTicketRequest?: CreateTicketRequest
}

export interface TicketsApiDeleteTicketRequest {
    /**
     *
     * @type number
     * @memberof TicketsApideleteTicket
     */
    ticketId: number
}

export interface TicketsApiGetDraftTicketRequest {
    /**
     *
     * @type number
     * @memberof TicketsApigetDraftTicket
     */
    ticketId: number
}

export interface TicketsApiUpdateTicketRequest {
    /**
     *
     * @type number
     * @memberof TicketsApiupdateTicket
     */
    ticketId: number
    /**
     *
     * @type UpdateTicketRequest
     * @memberof TicketsApiupdateTicket
     */
    updateTicketRequest?: UpdateTicketRequest
}

export class ObjectTicketsApi {
    private api: ObservableTicketsApi

    public constructor(configuration: Configuration, requestFactory?: TicketsApiRequestFactory, responseProcessor?: TicketsApiResponseProcessor) {
        this.api = new ObservableTicketsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Cancel Tickets
     * @param param the request object
     */
    public cancelTicketsWithHttpInfo(param: TicketsApiCancelTicketsRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.cancelTicketsWithHttpInfo(param.cancelTicketsRequest,  options).toPromise();
    }

    /**
     * Cancel Tickets
     * @param param the request object
     */
    public cancelTickets(param: TicketsApiCancelTicketsRequest = {}, options?: Configuration): Promise<number> {
        return this.api.cancelTickets(param.cancelTicketsRequest,  options).toPromise();
    }

    /**
     * Create Ticket
     * @param param the request object
     */
    public createTicketWithHttpInfo(param: TicketsApiCreateTicketRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.createTicketWithHttpInfo(param.createTicketRequest,  options).toPromise();
    }

    /**
     * Create Ticket
     * @param param the request object
     */
    public createTicket(param: TicketsApiCreateTicketRequest = {}, options?: Configuration): Promise<number> {
        return this.api.createTicket(param.createTicketRequest,  options).toPromise();
    }

    /**
     * Delete Ticket
     * @param param the request object
     */
    public deleteTicketWithHttpInfo(param: TicketsApiDeleteTicketRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.deleteTicketWithHttpInfo(param.ticketId,  options).toPromise();
    }

    /**
     * Delete Ticket
     * @param param the request object
     */
    public deleteTicket(param: TicketsApiDeleteTicketRequest, options?: Configuration): Promise<void> {
        return this.api.deleteTicket(param.ticketId,  options).toPromise();
    }

    /**
     * Get Draft Ticket
     * @param param the request object
     */
    public getDraftTicketWithHttpInfo(param: TicketsApiGetDraftTicketRequest, options?: Configuration): Promise<HttpInfo<Ticket>> {
        return this.api.getDraftTicketWithHttpInfo(param.ticketId,  options).toPromise();
    }

    /**
     * Get Draft Ticket
     * @param param the request object
     */
    public getDraftTicket(param: TicketsApiGetDraftTicketRequest, options?: Configuration): Promise<Ticket> {
        return this.api.getDraftTicket(param.ticketId,  options).toPromise();
    }

    /**
     * Update Ticket
     * @param param the request object
     */
    public updateTicketWithHttpInfo(param: TicketsApiUpdateTicketRequest, options?: Configuration): Promise<HttpInfo<TicketItem>> {
        return this.api.updateTicketWithHttpInfo(param.ticketId, param.updateTicketRequest,  options).toPromise();
    }

    /**
     * Update Ticket
     * @param param the request object
     */
    public updateTicket(param: TicketsApiUpdateTicketRequest, options?: Configuration): Promise<TicketItem> {
        return this.api.updateTicket(param.ticketId, param.updateTicketRequest,  options).toPromise();
    }

}

import { ObservableTransactionsApi } from "./ObservableAPI";
import type { TransactionsApiRequestFactory, TransactionsApiResponseProcessor} from "../apis/TransactionsApi";

export interface TransactionsApiGetTransactionStatusCountsRequest {
}

export interface TransactionsApiHandleTransactionRequest {
}

export interface TransactionsApiListingMyTransactionsRequest {
    /**
     *
     * @type string
     * @memberof TransactionsApilistingMyTransactions
     */
    keyword?: string
    /**
     *
     * @type TransactionStatusCode
     * @memberof TransactionsApilistingMyTransactions
     */
    status?: TransactionStatusCode
    /**
     *
     * @type number
     * @memberof TransactionsApilistingMyTransactions
     */
    transactionId?: number
    /**
     *
     * @type number
     * @memberof TransactionsApilistingMyTransactions
     */
    page?: number
    /**
     *
     * @type number
     * @memberof TransactionsApilistingMyTransactions
     */
    perPage?: number
}

export class ObjectTransactionsApi {
    private api: ObservableTransactionsApi

    public constructor(configuration: Configuration, requestFactory?: TransactionsApiRequestFactory, responseProcessor?: TransactionsApiResponseProcessor) {
        this.api = new ObservableTransactionsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Transaction Status Counts
     * @param param the request object
     */
    public getTransactionStatusCountsWithHttpInfo(param: TransactionsApiGetTransactionStatusCountsRequest = {}, options?: Configuration): Promise<HttpInfo<GetTransactionStatusCountsResponse>> {
        return this.api.getTransactionStatusCountsWithHttpInfo( options).toPromise();
    }

    /**
     * Get Transaction Status Counts
     * @param param the request object
     */
    public getTransactionStatusCounts(param: TransactionsApiGetTransactionStatusCountsRequest = {}, options?: Configuration): Promise<GetTransactionStatusCountsResponse> {
        return this.api.getTransactionStatusCounts( options).toPromise();
    }

    /**
     * Handle Transaction
     * @param param the request object
     */
    public handleTransactionWithHttpInfo(param: TransactionsApiHandleTransactionRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.handleTransactionWithHttpInfo( options).toPromise();
    }

    /**
     * Handle Transaction
     * @param param the request object
     */
    public handleTransaction(param: TransactionsApiHandleTransactionRequest = {}, options?: Configuration): Promise<void> {
        return this.api.handleTransaction( options).toPromise();
    }

    /**
     * Listing My Transactions
     * @param param the request object
     */
    public listingMyTransactionsWithHttpInfo(param: TransactionsApiListingMyTransactionsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingMyTransactionsResponse>> {
        return this.api.listingMyTransactionsWithHttpInfo(param.keyword, param.status, param.transactionId, param.page, param.perPage,  options).toPromise();
    }

    /**
     * Listing My Transactions
     * @param param the request object
     */
    public listingMyTransactions(param: TransactionsApiListingMyTransactionsRequest = {}, options?: Configuration): Promise<ListingMyTransactionsResponse> {
        return this.api.listingMyTransactions(param.keyword, param.status, param.transactionId, param.page, param.perPage,  options).toPromise();
    }

}

import { ObservableUsersApi } from "./ObservableAPI";
import type { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";

export interface UsersApiGetTotalUnreadNotificationsRequest {
}

export interface UsersApiListingNotificationsRequest {
    /**
     *
     * @type number
     * @memberof UsersApilistingNotifications
     */
    perPage?: number
    /**
     *
     * @type number
     * @memberof UsersApilistingNotifications
     */
    page?: number
    /**
     *
     * @type boolean
     * @memberof UsersApilistingNotifications
     */
    isRead?: boolean
}

export interface UsersApiMarkNotificationAsReadRequest {
    /**
     *
     * @type number
     * @memberof UsersApimarkNotificationAsRead
     */
    notificationId: number
}

export interface UsersApiUpdateAudienceRequest {
    /**
     *
     * @type UpdateUserRequest
     * @memberof UsersApiupdateAudience
     */
    updateUserRequest: UpdateUserRequest
}

export class ObjectUsersApi {
    private api: ObservableUsersApi

    public constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Total Unread Notifications
     * @param param the request object
     */
    public getTotalUnreadNotificationsWithHttpInfo(param: UsersApiGetTotalUnreadNotificationsRequest = {}, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.getTotalUnreadNotificationsWithHttpInfo( options).toPromise();
    }

    /**
     * Get Total Unread Notifications
     * @param param the request object
     */
    public getTotalUnreadNotifications(param: UsersApiGetTotalUnreadNotificationsRequest = {}, options?: Configuration): Promise<number> {
        return this.api.getTotalUnreadNotifications( options).toPromise();
    }

    /**
     * Listing Notifications
     * @param param the request object
     */
    public listingNotificationsWithHttpInfo(param: UsersApiListingNotificationsRequest = {}, options?: Configuration): Promise<HttpInfo<ListingNotificationsResponse>> {
        return this.api.listingNotificationsWithHttpInfo(param.perPage, param.page, param.isRead,  options).toPromise();
    }

    /**
     * Listing Notifications
     * @param param the request object
     */
    public listingNotifications(param: UsersApiListingNotificationsRequest = {}, options?: Configuration): Promise<ListingNotificationsResponse> {
        return this.api.listingNotifications(param.perPage, param.page, param.isRead,  options).toPromise();
    }

    /**
     * Mark Notification As Read
     * @param param the request object
     */
    public markNotificationAsReadWithHttpInfo(param: UsersApiMarkNotificationAsReadRequest, options?: Configuration): Promise<HttpInfo<number>> {
        return this.api.markNotificationAsReadWithHttpInfo(param.notificationId,  options).toPromise();
    }

    /**
     * Mark Notification As Read
     * @param param the request object
     */
    public markNotificationAsRead(param: UsersApiMarkNotificationAsReadRequest, options?: Configuration): Promise<number> {
        return this.api.markNotificationAsRead(param.notificationId,  options).toPromise();
    }

    /**
     * Update Audience
     * @param param the request object
     */
    public updateAudienceWithHttpInfo(param: UsersApiUpdateAudienceRequest, options?: Configuration): Promise<HttpInfo<GetMeResponse>> {
        return this.api.updateAudienceWithHttpInfo(param.updateUserRequest,  options).toPromise();
    }

    /**
     * Update Audience
     * @param param the request object
     */
    public updateAudience(param: UsersApiUpdateAudienceRequest, options?: Configuration): Promise<GetMeResponse> {
        return this.api.updateAudience(param.updateUserRequest,  options).toPromise();
    }

}
