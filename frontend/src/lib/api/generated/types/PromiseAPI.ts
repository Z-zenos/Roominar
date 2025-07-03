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
import type { CreateDraftEventRequest } from '../models/CreateDraftEventRequest';
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
import type { UpdateTicketRequest } from '../models/UpdateTicketRequest';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserActionTypeCode } from '../models/UserActionTypeCode';
import { ValidationError } from '../models/ValidationError';
import { ValidationErrorLocInner } from '../models/ValidationErrorLocInner';
import type { VerifyAudienceRequest } from '../models/VerifyAudienceRequest';
import type { VoteCommentRequest } from '../models/VoteCommentRequest';
import { VoteTypeCode } from '../models/VoteTypeCode';
import { ObservableApplicationsApi } from './ObservableAPI';

import type { ApplicationsApiRequestFactory, ApplicationsApiResponseProcessor} from "../apis/ApplicationsApi";
export class PromiseApplicationsApi {
    private api: ObservableApplicationsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ApplicationsApiRequestFactory,
        responseProcessor?: ApplicationsApiResponseProcessor
    ) {
        this.api = new ObservableApplicationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Application Checkout Session
     * @param createApplicationRequest
     */
    public createApplicationCheckoutSessionWithHttpInfo(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<HttpInfo<CreateApplicationCheckoutSessionResponse>> {
        const result = this.api.createApplicationCheckoutSessionWithHttpInfo(createApplicationRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Application Checkout Session
     * @param createApplicationRequest
     */
    public createApplicationCheckoutSession(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<CreateApplicationCheckoutSessionResponse> {
        const result = this.api.createApplicationCheckoutSession(createApplicationRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Free Application
     * @param createApplicationRequest
     */
    public createFreeApplicationWithHttpInfo(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.createFreeApplicationWithHttpInfo(createApplicationRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Free Application
     * @param createApplicationRequest
     */
    public createFreeApplication(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<string> {
        const result = this.api.createFreeApplication(createApplicationRequest, _options);
        return result.toPromise();
    }


}



import { ObservableAuthApi } from './ObservableAPI';

import type { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class PromiseAuthApi {
    private api: ObservableAuthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Change Password
     * @param changePasswordRequest
     */
    public changePasswordWithHttpInfo(changePasswordRequest?: ChangePasswordRequest, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.changePasswordWithHttpInfo(changePasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Change Password
     * @param changePasswordRequest
     */
    public changePassword(changePasswordRequest?: ChangePasswordRequest, _options?: Configuration): Promise<void> {
        const result = this.api.changePassword(changePasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Forgot Password
     * @param forgotPasswordRequest
     */
    public forgotPasswordWithHttpInfo(forgotPasswordRequest?: ForgotPasswordRequest, _options?: Configuration): Promise<HttpInfo<ForgotPasswordResponse>> {
        const result = this.api.forgotPasswordWithHttpInfo(forgotPasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Forgot Password
     * @param forgotPasswordRequest
     */
    public forgotPassword(forgotPasswordRequest?: ForgotPasswordRequest, _options?: Configuration): Promise<ForgotPasswordResponse> {
        const result = this.api.forgotPassword(forgotPasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Login
     * @param userAgent
     * @param loginRequest
     */
    public loginWithHttpInfo(userAgent?: string, loginRequest?: LoginRequest, _options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        const result = this.api.loginWithHttpInfo(userAgent, loginRequest, _options);
        return result.toPromise();
    }

    /**
     * Login
     * @param userAgent
     * @param loginRequest
     */
    public login(userAgent?: string, loginRequest?: LoginRequest, _options?: Configuration): Promise<TokenResponse> {
        const result = this.api.login(userAgent, loginRequest, _options);
        return result.toPromise();
    }

    /**
     * Log out user from the current device
     * Logout
     * @param logoutRequest
     */
    public logoutWithHttpInfo(logoutRequest?: LogoutRequest, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.logoutWithHttpInfo(logoutRequest, _options);
        return result.toPromise();
    }

    /**
     * Log out user from the current device
     * Logout
     * @param logoutRequest
     */
    public logout(logoutRequest?: LogoutRequest, _options?: Configuration): Promise<void> {
        const result = this.api.logout(logoutRequest, _options);
        return result.toPromise();
    }

    /**
     * Me
     */
    public meWithHttpInfo(_options?: Configuration): Promise<HttpInfo<GetMeResponse>> {
        const result = this.api.meWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Me
     */
    public me(_options?: Configuration): Promise<GetMeResponse> {
        const result = this.api.me(_options);
        return result.toPromise();
    }

    /**
     * Refresh Token
     * @param token
     */
    public refreshTokenWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        const result = this.api.refreshTokenWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * Refresh Token
     * @param token
     */
    public refreshToken(token: string, _options?: Configuration): Promise<TokenResponse> {
        const result = this.api.refreshToken(token, _options);
        return result.toPromise();
    }

    /**
     * Register Audience
     * @param registerAudienceRequest
     */
    public registerAudienceWithHttpInfo(registerAudienceRequest?: RegisterAudienceRequest, _options?: Configuration): Promise<HttpInfo<RegisterAudienceResponse>> {
        const result = this.api.registerAudienceWithHttpInfo(registerAudienceRequest, _options);
        return result.toPromise();
    }

    /**
     * Register Audience
     * @param registerAudienceRequest
     */
    public registerAudience(registerAudienceRequest?: RegisterAudienceRequest, _options?: Configuration): Promise<RegisterAudienceResponse> {
        const result = this.api.registerAudience(registerAudienceRequest, _options);
        return result.toPromise();
    }

    /**
     * Request Change Email
     * @param changeEmailRequest
     */
    public requestChangeEmailWithHttpInfo(changeEmailRequest?: ChangeEmailRequest, _options?: Configuration): Promise<HttpInfo<RequestChangeEmailResponse>> {
        const result = this.api.requestChangeEmailWithHttpInfo(changeEmailRequest, _options);
        return result.toPromise();
    }

    /**
     * Request Change Email
     * @param changeEmailRequest
     */
    public requestChangeEmail(changeEmailRequest?: ChangeEmailRequest, _options?: Configuration): Promise<RequestChangeEmailResponse> {
        const result = this.api.requestChangeEmail(changeEmailRequest, _options);
        return result.toPromise();
    }

    /**
     * Reset Password
     * @param token
     * @param resetPasswordRequest
     */
    public resetPasswordWithHttpInfo(token: string, resetPasswordRequest?: ResetPasswordRequest, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.resetPasswordWithHttpInfo(token, resetPasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Reset Password
     * @param token
     * @param resetPasswordRequest
     */
    public resetPassword(token: string, resetPasswordRequest?: ResetPasswordRequest, _options?: Configuration): Promise<void> {
        const result = this.api.resetPassword(token, resetPasswordRequest, _options);
        return result.toPromise();
    }

    /**
     * Revert Email
     * @param token
     */
    public revertEmailWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.revertEmailWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * Revert Email
     * @param token
     */
    public revertEmail(token: string, _options?: Configuration): Promise<void> {
        const result = this.api.revertEmail(token, _options);
        return result.toPromise();
    }

    /**
     * Social Auth
     * @param socialAuthRequest
     */
    public socialAuthWithHttpInfo(socialAuthRequest: SocialAuthRequest, _options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        const result = this.api.socialAuthWithHttpInfo(socialAuthRequest, _options);
        return result.toPromise();
    }

    /**
     * Social Auth
     * @param socialAuthRequest
     */
    public socialAuth(socialAuthRequest: SocialAuthRequest, _options?: Configuration): Promise<TokenResponse> {
        const result = this.api.socialAuth(socialAuthRequest, _options);
        return result.toPromise();
    }

    /**
     * Verify Audience
     * @param token
     * @param verifyAudienceRequest
     */
    public verifyAudienceWithHttpInfo(token: string, verifyAudienceRequest?: VerifyAudienceRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.verifyAudienceWithHttpInfo(token, verifyAudienceRequest, _options);
        return result.toPromise();
    }

    /**
     * Verify Audience
     * @param token
     * @param verifyAudienceRequest
     */
    public verifyAudience(token: string, verifyAudienceRequest?: VerifyAudienceRequest, _options?: Configuration): Promise<number> {
        const result = this.api.verifyAudience(token, verifyAudienceRequest, _options);
        return result.toPromise();
    }

    /**
     * Verify Change Email
     * @param token
     */
    public verifyChangeEmailWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.verifyChangeEmailWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * Verify Change Email
     * @param token
     */
    public verifyChangeEmail(token: string, _options?: Configuration): Promise<void> {
        const result = this.api.verifyChangeEmail(token, _options);
        return result.toPromise();
    }


}



import { ObservableCommentsApi } from './ObservableAPI';

import type { CommentsApiRequestFactory, CommentsApiResponseProcessor} from "../apis/CommentsApi";
export class PromiseCommentsApi {
    private api: ObservableCommentsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CommentsApiRequestFactory,
        responseProcessor?: CommentsApiResponseProcessor
    ) {
        this.api = new ObservableCommentsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete Comment
     * @param commentId
     */
    public deleteCommentWithHttpInfo(commentId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteCommentWithHttpInfo(commentId, _options);
        return result.toPromise();
    }

    /**
     * Delete Comment
     * @param commentId
     */
    public deleteComment(commentId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteComment(commentId, _options);
        return result.toPromise();
    }

    /**
     * Delete Comment Reply
     * @param replyId
     */
    public deleteCommentReplyWithHttpInfo(replyId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteCommentReplyWithHttpInfo(replyId, _options);
        return result.toPromise();
    }

    /**
     * Delete Comment Reply
     * @param replyId
     */
    public deleteCommentReply(replyId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteCommentReply(replyId, _options);
        return result.toPromise();
    }

    /**
     * Listing Comment Replies
     * @param commentId
     * @param perPage
     * @param page
     */
    public listingCommentRepliesWithHttpInfo(commentId: number, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingCommentRepliesResponse>> {
        const result = this.api.listingCommentRepliesWithHttpInfo(commentId, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Comment Replies
     * @param commentId
     * @param perPage
     * @param page
     */
    public listingCommentReplies(commentId: number, perPage?: number, page?: number, _options?: Configuration): Promise<ListingCommentRepliesResponse> {
        const result = this.api.listingCommentReplies(commentId, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Pin Comment
     * @param commentId
     */
    public pinCommentWithHttpInfo(commentId: number, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.pinCommentWithHttpInfo(commentId, _options);
        return result.toPromise();
    }

    /**
     * Pin Comment
     * @param commentId
     */
    public pinComment(commentId: number, _options?: Configuration): Promise<number> {
        const result = this.api.pinComment(commentId, _options);
        return result.toPromise();
    }

    /**
     * Reply Comment
     * @param commentId
     * @param createCommentReplyRequest
     */
    public replyCommentWithHttpInfo(commentId: number, createCommentReplyRequest?: CreateCommentReplyRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.replyCommentWithHttpInfo(commentId, createCommentReplyRequest, _options);
        return result.toPromise();
    }

    /**
     * Reply Comment
     * @param commentId
     * @param createCommentReplyRequest
     */
    public replyComment(commentId: number, createCommentReplyRequest?: CreateCommentReplyRequest, _options?: Configuration): Promise<number> {
        const result = this.api.replyComment(commentId, createCommentReplyRequest, _options);
        return result.toPromise();
    }

    /**
     * Unpin Comment
     * @param commentId
     */
    public unpinCommentWithHttpInfo(commentId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.unpinCommentWithHttpInfo(commentId, _options);
        return result.toPromise();
    }

    /**
     * Unpin Comment
     * @param commentId
     */
    public unpinComment(commentId: number, _options?: Configuration): Promise<void> {
        const result = this.api.unpinComment(commentId, _options);
        return result.toPromise();
    }

    /**
     * Update Comment
     * @param commentId
     * @param updateEventCommentRequest
     */
    public updateCommentWithHttpInfo(commentId: number, updateEventCommentRequest?: UpdateEventCommentRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.updateCommentWithHttpInfo(commentId, updateEventCommentRequest, _options);
        return result.toPromise();
    }

    /**
     * Update Comment
     * @param commentId
     * @param updateEventCommentRequest
     */
    public updateComment(commentId: number, updateEventCommentRequest?: UpdateEventCommentRequest, _options?: Configuration): Promise<number> {
        const result = this.api.updateComment(commentId, updateEventCommentRequest, _options);
        return result.toPromise();
    }

    /**
     * Update Comment Reply
     * @param replyId
     * @param updateCommentReplyRequest
     */
    public updateCommentReplyWithHttpInfo(replyId: number, updateCommentReplyRequest?: UpdateCommentReplyRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.updateCommentReplyWithHttpInfo(replyId, updateCommentReplyRequest, _options);
        return result.toPromise();
    }

    /**
     * Update Comment Reply
     * @param replyId
     * @param updateCommentReplyRequest
     */
    public updateCommentReply(replyId: number, updateCommentReplyRequest?: UpdateCommentReplyRequest, _options?: Configuration): Promise<number> {
        const result = this.api.updateCommentReply(replyId, updateCommentReplyRequest, _options);
        return result.toPromise();
    }

    /**
     * Vote Comment
     * @param commentId
     * @param voteCommentRequest
     */
    public voteCommentWithHttpInfo(commentId: number, voteCommentRequest?: VoteCommentRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.voteCommentWithHttpInfo(commentId, voteCommentRequest, _options);
        return result.toPromise();
    }

    /**
     * Vote Comment
     * @param commentId
     * @param voteCommentRequest
     */
    public voteComment(commentId: number, voteCommentRequest?: VoteCommentRequest, _options?: Configuration): Promise<number> {
        const result = this.api.voteComment(commentId, voteCommentRequest, _options);
        return result.toPromise();
    }


}



import { ObservableDefaultApi } from './ObservableAPI';

import type { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Healthcheck
     */
    public healthcheckHealthcheckGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.healthcheckHealthcheckGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Healthcheck
     */
    public healthcheckHealthcheckGet(_options?: Configuration): Promise<void> {
        const result = this.api.healthcheckHealthcheckGet(_options);
        return result.toPromise();
    }


}



import { ObservableEventsApi } from './ObservableAPI';

import type { EventsApiRequestFactory, EventsApiResponseProcessor} from "../apis/EventsApi";
export class PromiseEventsApi {
    private api: ObservableEventsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: EventsApiRequestFactory,
        responseProcessor?: EventsApiResponseProcessor
    ) {
        this.api = new ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Comment Event
     * @param eventId
     * @param commentEventRequest
     */
    public commentEventWithHttpInfo(eventId: number, commentEventRequest?: CommentEventRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.commentEventWithHttpInfo(eventId, commentEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Comment Event
     * @param eventId
     * @param commentEventRequest
     */
    public commentEvent(eventId: number, commentEventRequest?: CommentEventRequest, _options?: Configuration): Promise<number> {
        const result = this.api.commentEvent(eventId, commentEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Draft Event
     * @param createDraftEventRequest
     */
    public createDraftEventWithHttpInfo(createDraftEventRequest?: CreateDraftEventRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createDraftEventWithHttpInfo(createDraftEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Draft Event
     * @param createDraftEventRequest
     */
    public createDraftEvent(createDraftEventRequest?: CreateDraftEventRequest, _options?: Configuration): Promise<number> {
        const result = this.api.createDraftEvent(createDraftEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Event Bookmark
     * @param eventId
     */
    public createEventBookmarkWithHttpInfo(eventId: number, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createEventBookmarkWithHttpInfo(eventId, _options);
        return result.toPromise();
    }

    /**
     * Create Event Bookmark
     * @param eventId
     */
    public createEventBookmark(eventId: number, _options?: Configuration): Promise<number> {
        const result = this.api.createEventBookmark(eventId, _options);
        return result.toPromise();
    }

    /**
     * Delete Event Bookmark
     * @param eventId
     */
    public deleteEventBookmarkWithHttpInfo(eventId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteEventBookmarkWithHttpInfo(eventId, _options);
        return result.toPromise();
    }

    /**
     * Delete Event Bookmark
     * @param eventId
     */
    public deleteEventBookmark(eventId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteEventBookmark(eventId, _options);
        return result.toPromise();
    }

    /**
     * Delete Manual Check In
     * @param checkInId
     */
    public deleteManualCheckInWithHttpInfo(checkInId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteManualCheckInWithHttpInfo(checkInId, _options);
        return result.toPromise();
    }

    /**
     * Delete Manual Check In
     * @param checkInId
     */
    public deleteManualCheckIn(checkInId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteManualCheckIn(checkInId, _options);
        return result.toPromise();
    }

    /**
     * Generate Event Ai
     * @param generateEventAIRequest
     */
    public generateEventAiWithHttpInfo(generateEventAIRequest?: GenerateEventAIRequest, _options?: Configuration): Promise<HttpInfo<GenerateEventAIResponse>> {
        const result = this.api.generateEventAiWithHttpInfo(generateEventAIRequest, _options);
        return result.toPromise();
    }

    /**
     * Generate Event Ai
     * @param generateEventAIRequest
     */
    public generateEventAi(generateEventAIRequest?: GenerateEventAIRequest, _options?: Configuration): Promise<GenerateEventAIResponse> {
        const result = this.api.generateEventAi(generateEventAIRequest, _options);
        return result.toPromise();
    }

    /**
     * Get Draft Event
     */
    public getDraftEventWithHttpInfo(_options?: Configuration): Promise<HttpInfo<GetDraftEventResponse>> {
        const result = this.api.getDraftEventWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Draft Event
     */
    public getDraftEvent(_options?: Configuration): Promise<GetDraftEventResponse> {
        const result = this.api.getDraftEvent(_options);
        return result.toPromise();
    }

    /**
     * Get Event Detail
     * @param slug
     */
    public getEventDetailWithHttpInfo(slug: string, _options?: Configuration): Promise<HttpInfo<GetEventDetailResponse>> {
        const result = this.api.getEventDetailWithHttpInfo(slug, _options);
        return result.toPromise();
    }

    /**
     * Get Event Detail
     * @param slug
     */
    public getEventDetail(slug: string, _options?: Configuration): Promise<GetEventDetailResponse> {
        const result = this.api.getEventDetail(slug, _options);
        return result.toPromise();
    }

    /**
     * Listing Event Comments
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingEventCommentsWithHttpInfo(eventId: number, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingEventCommentsResponse>> {
        const result = this.api.listingEventCommentsWithHttpInfo(eventId, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Event Comments
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingEventComments(eventId: number, perPage?: number, page?: number, _options?: Configuration): Promise<ListingEventCommentsResponse> {
        const result = this.api.listingEventComments(eventId, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Event Options
     */
    public listingEventOptionsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingEventOptionsResponse>> {
        const result = this.api.listingEventOptionsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Event Options
     */
    public listingEventOptions(_options?: Configuration): Promise<ListingEventOptionsResponse> {
        const result = this.api.listingEventOptions(_options);
        return result.toPromise();
    }

    /**
     * Listing Event Purchased Tickets
     * @param slug
     * @param keyword
     * @param isCheckedIn
     * @param perPage
     * @param page
     */
    public listingEventPurchasedTicketsWithHttpInfo(slug: string, keyword?: string, isCheckedIn?: boolean, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingEventPurchasedTicketsResponse>> {
        const result = this.api.listingEventPurchasedTicketsWithHttpInfo(slug, keyword, isCheckedIn, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Event Purchased Tickets
     * @param slug
     * @param keyword
     * @param isCheckedIn
     * @param perPage
     * @param page
     */
    public listingEventPurchasedTickets(slug: string, keyword?: string, isCheckedIn?: boolean, perPage?: number, page?: number, _options?: Configuration): Promise<ListingEventPurchasedTicketsResponse> {
        const result = this.api.listingEventPurchasedTickets(slug, keyword, isCheckedIn, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Event Rank
     */
    public listingEventRankWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingEventRankResponse>> {
        const result = this.api.listingEventRankWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Event Rank
     */
    public listingEventRank(_options?: Configuration): Promise<ListingEventRankResponse> {
        const result = this.api.listingEventRank(_options);
        return result.toPromise();
    }

    /**
     * Listing My Events
     * @param keyword
     * @param status
     * @param perPage
     * @param page
     */
    public listingMyEventsWithHttpInfo(keyword?: string, status?: MyEventStatusCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingMyEventsResponse>> {
        const result = this.api.listingMyEventsWithHttpInfo(keyword, status, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing My Events
     * @param keyword
     * @param status
     * @param perPage
     * @param page
     */
    public listingMyEvents(keyword?: string, status?: MyEventStatusCode, perPage?: number, page?: number, _options?: Configuration): Promise<ListingMyEventsResponse> {
        const result = this.api.listingMyEvents(keyword, status, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Recommendation Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingRecommendationEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingRecommendationEventsResponse>> {
        const result = this.api.listingRecommendationEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Recommendation Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingRecommendationEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<ListingRecommendationEventsResponse> {
        const result = this.api.listingRecommendationEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Related Events
     * @param slug
     */
    public listingRelatedEventsWithHttpInfo(slug: string, _options?: Configuration): Promise<HttpInfo<ListingRelatedEventsResponse>> {
        const result = this.api.listingRelatedEventsWithHttpInfo(slug, _options);
        return result.toPromise();
    }

    /**
     * Listing Related Events
     * @param slug
     */
    public listingRelatedEvents(slug: string, _options?: Configuration): Promise<ListingRelatedEventsResponse> {
        const result = this.api.listingRelatedEvents(slug, _options);
        return result.toPromise();
    }

    /**
     * Listing Tickets Of Event
     * @param eventId
     */
    public listingTicketsOfEventWithHttpInfo(eventId: number, _options?: Configuration): Promise<HttpInfo<Array<TicketItem>>> {
        const result = this.api.listingTicketsOfEventWithHttpInfo(eventId, _options);
        return result.toPromise();
    }

    /**
     * Listing Tickets Of Event
     * @param eventId
     */
    public listingTicketsOfEvent(eventId: number, _options?: Configuration): Promise<Array<TicketItem>> {
        const result = this.api.listingTicketsOfEvent(eventId, _options);
        return result.toPromise();
    }

    /**
     * Listing Trending Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingTrendingEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingTrendingEventsResponse>> {
        const result = this.api.listingTrendingEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Trending Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingTrendingEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<ListingTrendingEventsResponse> {
        const result = this.api.listingTrendingEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Manual Check In
     * @param manualCheckInRequest
     */
    public manualCheckInWithHttpInfo(manualCheckInRequest?: ManualCheckInRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.manualCheckInWithHttpInfo(manualCheckInRequest, _options);
        return result.toPromise();
    }

    /**
     * Manual Check In
     * @param manualCheckInRequest
     */
    public manualCheckIn(manualCheckInRequest?: ManualCheckInRequest, _options?: Configuration): Promise<number> {
        const result = this.api.manualCheckIn(manualCheckInRequest, _options);
        return result.toPromise();
    }

    /**
     * Publish Event
     * @param eventId
     * @param publishEventRequest
     */
    public publishEventWithHttpInfo(eventId: number, publishEventRequest?: PublishEventRequest, _options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.publishEventWithHttpInfo(eventId, publishEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Publish Event
     * @param eventId
     * @param publishEventRequest
     */
    public publishEvent(eventId: number, publishEventRequest?: PublishEventRequest, _options?: Configuration): Promise<string> {
        const result = this.api.publishEvent(eventId, publishEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Qr Check In
     * @param eventId
     * @param qRCheckInRequest
     */
    public qrCheckInWithHttpInfo(eventId: number, qRCheckInRequest?: QRCheckInRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.qrCheckInWithHttpInfo(eventId, qRCheckInRequest, _options);
        return result.toPromise();
    }

    /**
     * Qr Check In
     * @param eventId
     * @param qRCheckInRequest
     */
    public qrCheckIn(eventId: number, qRCheckInRequest?: QRCheckInRequest, _options?: Configuration): Promise<number> {
        const result = this.api.qrCheckIn(eventId, qRCheckInRequest, _options);
        return result.toPromise();
    }

    /**
     * Save Draft Event
     * @param eventId
     * @param saveDraftEventRequest
     */
    public saveDraftEventWithHttpInfo(eventId: number, saveDraftEventRequest?: SaveDraftEventRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.saveDraftEventWithHttpInfo(eventId, saveDraftEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Save Draft Event
     * @param eventId
     * @param saveDraftEventRequest
     */
    public saveDraftEvent(eventId: number, saveDraftEventRequest?: SaveDraftEventRequest, _options?: Configuration): Promise<number> {
        const result = this.api.saveDraftEvent(eventId, saveDraftEventRequest, _options);
        return result.toPromise();
    }

    /**
     * Search Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public searchEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<SearchEventsResponse>> {
        const result = this.api.searchEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Search Events
     * @param keyword
     * @param isOnline
     * @param isOffline
     * @param isApplyOngoing
     * @param isApplyEnded
     * @param isToday
     * @param isFree
     * @param isPaid
     * @param jobTypeCodes
     * @param industryCodes
     * @param cityCodes
     * @param tags
     * @param startAtFrom
     * @param startAtTo
     * @param organizationId
     * @param sortBy
     * @param perPage
     * @param page
     */
    public searchEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<SearchEventsResponse> {
        const result = this.api.searchEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);
        return result.toPromise();
    }


}



import { ObservableNotificationsApi } from './ObservableAPI';

import type { NotificationsApiRequestFactory, NotificationsApiResponseProcessor} from "../apis/NotificationsApi";
export class PromiseNotificationsApi {
    private api: ObservableNotificationsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: NotificationsApiRequestFactory,
        responseProcessor?: NotificationsApiResponseProcessor
    ) {
        this.api = new ObservableNotificationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param registerNotificationDeviceTokenRequest
     */
    public registerNotificationDeviceTokenWithHttpInfo(registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest, _options?: Configuration): Promise<HttpInfo<RegisterNotificationDeviceTokenResponse>> {
        const result = this.api.registerNotificationDeviceTokenWithHttpInfo(registerNotificationDeviceTokenRequest, _options);
        return result.toPromise();
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param registerNotificationDeviceTokenRequest
     */
    public registerNotificationDeviceToken(registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest, _options?: Configuration): Promise<RegisterNotificationDeviceTokenResponse> {
        const result = this.api.registerNotificationDeviceToken(registerNotificationDeviceTokenRequest, _options);
        return result.toPromise();
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param fcmToken
     */
    public removeNotificationDeviceTokenWithHttpInfo(fcmToken: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.removeNotificationDeviceTokenWithHttpInfo(fcmToken, _options);
        return result.toPromise();
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param fcmToken
     */
    public removeNotificationDeviceToken(fcmToken: string, _options?: Configuration): Promise<void> {
        const result = this.api.removeNotificationDeviceToken(fcmToken, _options);
        return result.toPromise();
    }


}



import { ObservableOrganizationsApi } from './ObservableAPI';

import type { OrganizationsApiRequestFactory, OrganizationsApiResponseProcessor} from "../apis/OrganizationsApi";
export class PromiseOrganizationsApi {
    private api: ObservableOrganizationsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: OrganizationsApiRequestFactory,
        responseProcessor?: OrganizationsApiResponseProcessor
    ) {
        this.api = new ObservableOrganizationsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Analyze Event Check Ins
     * @param slug
     */
    public analyzeEventCheckInsWithHttpInfo(slug: string, _options?: Configuration): Promise<HttpInfo<AnalyzeEventCheckInsResponse>> {
        const result = this.api.analyzeEventCheckInsWithHttpInfo(slug, _options);
        return result.toPromise();
    }

    /**
     * Analyze Event Check Ins
     * @param slug
     */
    public analyzeEventCheckIns(slug: string, _options?: Configuration): Promise<AnalyzeEventCheckInsResponse> {
        const result = this.api.analyzeEventCheckIns(slug, _options);
        return result.toPromise();
    }

    /**
     * Analyze Event Tickets
     * @param slug
     * @param granularity The granularity of the data.
     */
    public analyzeEventTicketsWithHttpInfo(slug: string, granularity?: 'daily' | 'weekly' | 'monthly', _options?: Configuration): Promise<HttpInfo<AnalyzeEventTicketsResponse>> {
        const result = this.api.analyzeEventTicketsWithHttpInfo(slug, granularity, _options);
        return result.toPromise();
    }

    /**
     * Analyze Event Tickets
     * @param slug
     * @param granularity The granularity of the data.
     */
    public analyzeEventTickets(slug: string, granularity?: 'daily' | 'weekly' | 'monthly', _options?: Configuration): Promise<AnalyzeEventTicketsResponse> {
        const result = this.api.analyzeEventTickets(slug, granularity, _options);
        return result.toPromise();
    }

    /**
     * Create Organization Follow
     * @param organizationId
     */
    public createOrganizationFollowWithHttpInfo(organizationId: number, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createOrganizationFollowWithHttpInfo(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Create Organization Follow
     * @param organizationId
     */
    public createOrganizationFollow(organizationId: number, _options?: Configuration): Promise<number> {
        const result = this.api.createOrganizationFollow(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Delete Organization Follow
     * @param organizationId
     */
    public deleteOrganizationFollowWithHttpInfo(organizationId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteOrganizationFollowWithHttpInfo(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Delete Organization Follow
     * @param organizationId
     */
    public deleteOrganizationFollow(organizationId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteOrganizationFollow(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Download Attendees Csv
     * @param keyword
     * @param applyAtFrom
     * @param applyAtTo
     * @param isCheckedIn
     * @param jobTypeCode
     * @param industryCode
     * @param sortBy
     * @param withFilter
     * @param page
     * @param perPage
     */
    public downloadAttendeesCsvWithHttpInfo(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, withFilter?: boolean, page?: number, perPage?: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.downloadAttendeesCsvWithHttpInfo(keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, sortBy, withFilter, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Download Attendees Csv
     * @param keyword
     * @param applyAtFrom
     * @param applyAtTo
     * @param isCheckedIn
     * @param jobTypeCode
     * @param industryCode
     * @param sortBy
     * @param withFilter
     * @param page
     * @param perPage
     */
    public downloadAttendeesCsv(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, withFilter?: boolean, page?: number, perPage?: number, _options?: Configuration): Promise<void> {
        const result = this.api.downloadAttendeesCsv(keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, sortBy, withFilter, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Get Attendee Detail
     * @param attendeeId
     */
    public getAttendeeDetailWithHttpInfo(attendeeId: number, _options?: Configuration): Promise<HttpInfo<GetAttendeeDetailResponse>> {
        const result = this.api.getAttendeeDetailWithHttpInfo(attendeeId, _options);
        return result.toPromise();
    }

    /**
     * Get Attendee Detail
     * @param attendeeId
     */
    public getAttendeeDetail(attendeeId: number, _options?: Configuration): Promise<GetAttendeeDetailResponse> {
        const result = this.api.getAttendeeDetail(attendeeId, _options);
        return result.toPromise();
    }

    /**
     * Get Organization Dashboard
     */
    public getOrganizationDashboardWithHttpInfo(_options?: Configuration): Promise<HttpInfo<GetOrganizationDashboardResponse>> {
        const result = this.api.getOrganizationDashboardWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Organization Dashboard
     */
    public getOrganizationDashboard(_options?: Configuration): Promise<GetOrganizationDashboardResponse> {
        const result = this.api.getOrganizationDashboard(_options);
        return result.toPromise();
    }

    /**
     * Get Organization Detail
     * @param organizationSlug
     */
    public getOrganizationDetailWithHttpInfo(organizationSlug: string, _options?: Configuration): Promise<HttpInfo<GetOrganizationDetailResponse>> {
        const result = this.api.getOrganizationDetailWithHttpInfo(organizationSlug, _options);
        return result.toPromise();
    }

    /**
     * Get Organization Detail
     * @param organizationSlug
     */
    public getOrganizationDetail(organizationSlug: string, _options?: Configuration): Promise<GetOrganizationDetailResponse> {
        const result = this.api.getOrganizationDetail(organizationSlug, _options);
        return result.toPromise();
    }

    /**
     * Get Tag Stats
     */
    public getTagStatsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<GetTagStatsResponse>> {
        const result = this.api.getTagStatsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Tag Stats
     */
    public getTagStats(_options?: Configuration): Promise<GetTagStatsResponse> {
        const result = this.api.getTagStats(_options);
        return result.toPromise();
    }

    /**
     * Get Ticket Stats
     * @param eventId
     * @param startDate
     * @param endDate
     * @param ticketType
     * @param ticketStatus
     */
    public getTicketStatsWithHttpInfo(eventId?: number, startDate?: Date, endDate?: Date, ticketType?: TicketTypeCode, ticketStatus?: TicketStatusCode, _options?: Configuration): Promise<HttpInfo<GetTicketStatsResponse>> {
        const result = this.api.getTicketStatsWithHttpInfo(eventId, startDate, endDate, ticketType, ticketStatus, _options);
        return result.toPromise();
    }

    /**
     * Get Ticket Stats
     * @param eventId
     * @param startDate
     * @param endDate
     * @param ticketType
     * @param ticketStatus
     */
    public getTicketStats(eventId?: number, startDate?: Date, endDate?: Date, ticketType?: TicketTypeCode, ticketStatus?: TicketStatusCode, _options?: Configuration): Promise<GetTicketStatsResponse> {
        const result = this.api.getTicketStats(eventId, startDate, endDate, ticketType, ticketStatus, _options);
        return result.toPromise();
    }

    /**
     * Listing Attendees
     * @param slug Event slug
     * @param eventId Event ID
     * @param keyword user name | event name | phone | email
     * @param applyAtFrom
     * @param applyAtTo
     * @param isCheckedIn
     * @param jobTypeCode
     * @param industryCode
     * @param ticketTypeCode
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingAttendeesWithHttpInfo(slug?: string, eventId?: number, keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, ticketTypeCode?: TicketTypeCode, sortBy?: AttendeeSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingAttendeesResponse>> {
        const result = this.api.listingAttendeesWithHttpInfo(slug, eventId, keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, ticketTypeCode, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Attendees
     * @param slug Event slug
     * @param eventId Event ID
     * @param keyword user name | event name | phone | email
     * @param applyAtFrom
     * @param applyAtTo
     * @param isCheckedIn
     * @param jobTypeCode
     * @param industryCode
     * @param ticketTypeCode
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingAttendees(slug?: string, eventId?: number, keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, ticketTypeCode?: TicketTypeCode, sortBy?: AttendeeSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<ListingAttendeesResponse> {
        const result = this.api.listingAttendees(slug, eventId, keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, ticketTypeCode, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Attendees Ranking
     * @param keyword
     * @param eventId
     * @param month
     * @param year
     * @param page
     * @param perPage
     */
    public listingAttendeesRankingWithHttpInfo(keyword?: string, eventId?: number, month?: number, year?: number, page?: number, perPage?: number, _options?: Configuration): Promise<HttpInfo<Array<ListingAttendeesRankingItem>>> {
        const result = this.api.listingAttendeesRankingWithHttpInfo(keyword, eventId, month, year, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Listing Attendees Ranking
     * @param keyword
     * @param eventId
     * @param month
     * @param year
     * @param page
     * @param perPage
     */
    public listingAttendeesRanking(keyword?: string, eventId?: number, month?: number, year?: number, page?: number, perPage?: number, _options?: Configuration): Promise<Array<ListingAttendeesRankingItem>> {
        const result = this.api.listingAttendeesRanking(keyword, eventId, month, year, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Listing Organization Events
     * @param keyword
     * @param tags
     * @param meetingToolCodes
     * @param startAtFrom
     * @param startAtTo
     * @param eventStatus
     * @param timeStatus
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingOrganizationEventsWithHttpInfo(keyword?: string, tags?: Array<number>, meetingToolCodes?: Array<EventMeetingToolCode>, startAtFrom?: string, startAtTo?: string, eventStatus?: Array<EventStatusCode>, timeStatus?: EventTimeStatusCode, sortBy?: ManageEventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<HttpInfo<ListingOrganizationEventsResponse>> {
        const result = this.api.listingOrganizationEventsWithHttpInfo(keyword, tags, meetingToolCodes, startAtFrom, startAtTo, eventStatus, timeStatus, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Organization Events
     * @param keyword
     * @param tags
     * @param meetingToolCodes
     * @param startAtFrom
     * @param startAtTo
     * @param eventStatus
     * @param timeStatus
     * @param sortBy
     * @param perPage
     * @param page
     */
    public listingOrganizationEvents(keyword?: string, tags?: Array<number>, meetingToolCodes?: Array<EventMeetingToolCode>, startAtFrom?: string, startAtTo?: string, eventStatus?: Array<EventStatusCode>, timeStatus?: EventTimeStatusCode, sortBy?: ManageEventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<ListingOrganizationEventsResponse> {
        const result = this.api.listingOrganizationEvents(keyword, tags, meetingToolCodes, startAtFrom, startAtTo, eventStatus, timeStatus, sortBy, perPage, page, _options);
        return result.toPromise();
    }

    /**
     * Listing Organization Events Timeline
     */
    public listingOrganizationEventsTimelineWithHttpInfo(_options?: Configuration): Promise<HttpInfo<Array<ListingOrganizationEventsTimelineItem>>> {
        const result = this.api.listingOrganizationEventsTimelineWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Organization Events Timeline
     */
    public listingOrganizationEventsTimeline(_options?: Configuration): Promise<Array<ListingOrganizationEventsTimelineItem>> {
        const result = this.api.listingOrganizationEventsTimeline(_options);
        return result.toPromise();
    }

    /**
     * Listing Random Organizations
     */
    public listingRandomOrganizationsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingRandomOrganizationsResponse>> {
        const result = this.api.listingRandomOrganizationsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Random Organizations
     */
    public listingRandomOrganizations(_options?: Configuration): Promise<ListingRandomOrganizationsResponse> {
        const result = this.api.listingRandomOrganizations(_options);
        return result.toPromise();
    }

    /**
     * Listing Top Organization Events
     * @param organizationId
     */
    public listingTopOrganizationEventsWithHttpInfo(organizationId: number, _options?: Configuration): Promise<HttpInfo<ListingTopOrganizationEventsResponse>> {
        const result = this.api.listingTopOrganizationEventsWithHttpInfo(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Listing Top Organization Events
     * @param organizationId
     */
    public listingTopOrganizationEvents(organizationId: number, _options?: Configuration): Promise<ListingTopOrganizationEventsResponse> {
        const result = this.api.listingTopOrganizationEvents(organizationId, _options);
        return result.toPromise();
    }

    /**
     * Register Organization
     * @param registerOrganizationRequest
     */
    public registerOrganizationWithHttpInfo(registerOrganizationRequest?: RegisterOrganizationRequest, _options?: Configuration): Promise<HttpInfo<RegisterOrganizationResponse>> {
        const result = this.api.registerOrganizationWithHttpInfo(registerOrganizationRequest, _options);
        return result.toPromise();
    }

    /**
     * Register Organization
     * @param registerOrganizationRequest
     */
    public registerOrganization(registerOrganizationRequest?: RegisterOrganizationRequest, _options?: Configuration): Promise<RegisterOrganizationResponse> {
        const result = this.api.registerOrganization(registerOrganizationRequest, _options);
        return result.toPromise();
    }

    /**
     * Track User Actions
     * @param timeRange
     * @param groupBy
     * @param actionTypes
     * @param eventId
     * @param topN
     */
    public trackUserActionsWithHttpInfo(timeRange?: TrackingTimeRangeCode, groupBy?: TrackingTimeRangeCode, actionTypes?: Array<UserActionTypeCode>, eventId?: number, topN?: number, _options?: Configuration): Promise<HttpInfo<TrackUserActionsResponse>> {
        const result = this.api.trackUserActionsWithHttpInfo(timeRange, groupBy, actionTypes, eventId, topN, _options);
        return result.toPromise();
    }

    /**
     * Track User Actions
     * @param timeRange
     * @param groupBy
     * @param actionTypes
     * @param eventId
     * @param topN
     */
    public trackUserActions(timeRange?: TrackingTimeRangeCode, groupBy?: TrackingTimeRangeCode, actionTypes?: Array<UserActionTypeCode>, eventId?: number, topN?: number, _options?: Configuration): Promise<TrackUserActionsResponse> {
        const result = this.api.trackUserActions(timeRange, groupBy, actionTypes, eventId, topN, _options);
        return result.toPromise();
    }


}



import { ObservableSpeakersApi } from './ObservableAPI';

import type { SpeakersApiRequestFactory, SpeakersApiResponseProcessor} from "../apis/SpeakersApi";
export class PromiseSpeakersApi {
    private api: ObservableSpeakersApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpeakersApiRequestFactory,
        responseProcessor?: SpeakersApiResponseProcessor
    ) {
        this.api = new ObservableSpeakersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Speaker Detail
     * @param slug
     */
    public getSpeakerDetailWithHttpInfo(slug: string, _options?: Configuration): Promise<HttpInfo<GetSpeakerDetailResponse>> {
        const result = this.api.getSpeakerDetailWithHttpInfo(slug, _options);
        return result.toPromise();
    }

    /**
     * Get Speaker Detail
     * @param slug
     */
    public getSpeakerDetail(slug: string, _options?: Configuration): Promise<GetSpeakerDetailResponse> {
        const result = this.api.getSpeakerDetail(slug, _options);
        return result.toPromise();
    }

    /**
     * Listing Random Speakers
     */
    public listingRandomSpeakersWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingRandomSpeakersResponse>> {
        const result = this.api.listingRandomSpeakersWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Random Speakers
     */
    public listingRandomSpeakers(_options?: Configuration): Promise<ListingRandomSpeakersResponse> {
        const result = this.api.listingRandomSpeakers(_options);
        return result.toPromise();
    }


}



import { ObservableSurveysApi } from './ObservableAPI';

import type { SurveysApiRequestFactory, SurveysApiResponseProcessor} from "../apis/SurveysApi";
export class PromiseSurveysApi {
    private api: ObservableSurveysApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SurveysApiRequestFactory,
        responseProcessor?: SurveysApiResponseProcessor
    ) {
        this.api = new ObservableSurveysApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Survey
     * @param createSurveyRequest
     */
    public createSurveyWithHttpInfo(createSurveyRequest?: CreateSurveyRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createSurveyWithHttpInfo(createSurveyRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Survey
     * @param createSurveyRequest
     */
    public createSurvey(createSurveyRequest?: CreateSurveyRequest, _options?: Configuration): Promise<number> {
        const result = this.api.createSurvey(createSurveyRequest, _options);
        return result.toPromise();
    }

    /**
     * Listing Survey Options
     */
    public listingSurveyOptionsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<Array<ListingSurveyOptionsItem>>> {
        const result = this.api.listingSurveyOptionsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Survey Options
     */
    public listingSurveyOptions(_options?: Configuration): Promise<Array<ListingSurveyOptionsItem>> {
        const result = this.api.listingSurveyOptions(_options);
        return result.toPromise();
    }


}



import { ObservableTagsApi } from './ObservableAPI';

import type { TagsApiRequestFactory, TagsApiResponseProcessor} from "../apis/TagsApi";
export class PromiseTagsApi {
    private api: ObservableTagsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TagsApiRequestFactory,
        responseProcessor?: TagsApiResponseProcessor
    ) {
        this.api = new ObservableTagsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Listing Tag Rank
     */
    public listingTagRankWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingTagRankResponse>> {
        const result = this.api.listingTagRankWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Tag Rank
     */
    public listingTagRank(_options?: Configuration): Promise<ListingTagRankResponse> {
        const result = this.api.listingTagRank(_options);
        return result.toPromise();
    }

    /**
     * Listing Tags
     */
    public listingTagsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ListingTagsResponse>> {
        const result = this.api.listingTagsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Tags
     */
    public listingTags(_options?: Configuration): Promise<ListingTagsResponse> {
        const result = this.api.listingTags(_options);
        return result.toPromise();
    }


}



import { ObservableTargetsApi } from './ObservableAPI';

import type { TargetsApiRequestFactory, TargetsApiResponseProcessor} from "../apis/TargetsApi";
export class PromiseTargetsApi {
    private api: ObservableTargetsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TargetsApiRequestFactory,
        responseProcessor?: TargetsApiResponseProcessor
    ) {
        this.api = new ObservableTargetsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Target
     * @param createTargetRequest
     */
    public createTargetWithHttpInfo(createTargetRequest?: CreateTargetRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createTargetWithHttpInfo(createTargetRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Target
     * @param createTargetRequest
     */
    public createTarget(createTargetRequest?: CreateTargetRequest, _options?: Configuration): Promise<number> {
        const result = this.api.createTarget(createTargetRequest, _options);
        return result.toPromise();
    }

    /**
     * Listing Target Options
     */
    public listingTargetOptionsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<Array<ListingTargetOptionsItem>>> {
        const result = this.api.listingTargetOptionsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Listing Target Options
     */
    public listingTargetOptions(_options?: Configuration): Promise<Array<ListingTargetOptionsItem>> {
        const result = this.api.listingTargetOptions(_options);
        return result.toPromise();
    }


}



import { ObservableTicketsApi } from './ObservableAPI';

import type { TicketsApiRequestFactory, TicketsApiResponseProcessor} from "../apis/TicketsApi";
export class PromiseTicketsApi {
    private api: ObservableTicketsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TicketsApiRequestFactory,
        responseProcessor?: TicketsApiResponseProcessor
    ) {
        this.api = new ObservableTicketsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Cancel Tickets
     * @param cancelTicketsRequest
     */
    public cancelTicketsWithHttpInfo(cancelTicketsRequest?: CancelTicketsRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.cancelTicketsWithHttpInfo(cancelTicketsRequest, _options);
        return result.toPromise();
    }

    /**
     * Cancel Tickets
     * @param cancelTicketsRequest
     */
    public cancelTickets(cancelTicketsRequest?: CancelTicketsRequest, _options?: Configuration): Promise<number> {
        const result = this.api.cancelTickets(cancelTicketsRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Ticket
     * @param createTicketRequest
     */
    public createTicketWithHttpInfo(createTicketRequest?: CreateTicketRequest, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.createTicketWithHttpInfo(createTicketRequest, _options);
        return result.toPromise();
    }

    /**
     * Create Ticket
     * @param createTicketRequest
     */
    public createTicket(createTicketRequest?: CreateTicketRequest, _options?: Configuration): Promise<number> {
        const result = this.api.createTicket(createTicketRequest, _options);
        return result.toPromise();
    }

    /**
     * Delete Ticket
     * @param ticketId
     */
    public deleteTicketWithHttpInfo(ticketId: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.deleteTicketWithHttpInfo(ticketId, _options);
        return result.toPromise();
    }

    /**
     * Delete Ticket
     * @param ticketId
     */
    public deleteTicket(ticketId: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteTicket(ticketId, _options);
        return result.toPromise();
    }

    /**
     * Get Draft Ticket
     * @param ticketId
     */
    public getDraftTicketWithHttpInfo(ticketId: number, _options?: Configuration): Promise<HttpInfo<Ticket>> {
        const result = this.api.getDraftTicketWithHttpInfo(ticketId, _options);
        return result.toPromise();
    }

    /**
     * Get Draft Ticket
     * @param ticketId
     */
    public getDraftTicket(ticketId: number, _options?: Configuration): Promise<Ticket> {
        const result = this.api.getDraftTicket(ticketId, _options);
        return result.toPromise();
    }

    /**
     * Update Ticket
     * @param ticketId
     * @param updateTicketRequest
     */
    public updateTicketWithHttpInfo(ticketId: number, updateTicketRequest?: UpdateTicketRequest, _options?: Configuration): Promise<HttpInfo<TicketItem>> {
        const result = this.api.updateTicketWithHttpInfo(ticketId, updateTicketRequest, _options);
        return result.toPromise();
    }

    /**
     * Update Ticket
     * @param ticketId
     * @param updateTicketRequest
     */
    public updateTicket(ticketId: number, updateTicketRequest?: UpdateTicketRequest, _options?: Configuration): Promise<TicketItem> {
        const result = this.api.updateTicket(ticketId, updateTicketRequest, _options);
        return result.toPromise();
    }


}



import { ObservableTransactionsApi } from './ObservableAPI';

import type { TransactionsApiRequestFactory, TransactionsApiResponseProcessor} from "../apis/TransactionsApi";
export class PromiseTransactionsApi {
    private api: ObservableTransactionsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TransactionsApiRequestFactory,
        responseProcessor?: TransactionsApiResponseProcessor
    ) {
        this.api = new ObservableTransactionsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Transaction Status Counts
     */
    public getTransactionStatusCountsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<GetTransactionStatusCountsResponse>> {
        const result = this.api.getTransactionStatusCountsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Transaction Status Counts
     */
    public getTransactionStatusCounts(_options?: Configuration): Promise<GetTransactionStatusCountsResponse> {
        const result = this.api.getTransactionStatusCounts(_options);
        return result.toPromise();
    }

    /**
     * Handle Application Transaction
     */
    public handleApplicationTransactionWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.handleApplicationTransactionWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Handle Application Transaction
     */
    public handleApplicationTransaction(_options?: Configuration): Promise<void> {
        const result = this.api.handleApplicationTransaction(_options);
        return result.toPromise();
    }

    /**
     * Listing My Transactions
     * @param keyword
     * @param status
     * @param page
     * @param perPage
     */
    public listingMyTransactionsWithHttpInfo(keyword?: string, status?: TransactionStatusCode, page?: number, perPage?: number, _options?: Configuration): Promise<HttpInfo<ListingMyTransactionsResponse>> {
        const result = this.api.listingMyTransactionsWithHttpInfo(keyword, status, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Listing My Transactions
     * @param keyword
     * @param status
     * @param page
     * @param perPage
     */
    public listingMyTransactions(keyword?: string, status?: TransactionStatusCode, page?: number, perPage?: number, _options?: Configuration): Promise<ListingMyTransactionsResponse> {
        const result = this.api.listingMyTransactions(keyword, status, page, perPage, _options);
        return result.toPromise();
    }

    /**
     * Payment Webhook
     */
    public paymentWebhookWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.paymentWebhookWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Payment Webhook
     */
    public paymentWebhook(_options?: Configuration): Promise<void> {
        const result = this.api.paymentWebhook(_options);
        return result.toPromise();
    }


}



import { ObservableUsersApi } from './ObservableAPI';

import type { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";
export class PromiseUsersApi {
    private api: ObservableUsersApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersApiRequestFactory,
        responseProcessor?: UsersApiResponseProcessor
    ) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Total Unread Notifications
     */
    public getTotalUnreadNotificationsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.getTotalUnreadNotificationsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Total Unread Notifications
     */
    public getTotalUnreadNotifications(_options?: Configuration): Promise<number> {
        const result = this.api.getTotalUnreadNotifications(_options);
        return result.toPromise();
    }

    /**
     * Listing Notifications
     * @param perPage
     * @param page
     * @param isRead
     */
    public listingNotificationsWithHttpInfo(perPage?: number, page?: number, isRead?: boolean, _options?: Configuration): Promise<HttpInfo<ListingNotificationsResponse>> {
        const result = this.api.listingNotificationsWithHttpInfo(perPage, page, isRead, _options);
        return result.toPromise();
    }

    /**
     * Listing Notifications
     * @param perPage
     * @param page
     * @param isRead
     */
    public listingNotifications(perPage?: number, page?: number, isRead?: boolean, _options?: Configuration): Promise<ListingNotificationsResponse> {
        const result = this.api.listingNotifications(perPage, page, isRead, _options);
        return result.toPromise();
    }

    /**
     * Mark Notification As Read
     * @param notificationId
     */
    public markNotificationAsReadWithHttpInfo(notificationId: number, _options?: Configuration): Promise<HttpInfo<number>> {
        const result = this.api.markNotificationAsReadWithHttpInfo(notificationId, _options);
        return result.toPromise();
    }

    /**
     * Mark Notification As Read
     * @param notificationId
     */
    public markNotificationAsRead(notificationId: number, _options?: Configuration): Promise<number> {
        const result = this.api.markNotificationAsRead(notificationId, _options);
        return result.toPromise();
    }

    /**
     * Update Audience
     * @param updateUserRequest
     */
    public updateAudienceWithHttpInfo(updateUserRequest: UpdateUserRequest, _options?: Configuration): Promise<HttpInfo<GetMeResponse>> {
        const result = this.api.updateAudienceWithHttpInfo(updateUserRequest, _options);
        return result.toPromise();
    }

    /**
     * Update Audience
     * @param updateUserRequest
     */
    public updateAudience(updateUserRequest: UpdateUserRequest, _options?: Configuration): Promise<GetMeResponse> {
        const result = this.api.updateAudience(updateUserRequest, _options);
        return result.toPromise();
    }


}
