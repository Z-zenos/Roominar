import type { ResponseContext, RequestContext, HttpInfo } from '../http/http';
import { HttpFile } from '../http/http';
import type { Configuration} from '../configuration'
import type { Observable} from '../rxjsStub';
import { of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { ApplicationsApiRequestFactory, ApplicationsApiResponseProcessor} from "../apis/ApplicationsApi";
export class ObservableApplicationsApi {
    private requestFactory: ApplicationsApiRequestFactory;
    private responseProcessor: ApplicationsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ApplicationsApiRequestFactory,
        responseProcessor?: ApplicationsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ApplicationsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ApplicationsApiResponseProcessor();
    }

    /**
     * Create Checkout Session
     * @param createApplicationRequest
     */
    public createCheckoutSessionWithHttpInfo(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Observable<HttpInfo<CreateApplicationCheckoutSessionResponse>> {
        const requestContextPromise = this.requestFactory.createCheckoutSession(createApplicationRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createCheckoutSessionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Checkout Session
     * @param createApplicationRequest
     */
    public createCheckoutSession(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Observable<CreateApplicationCheckoutSessionResponse> {
        return this.createCheckoutSessionWithHttpInfo(createApplicationRequest, _options).pipe(map((apiResponse: HttpInfo<CreateApplicationCheckoutSessionResponse>) => apiResponse.data));
    }

    /**
     * Create Free Application
     * @param createApplicationRequest
     */
    public createFreeApplicationWithHttpInfo(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createFreeApplication(createApplicationRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createFreeApplicationWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Free Application
     * @param createApplicationRequest
     */
    public createFreeApplication(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Observable<number> {
        return this.createFreeApplicationWithHttpInfo(createApplicationRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

}

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class ObservableAuthApi {
    private requestFactory: AuthApiRequestFactory;
    private responseProcessor: AuthApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AuthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AuthApiResponseProcessor();
    }

    /**
     * Change Password
     * @param changePasswordRequest
     */
    public changePasswordWithHttpInfo(changePasswordRequest?: ChangePasswordRequest, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.changePassword(changePasswordRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.changePasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * Change Password
     * @param changePasswordRequest
     */
    public changePassword(changePasswordRequest?: ChangePasswordRequest, _options?: Configuration): Observable<void> {
        return this.changePasswordWithHttpInfo(changePasswordRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Forgot Password
     * @param forgotPasswordRequest
     */
    public forgotPasswordWithHttpInfo(forgotPasswordRequest?: ForgotPasswordRequest, _options?: Configuration): Observable<HttpInfo<ForgotPasswordResponse>> {
        const requestContextPromise = this.requestFactory.forgotPassword(forgotPasswordRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.forgotPasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * Forgot Password
     * @param forgotPasswordRequest
     */
    public forgotPassword(forgotPasswordRequest?: ForgotPasswordRequest, _options?: Configuration): Observable<ForgotPasswordResponse> {
        return this.forgotPasswordWithHttpInfo(forgotPasswordRequest, _options).pipe(map((apiResponse: HttpInfo<ForgotPasswordResponse>) => apiResponse.data));
    }

    /**
     * Login
     * @param userAgent
     * @param loginRequest
     */
    public loginWithHttpInfo(userAgent?: string, loginRequest?: LoginRequest, _options?: Configuration): Observable<HttpInfo<TokenResponse>> {
        const requestContextPromise = this.requestFactory.login(userAgent, loginRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loginWithHttpInfo(rsp)));
            }));
    }

    /**
     * Login
     * @param userAgent
     * @param loginRequest
     */
    public login(userAgent?: string, loginRequest?: LoginRequest, _options?: Configuration): Observable<TokenResponse> {
        return this.loginWithHttpInfo(userAgent, loginRequest, _options).pipe(map((apiResponse: HttpInfo<TokenResponse>) => apiResponse.data));
    }

    /**
     * Log out user from the current device
     * Logout
     * @param logoutRequest
     */
    public logoutWithHttpInfo(logoutRequest?: LogoutRequest, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.logout(logoutRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.logoutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Log out user from the current device
     * Logout
     * @param logoutRequest
     */
    public logout(logoutRequest?: LogoutRequest, _options?: Configuration): Observable<void> {
        return this.logoutWithHttpInfo(logoutRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Me
     */
    public meWithHttpInfo(_options?: Configuration): Observable<HttpInfo<GetMeResponse>> {
        const requestContextPromise = this.requestFactory.me(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.meWithHttpInfo(rsp)));
            }));
    }

    /**
     * Me
     */
    public me(_options?: Configuration): Observable<GetMeResponse> {
        return this.meWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<GetMeResponse>) => apiResponse.data));
    }

    /**
     * Refresh Token
     * @param token
     */
    public refreshTokenWithHttpInfo(token: string, _options?: Configuration): Observable<HttpInfo<TokenResponse>> {
        const requestContextPromise = this.requestFactory.refreshToken(token, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.refreshTokenWithHttpInfo(rsp)));
            }));
    }

    /**
     * Refresh Token
     * @param token
     */
    public refreshToken(token: string, _options?: Configuration): Observable<TokenResponse> {
        return this.refreshTokenWithHttpInfo(token, _options).pipe(map((apiResponse: HttpInfo<TokenResponse>) => apiResponse.data));
    }

    /**
     * Register Audience
     * @param registerAudienceRequest
     */
    public registerAudienceWithHttpInfo(registerAudienceRequest?: RegisterAudienceRequest, _options?: Configuration): Observable<HttpInfo<RegisterAudienceResponse>> {
        const requestContextPromise = this.requestFactory.registerAudience(registerAudienceRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerAudienceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register Audience
     * @param registerAudienceRequest
     */
    public registerAudience(registerAudienceRequest?: RegisterAudienceRequest, _options?: Configuration): Observable<RegisterAudienceResponse> {
        return this.registerAudienceWithHttpInfo(registerAudienceRequest, _options).pipe(map((apiResponse: HttpInfo<RegisterAudienceResponse>) => apiResponse.data));
    }

    /**
     * Request Change Email
     * @param changeEmailRequest
     */
    public requestChangeEmailWithHttpInfo(changeEmailRequest?: ChangeEmailRequest, _options?: Configuration): Observable<HttpInfo<RequestChangeEmailResponse>> {
        const requestContextPromise = this.requestFactory.requestChangeEmail(changeEmailRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.requestChangeEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Request Change Email
     * @param changeEmailRequest
     */
    public requestChangeEmail(changeEmailRequest?: ChangeEmailRequest, _options?: Configuration): Observable<RequestChangeEmailResponse> {
        return this.requestChangeEmailWithHttpInfo(changeEmailRequest, _options).pipe(map((apiResponse: HttpInfo<RequestChangeEmailResponse>) => apiResponse.data));
    }

    /**
     * Reset Password
     * @param token
     * @param resetPasswordRequest
     */
    public resetPasswordWithHttpInfo(token: string, resetPasswordRequest?: ResetPasswordRequest, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.resetPassword(token, resetPasswordRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.resetPasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * Reset Password
     * @param token
     * @param resetPasswordRequest
     */
    public resetPassword(token: string, resetPasswordRequest?: ResetPasswordRequest, _options?: Configuration): Observable<void> {
        return this.resetPasswordWithHttpInfo(token, resetPasswordRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Revert Email
     * @param token
     */
    public revertEmailWithHttpInfo(token: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.revertEmail(token, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.revertEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Revert Email
     * @param token
     */
    public revertEmail(token: string, _options?: Configuration): Observable<void> {
        return this.revertEmailWithHttpInfo(token, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Social Auth
     * @param socialAuthRequest
     */
    public socialAuthWithHttpInfo(socialAuthRequest: SocialAuthRequest, _options?: Configuration): Observable<HttpInfo<TokenResponse>> {
        const requestContextPromise = this.requestFactory.socialAuth(socialAuthRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.socialAuthWithHttpInfo(rsp)));
            }));
    }

    /**
     * Social Auth
     * @param socialAuthRequest
     */
    public socialAuth(socialAuthRequest: SocialAuthRequest, _options?: Configuration): Observable<TokenResponse> {
        return this.socialAuthWithHttpInfo(socialAuthRequest, _options).pipe(map((apiResponse: HttpInfo<TokenResponse>) => apiResponse.data));
    }

    /**
     * Verify Audience
     * @param token
     * @param verifyAudienceRequest
     */
    public verifyAudienceWithHttpInfo(token: string, verifyAudienceRequest?: VerifyAudienceRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.verifyAudience(token, verifyAudienceRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.verifyAudienceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Verify Audience
     * @param token
     * @param verifyAudienceRequest
     */
    public verifyAudience(token: string, verifyAudienceRequest?: VerifyAudienceRequest, _options?: Configuration): Observable<number> {
        return this.verifyAudienceWithHttpInfo(token, verifyAudienceRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Verify Change Email
     * @param token
     */
    public verifyChangeEmailWithHttpInfo(token: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.verifyChangeEmail(token, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.verifyChangeEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Verify Change Email
     * @param token
     */
    public verifyChangeEmail(token: string, _options?: Configuration): Observable<void> {
        return this.verifyChangeEmailWithHttpInfo(token, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { CommentsApiRequestFactory, CommentsApiResponseProcessor} from "../apis/CommentsApi";
export class ObservableCommentsApi {
    private requestFactory: CommentsApiRequestFactory;
    private responseProcessor: CommentsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: CommentsApiRequestFactory,
        responseProcessor?: CommentsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new CommentsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new CommentsApiResponseProcessor();
    }

    /**
     * Delete Comment
     * @param commentId
     */
    public deleteCommentWithHttpInfo(commentId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteComment(commentId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Comment
     * @param commentId
     */
    public deleteComment(commentId: number, _options?: Configuration): Observable<void> {
        return this.deleteCommentWithHttpInfo(commentId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Delete Comment Reply
     * @param replyId
     */
    public deleteCommentReplyWithHttpInfo(replyId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteCommentReply(replyId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteCommentReplyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Comment Reply
     * @param replyId
     */
    public deleteCommentReply(replyId: number, _options?: Configuration): Observable<void> {
        return this.deleteCommentReplyWithHttpInfo(replyId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Listing Comment Replies
     * @param commentId
     * @param perPage
     * @param page
     */
    public listingCommentRepliesWithHttpInfo(commentId: number, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingCommentRepliesResponse>> {
        const requestContextPromise = this.requestFactory.listingCommentReplies(commentId, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingCommentRepliesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Comment Replies
     * @param commentId
     * @param perPage
     * @param page
     */
    public listingCommentReplies(commentId: number, perPage?: number, page?: number, _options?: Configuration): Observable<ListingCommentRepliesResponse> {
        return this.listingCommentRepliesWithHttpInfo(commentId, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingCommentRepliesResponse>) => apiResponse.data));
    }

    /**
     * Pin Comment
     * @param commentId
     */
    public pinCommentWithHttpInfo(commentId: number, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.pinComment(commentId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.pinCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Pin Comment
     * @param commentId
     */
    public pinComment(commentId: number, _options?: Configuration): Observable<number> {
        return this.pinCommentWithHttpInfo(commentId, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Reply Comment
     * @param commentId
     * @param createCommentReplyRequest
     */
    public replyCommentWithHttpInfo(commentId: number, createCommentReplyRequest?: CreateCommentReplyRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.replyComment(commentId, createCommentReplyRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.replyCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Reply Comment
     * @param commentId
     * @param createCommentReplyRequest
     */
    public replyComment(commentId: number, createCommentReplyRequest?: CreateCommentReplyRequest, _options?: Configuration): Observable<number> {
        return this.replyCommentWithHttpInfo(commentId, createCommentReplyRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Unpin Comment
     * @param commentId
     */
    public unpinCommentWithHttpInfo(commentId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.unpinComment(commentId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.unpinCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Unpin Comment
     * @param commentId
     */
    public unpinComment(commentId: number, _options?: Configuration): Observable<void> {
        return this.unpinCommentWithHttpInfo(commentId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Update Comment
     * @param commentId
     * @param updateEventCommentRequest
     */
    public updateCommentWithHttpInfo(commentId: number, updateEventCommentRequest?: UpdateEventCommentRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.updateComment(commentId, updateEventCommentRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update Comment
     * @param commentId
     * @param updateEventCommentRequest
     */
    public updateComment(commentId: number, updateEventCommentRequest?: UpdateEventCommentRequest, _options?: Configuration): Observable<number> {
        return this.updateCommentWithHttpInfo(commentId, updateEventCommentRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Update Comment Reply
     * @param replyId
     * @param updateCommentReplyRequest
     */
    public updateCommentReplyWithHttpInfo(replyId: number, updateCommentReplyRequest?: UpdateCommentReplyRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.updateCommentReply(replyId, updateCommentReplyRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateCommentReplyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update Comment Reply
     * @param replyId
     * @param updateCommentReplyRequest
     */
    public updateCommentReply(replyId: number, updateCommentReplyRequest?: UpdateCommentReplyRequest, _options?: Configuration): Observable<number> {
        return this.updateCommentReplyWithHttpInfo(replyId, updateCommentReplyRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Vote Comment
     * @param commentId
     * @param voteCommentRequest
     */
    public voteCommentWithHttpInfo(commentId: number, voteCommentRequest?: VoteCommentRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.voteComment(commentId, voteCommentRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.voteCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Vote Comment
     * @param commentId
     * @param voteCommentRequest
     */
    public voteComment(commentId: number, voteCommentRequest?: VoteCommentRequest, _options?: Configuration): Observable<number> {
        return this.voteCommentWithHttpInfo(commentId, voteCommentRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

}

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * Healthcheck
     */
    public healthcheckHealthcheckGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.healthcheckHealthcheckGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.healthcheckHealthcheckGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Healthcheck
     */
    public healthcheckHealthcheckGet(_options?: Configuration): Observable<void> {
        return this.healthcheckHealthcheckGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { EventsApiRequestFactory, EventsApiResponseProcessor} from "../apis/EventsApi";
export class ObservableEventsApi {
    private requestFactory: EventsApiRequestFactory;
    private responseProcessor: EventsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: EventsApiRequestFactory,
        responseProcessor?: EventsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EventsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EventsApiResponseProcessor();
    }

    /**
     * Comment Event
     * @param eventId
     * @param commentEventRequest
     */
    public commentEventWithHttpInfo(eventId: number, commentEventRequest?: CommentEventRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.commentEvent(eventId, commentEventRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.commentEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Comment Event
     * @param eventId
     * @param commentEventRequest
     */
    public commentEvent(eventId: number, commentEventRequest?: CommentEventRequest, _options?: Configuration): Observable<number> {
        return this.commentEventWithHttpInfo(eventId, commentEventRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Create Event Bookmark
     * @param eventId
     */
    public createEventBookmarkWithHttpInfo(eventId: number, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createEventBookmark(eventId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createEventBookmarkWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Event Bookmark
     * @param eventId
     */
    public createEventBookmark(eventId: number, _options?: Configuration): Observable<number> {
        return this.createEventBookmarkWithHttpInfo(eventId, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Delete Event Bookmark
     * @param eventId
     */
    public deleteEventBookmarkWithHttpInfo(eventId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteEventBookmark(eventId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteEventBookmarkWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Event Bookmark
     * @param eventId
     */
    public deleteEventBookmark(eventId: number, _options?: Configuration): Observable<void> {
        return this.deleteEventBookmarkWithHttpInfo(eventId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Delete Manual Check In
     * @param checkInId
     */
    public deleteManualCheckInWithHttpInfo(checkInId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteManualCheckIn(checkInId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteManualCheckInWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Manual Check In
     * @param checkInId
     */
    public deleteManualCheckIn(checkInId: number, _options?: Configuration): Observable<void> {
        return this.deleteManualCheckInWithHttpInfo(checkInId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Feedback Event
     * @param eventId
     * @param feedbackEventRequest
     */
    public feedbackEventWithHttpInfo(eventId: number, feedbackEventRequest?: FeedbackEventRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.feedbackEvent(eventId, feedbackEventRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.feedbackEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Feedback Event
     * @param eventId
     * @param feedbackEventRequest
     */
    public feedbackEvent(eventId: number, feedbackEventRequest?: FeedbackEventRequest, _options?: Configuration): Observable<number> {
        return this.feedbackEventWithHttpInfo(eventId, feedbackEventRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Generate Event Ai
     * @param generateEventAIRequest
     */
    public generateEventAiWithHttpInfo(generateEventAIRequest?: GenerateEventAIRequest, _options?: Configuration): Observable<HttpInfo<GenerateEventAIResponse>> {
        const requestContextPromise = this.requestFactory.generateEventAi(generateEventAIRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.generateEventAiWithHttpInfo(rsp)));
            }));
    }

    /**
     * Generate Event Ai
     * @param generateEventAIRequest
     */
    public generateEventAi(generateEventAIRequest?: GenerateEventAIRequest, _options?: Configuration): Observable<GenerateEventAIResponse> {
        return this.generateEventAiWithHttpInfo(generateEventAIRequest, _options).pipe(map((apiResponse: HttpInfo<GenerateEventAIResponse>) => apiResponse.data));
    }

    /**
     * Get Draft Event
     */
    public getDraftEventWithHttpInfo(_options?: Configuration): Observable<HttpInfo<GetDraftEventResponse>> {
        const requestContextPromise = this.requestFactory.getDraftEvent(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getDraftEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Draft Event
     */
    public getDraftEvent(_options?: Configuration): Observable<GetDraftEventResponse> {
        return this.getDraftEventWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<GetDraftEventResponse>) => apiResponse.data));
    }

    /**
     * Get Event Detail
     * @param slug
     */
    public getEventDetailWithHttpInfo(slug: string, _options?: Configuration): Observable<HttpInfo<GetEventDetailResponse>> {
        const requestContextPromise = this.requestFactory.getEventDetail(slug, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getEventDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Event Detail
     * @param slug
     */
    public getEventDetail(slug: string, _options?: Configuration): Observable<GetEventDetailResponse> {
        return this.getEventDetailWithHttpInfo(slug, _options).pipe(map((apiResponse: HttpInfo<GetEventDetailResponse>) => apiResponse.data));
    }

    /**
     * Listing Event Comments
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingEventCommentsWithHttpInfo(eventId: number, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingEventCommentsResponse>> {
        const requestContextPromise = this.requestFactory.listingEventComments(eventId, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingEventCommentsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Event Comments
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingEventComments(eventId: number, perPage?: number, page?: number, _options?: Configuration): Observable<ListingEventCommentsResponse> {
        return this.listingEventCommentsWithHttpInfo(eventId, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingEventCommentsResponse>) => apiResponse.data));
    }

    /**
     * Listing Event Options
     */
    public listingEventOptionsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingEventOptionsResponse>> {
        const requestContextPromise = this.requestFactory.listingEventOptions(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingEventOptionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Event Options
     */
    public listingEventOptions(_options?: Configuration): Observable<ListingEventOptionsResponse> {
        return this.listingEventOptionsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingEventOptionsResponse>) => apiResponse.data));
    }

    /**
     * Listing Event Purchased Tickets
     * @param slug
     * @param keyword
     * @param isCheckedIn
     * @param perPage
     * @param page
     */
    public listingEventPurchasedTicketsWithHttpInfo(slug: string, keyword?: string, isCheckedIn?: boolean, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingEventPurchasedTicketsResponse>> {
        const requestContextPromise = this.requestFactory.listingEventPurchasedTickets(slug, keyword, isCheckedIn, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingEventPurchasedTicketsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Event Purchased Tickets
     * @param slug
     * @param keyword
     * @param isCheckedIn
     * @param perPage
     * @param page
     */
    public listingEventPurchasedTickets(slug: string, keyword?: string, isCheckedIn?: boolean, perPage?: number, page?: number, _options?: Configuration): Observable<ListingEventPurchasedTicketsResponse> {
        return this.listingEventPurchasedTicketsWithHttpInfo(slug, keyword, isCheckedIn, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingEventPurchasedTicketsResponse>) => apiResponse.data));
    }

    /**
     * Listing Event Rank
     */
    public listingEventRankWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingEventRankResponse>> {
        const requestContextPromise = this.requestFactory.listingEventRank(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingEventRankWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Event Rank
     */
    public listingEventRank(_options?: Configuration): Observable<ListingEventRankResponse> {
        return this.listingEventRankWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingEventRankResponse>) => apiResponse.data));
    }

    /**
     * Listing Feedback Criteria
     * @param eventId
     */
    public listingFeedbackCriteriaWithHttpInfo(eventId: number, _options?: Configuration): Observable<HttpInfo<ListingFeedbackCriteriaResponse>> {
        const requestContextPromise = this.requestFactory.listingFeedbackCriteria(eventId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingFeedbackCriteriaWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Feedback Criteria
     * @param eventId
     */
    public listingFeedbackCriteria(eventId: number, _options?: Configuration): Observable<ListingFeedbackCriteriaResponse> {
        return this.listingFeedbackCriteriaWithHttpInfo(eventId, _options).pipe(map((apiResponse: HttpInfo<ListingFeedbackCriteriaResponse>) => apiResponse.data));
    }

    /**
     * Listing Feedbacks
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingFeedbacksWithHttpInfo(eventId: number, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingFeedbacksResponse>> {
        const requestContextPromise = this.requestFactory.listingFeedbacks(eventId, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingFeedbacksWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Feedbacks
     * @param eventId
     * @param perPage
     * @param page
     */
    public listingFeedbacks(eventId: number, perPage?: number, page?: number, _options?: Configuration): Observable<ListingFeedbacksResponse> {
        return this.listingFeedbacksWithHttpInfo(eventId, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingFeedbacksResponse>) => apiResponse.data));
    }

    /**
     * Listing My Events
     * @param keyword
     * @param status
     * @param perPage
     * @param page
     */
    public listingMyEventsWithHttpInfo(keyword?: string, status?: MyEventStatusCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingMyEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingMyEvents(keyword, status, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingMyEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing My Events
     * @param keyword
     * @param status
     * @param perPage
     * @param page
     */
    public listingMyEvents(keyword?: string, status?: MyEventStatusCode, perPage?: number, page?: number, _options?: Configuration): Observable<ListingMyEventsResponse> {
        return this.listingMyEventsWithHttpInfo(keyword, status, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingMyEventsResponse>) => apiResponse.data));
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
    public listingRecommendationEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingRecommendationEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingRecommendationEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingRecommendationEventsWithHttpInfo(rsp)));
            }));
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
    public listingRecommendationEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<ListingRecommendationEventsResponse> {
        return this.listingRecommendationEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingRecommendationEventsResponse>) => apiResponse.data));
    }

    /**
     * Listing Related Events
     * @param slug
     */
    public listingRelatedEventsWithHttpInfo(slug: string, _options?: Configuration): Observable<HttpInfo<ListingRelatedEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingRelatedEvents(slug, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingRelatedEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Related Events
     * @param slug
     */
    public listingRelatedEvents(slug: string, _options?: Configuration): Observable<ListingRelatedEventsResponse> {
        return this.listingRelatedEventsWithHttpInfo(slug, _options).pipe(map((apiResponse: HttpInfo<ListingRelatedEventsResponse>) => apiResponse.data));
    }

    /**
     * Listing Tickets Of Event
     * @param eventId
     */
    public listingTicketsOfEventWithHttpInfo(eventId: number, _options?: Configuration): Observable<HttpInfo<Array<TicketItem>>> {
        const requestContextPromise = this.requestFactory.listingTicketsOfEvent(eventId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTicketsOfEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Tickets Of Event
     * @param eventId
     */
    public listingTicketsOfEvent(eventId: number, _options?: Configuration): Observable<Array<TicketItem>> {
        return this.listingTicketsOfEventWithHttpInfo(eventId, _options).pipe(map((apiResponse: HttpInfo<Array<TicketItem>>) => apiResponse.data));
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
    public listingTrendingEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingTrendingEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingTrendingEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTrendingEventsWithHttpInfo(rsp)));
            }));
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
    public listingTrendingEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<ListingTrendingEventsResponse> {
        return this.listingTrendingEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingTrendingEventsResponse>) => apiResponse.data));
    }

    /**
     * Manual Check In
     * @param manualCheckInRequest
     */
    public manualCheckInWithHttpInfo(manualCheckInRequest?: ManualCheckInRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.manualCheckIn(manualCheckInRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.manualCheckInWithHttpInfo(rsp)));
            }));
    }

    /**
     * Manual Check In
     * @param manualCheckInRequest
     */
    public manualCheckIn(manualCheckInRequest?: ManualCheckInRequest, _options?: Configuration): Observable<number> {
        return this.manualCheckInWithHttpInfo(manualCheckInRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Publish Event
     * @param eventId
     * @param publishEventRequest
     */
    public publishEventWithHttpInfo(eventId: number, publishEventRequest?: PublishEventRequest, _options?: Configuration): Observable<HttpInfo<string>> {
        const requestContextPromise = this.requestFactory.publishEvent(eventId, publishEventRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.publishEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Publish Event
     * @param eventId
     * @param publishEventRequest
     */
    public publishEvent(eventId: number, publishEventRequest?: PublishEventRequest, _options?: Configuration): Observable<string> {
        return this.publishEventWithHttpInfo(eventId, publishEventRequest, _options).pipe(map((apiResponse: HttpInfo<string>) => apiResponse.data));
    }

    /**
     * Qr Check In
     * @param eventId
     * @param qRCheckInRequest
     */
    public qrCheckInWithHttpInfo(eventId: number, qRCheckInRequest?: QRCheckInRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.qrCheckIn(eventId, qRCheckInRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.qrCheckInWithHttpInfo(rsp)));
            }));
    }

    /**
     * Qr Check In
     * @param eventId
     * @param qRCheckInRequest
     */
    public qrCheckIn(eventId: number, qRCheckInRequest?: QRCheckInRequest, _options?: Configuration): Observable<number> {
        return this.qrCheckInWithHttpInfo(eventId, qRCheckInRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Save Draft Event
     * @param eventId
     * @param saveDraftEventRequest
     */
    public saveDraftEventWithHttpInfo(eventId: number, saveDraftEventRequest?: SaveDraftEventRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.saveDraftEvent(eventId, saveDraftEventRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.saveDraftEventWithHttpInfo(rsp)));
            }));
    }

    /**
     * Save Draft Event
     * @param eventId
     * @param saveDraftEventRequest
     */
    public saveDraftEvent(eventId: number, saveDraftEventRequest?: SaveDraftEventRequest, _options?: Configuration): Observable<number> {
        return this.saveDraftEventWithHttpInfo(eventId, saveDraftEventRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
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
    public searchEventsWithHttpInfo(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<SearchEventsResponse>> {
        const requestContextPromise = this.requestFactory.searchEvents(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchEventsWithHttpInfo(rsp)));
            }));
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
    public searchEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<SearchEventsResponse> {
        return this.searchEventsWithHttpInfo(keyword, isOnline, isOffline, isApplyOngoing, isApplyEnded, isToday, isFree, isPaid, jobTypeCodes, industryCodes, cityCodes, tags, startAtFrom, startAtTo, organizationId, sortBy, perPage, page, _options).pipe(map((apiResponse: HttpInfo<SearchEventsResponse>) => apiResponse.data));
    }

}

import { FeedbacksApiRequestFactory, FeedbacksApiResponseProcessor} from "../apis/FeedbacksApi";
export class ObservableFeedbacksApi {
    private requestFactory: FeedbacksApiRequestFactory;
    private responseProcessor: FeedbacksApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: FeedbacksApiRequestFactory,
        responseProcessor?: FeedbacksApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new FeedbacksApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new FeedbacksApiResponseProcessor();
    }

    /**
     * Delete Feedback
     * @param feedbackId
     */
    public deleteFeedbackWithHttpInfo(feedbackId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteFeedback(feedbackId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteFeedbackWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Feedback
     * @param feedbackId
     */
    public deleteFeedback(feedbackId: number, _options?: Configuration): Observable<void> {
        return this.deleteFeedbackWithHttpInfo(feedbackId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Update Feedback
     * @param feedbackId
     * @param updateFeedbackRequest
     */
    public updateFeedbackWithHttpInfo(feedbackId: number, updateFeedbackRequest?: UpdateFeedbackRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.updateFeedback(feedbackId, updateFeedbackRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateFeedbackWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update Feedback
     * @param feedbackId
     * @param updateFeedbackRequest
     */
    public updateFeedback(feedbackId: number, updateFeedbackRequest?: UpdateFeedbackRequest, _options?: Configuration): Observable<number> {
        return this.updateFeedbackWithHttpInfo(feedbackId, updateFeedbackRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

}

import { NotificationsApiRequestFactory, NotificationsApiResponseProcessor} from "../apis/NotificationsApi";
export class ObservableNotificationsApi {
    private requestFactory: NotificationsApiRequestFactory;
    private responseProcessor: NotificationsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: NotificationsApiRequestFactory,
        responseProcessor?: NotificationsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new NotificationsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new NotificationsApiResponseProcessor();
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param registerNotificationDeviceTokenRequest
     */
    public registerNotificationDeviceTokenWithHttpInfo(registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest, _options?: Configuration): Observable<HttpInfo<RegisterNotificationDeviceTokenResponse>> {
        const requestContextPromise = this.requestFactory.registerNotificationDeviceToken(registerNotificationDeviceTokenRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerNotificationDeviceTokenWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register or update a device token for push notifications
     * Register Notification Device Token
     * @param registerNotificationDeviceTokenRequest
     */
    public registerNotificationDeviceToken(registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest, _options?: Configuration): Observable<RegisterNotificationDeviceTokenResponse> {
        return this.registerNotificationDeviceTokenWithHttpInfo(registerNotificationDeviceTokenRequest, _options).pipe(map((apiResponse: HttpInfo<RegisterNotificationDeviceTokenResponse>) => apiResponse.data));
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param fcmToken
     */
    public removeNotificationDeviceTokenWithHttpInfo(fcmToken: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.removeNotificationDeviceToken(fcmToken, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.removeNotificationDeviceTokenWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove a device token when logging out
     * Remove Notification Device Token
     * @param fcmToken
     */
    public removeNotificationDeviceToken(fcmToken: string, _options?: Configuration): Observable<void> {
        return this.removeNotificationDeviceTokenWithHttpInfo(fcmToken, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { OrganizationsApiRequestFactory, OrganizationsApiResponseProcessor} from "../apis/OrganizationsApi";
export class ObservableOrganizationsApi {
    private requestFactory: OrganizationsApiRequestFactory;
    private responseProcessor: OrganizationsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: OrganizationsApiRequestFactory,
        responseProcessor?: OrganizationsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new OrganizationsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new OrganizationsApiResponseProcessor();
    }

    /**
     * Analyze Event Check Ins
     * @param slug
     */
    public analyzeEventCheckInsWithHttpInfo(slug: string, _options?: Configuration): Observable<HttpInfo<AnalyzeEventCheckInsResponse>> {
        const requestContextPromise = this.requestFactory.analyzeEventCheckIns(slug, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.analyzeEventCheckInsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Analyze Event Check Ins
     * @param slug
     */
    public analyzeEventCheckIns(slug: string, _options?: Configuration): Observable<AnalyzeEventCheckInsResponse> {
        return this.analyzeEventCheckInsWithHttpInfo(slug, _options).pipe(map((apiResponse: HttpInfo<AnalyzeEventCheckInsResponse>) => apiResponse.data));
    }

    /**
     * Analyze Event Tickets
     * @param slug
     * @param granularity The granularity of the data.
     */
    public analyzeEventTicketsWithHttpInfo(slug: string, granularity?: 'daily' | 'weekly' | 'monthly', _options?: Configuration): Observable<HttpInfo<AnalyzeEventTicketsResponse>> {
        const requestContextPromise = this.requestFactory.analyzeEventTickets(slug, granularity, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.analyzeEventTicketsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Analyze Event Tickets
     * @param slug
     * @param granularity The granularity of the data.
     */
    public analyzeEventTickets(slug: string, granularity?: 'daily' | 'weekly' | 'monthly', _options?: Configuration): Observable<AnalyzeEventTicketsResponse> {
        return this.analyzeEventTicketsWithHttpInfo(slug, granularity, _options).pipe(map((apiResponse: HttpInfo<AnalyzeEventTicketsResponse>) => apiResponse.data));
    }

    /**
     * Create Organization Follow
     * @param organizationId
     */
    public createOrganizationFollowWithHttpInfo(organizationId: number, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createOrganizationFollow(organizationId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createOrganizationFollowWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Organization Follow
     * @param organizationId
     */
    public createOrganizationFollow(organizationId: number, _options?: Configuration): Observable<number> {
        return this.createOrganizationFollowWithHttpInfo(organizationId, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Delete Organization Follow
     * @param organizationId
     */
    public deleteOrganizationFollowWithHttpInfo(organizationId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteOrganizationFollow(organizationId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteOrganizationFollowWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Organization Follow
     * @param organizationId
     */
    public deleteOrganizationFollow(organizationId: number, _options?: Configuration): Observable<void> {
        return this.deleteOrganizationFollowWithHttpInfo(organizationId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
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
    public downloadAttendeesCsvWithHttpInfo(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, withFilter?: boolean, page?: number, perPage?: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.downloadAttendeesCsv(keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, sortBy, withFilter, page, perPage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.downloadAttendeesCsvWithHttpInfo(rsp)));
            }));
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
    public downloadAttendeesCsv(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, withFilter?: boolean, page?: number, perPage?: number, _options?: Configuration): Observable<void> {
        return this.downloadAttendeesCsvWithHttpInfo(keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, sortBy, withFilter, page, perPage, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get Attendee Detail
     * @param attendeeId
     */
    public getAttendeeDetailWithHttpInfo(attendeeId: number, _options?: Configuration): Observable<HttpInfo<GetAttendeeDetailResponse>> {
        const requestContextPromise = this.requestFactory.getAttendeeDetail(attendeeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getAttendeeDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Attendee Detail
     * @param attendeeId
     */
    public getAttendeeDetail(attendeeId: number, _options?: Configuration): Observable<GetAttendeeDetailResponse> {
        return this.getAttendeeDetailWithHttpInfo(attendeeId, _options).pipe(map((apiResponse: HttpInfo<GetAttendeeDetailResponse>) => apiResponse.data));
    }

    /**
     * Get Organization Dashboard
     */
    public getOrganizationDashboardWithHttpInfo(_options?: Configuration): Observable<HttpInfo<GetOrganizationDashboardResponse>> {
        const requestContextPromise = this.requestFactory.getOrganizationDashboard(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getOrganizationDashboardWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Organization Dashboard
     */
    public getOrganizationDashboard(_options?: Configuration): Observable<GetOrganizationDashboardResponse> {
        return this.getOrganizationDashboardWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<GetOrganizationDashboardResponse>) => apiResponse.data));
    }

    /**
     * Get Organization Detail
     * @param organizationSlug
     */
    public getOrganizationDetailWithHttpInfo(organizationSlug: string, _options?: Configuration): Observable<HttpInfo<GetOrganizationDetailResponse>> {
        const requestContextPromise = this.requestFactory.getOrganizationDetail(organizationSlug, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getOrganizationDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Organization Detail
     * @param organizationSlug
     */
    public getOrganizationDetail(organizationSlug: string, _options?: Configuration): Observable<GetOrganizationDetailResponse> {
        return this.getOrganizationDetailWithHttpInfo(organizationSlug, _options).pipe(map((apiResponse: HttpInfo<GetOrganizationDetailResponse>) => apiResponse.data));
    }

    /**
     * Get Tag Stats
     */
    public getTagStatsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<GetTagStatsResponse>> {
        const requestContextPromise = this.requestFactory.getTagStats(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTagStatsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Tag Stats
     */
    public getTagStats(_options?: Configuration): Observable<GetTagStatsResponse> {
        return this.getTagStatsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<GetTagStatsResponse>) => apiResponse.data));
    }

    /**
     * Get Ticket Stats
     * @param eventId
     * @param startDate
     * @param endDate
     * @param ticketType
     * @param ticketStatus
     */
    public getTicketStatsWithHttpInfo(eventId?: number, startDate?: Date, endDate?: Date, ticketType?: TicketTypeCode, ticketStatus?: TicketStatusCode, _options?: Configuration): Observable<HttpInfo<GetTicketStatsResponse>> {
        const requestContextPromise = this.requestFactory.getTicketStats(eventId, startDate, endDate, ticketType, ticketStatus, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTicketStatsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Ticket Stats
     * @param eventId
     * @param startDate
     * @param endDate
     * @param ticketType
     * @param ticketStatus
     */
    public getTicketStats(eventId?: number, startDate?: Date, endDate?: Date, ticketType?: TicketTypeCode, ticketStatus?: TicketStatusCode, _options?: Configuration): Observable<GetTicketStatsResponse> {
        return this.getTicketStatsWithHttpInfo(eventId, startDate, endDate, ticketType, ticketStatus, _options).pipe(map((apiResponse: HttpInfo<GetTicketStatsResponse>) => apiResponse.data));
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
    public listingAttendeesWithHttpInfo(slug?: string, eventId?: number, keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, ticketTypeCode?: TicketTypeCode, sortBy?: AttendeeSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingAttendeesResponse>> {
        const requestContextPromise = this.requestFactory.listingAttendees(slug, eventId, keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, ticketTypeCode, sortBy, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingAttendeesWithHttpInfo(rsp)));
            }));
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
    public listingAttendees(slug?: string, eventId?: number, keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, ticketTypeCode?: TicketTypeCode, sortBy?: AttendeeSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<ListingAttendeesResponse> {
        return this.listingAttendeesWithHttpInfo(slug, eventId, keyword, applyAtFrom, applyAtTo, isCheckedIn, jobTypeCode, industryCode, ticketTypeCode, sortBy, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingAttendeesResponse>) => apiResponse.data));
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
    public listingAttendeesRankingWithHttpInfo(keyword?: string, eventId?: number, month?: number, year?: number, page?: number, perPage?: number, _options?: Configuration): Observable<HttpInfo<Array<ListingAttendeesRankingItem>>> {
        const requestContextPromise = this.requestFactory.listingAttendeesRanking(keyword, eventId, month, year, page, perPage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingAttendeesRankingWithHttpInfo(rsp)));
            }));
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
    public listingAttendeesRanking(keyword?: string, eventId?: number, month?: number, year?: number, page?: number, perPage?: number, _options?: Configuration): Observable<Array<ListingAttendeesRankingItem>> {
        return this.listingAttendeesRankingWithHttpInfo(keyword, eventId, month, year, page, perPage, _options).pipe(map((apiResponse: HttpInfo<Array<ListingAttendeesRankingItem>>) => apiResponse.data));
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
    public listingOrganizationEventsWithHttpInfo(keyword?: string, tags?: Array<number>, meetingToolCodes?: Array<EventMeetingToolCode>, startAtFrom?: string, startAtTo?: string, eventStatus?: Array<EventStatusCode>, timeStatus?: EventTimeStatusCode, sortBy?: ManageEventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<HttpInfo<ListingOrganizationEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingOrganizationEvents(keyword, tags, meetingToolCodes, startAtFrom, startAtTo, eventStatus, timeStatus, sortBy, perPage, page, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingOrganizationEventsWithHttpInfo(rsp)));
            }));
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
    public listingOrganizationEvents(keyword?: string, tags?: Array<number>, meetingToolCodes?: Array<EventMeetingToolCode>, startAtFrom?: string, startAtTo?: string, eventStatus?: Array<EventStatusCode>, timeStatus?: EventTimeStatusCode, sortBy?: ManageEventSortByCode, perPage?: number, page?: number, _options?: Configuration): Observable<ListingOrganizationEventsResponse> {
        return this.listingOrganizationEventsWithHttpInfo(keyword, tags, meetingToolCodes, startAtFrom, startAtTo, eventStatus, timeStatus, sortBy, perPage, page, _options).pipe(map((apiResponse: HttpInfo<ListingOrganizationEventsResponse>) => apiResponse.data));
    }

    /**
     * Listing Organization Events Timeline
     */
    public listingOrganizationEventsTimelineWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<ListingOrganizationEventsTimelineItem>>> {
        const requestContextPromise = this.requestFactory.listingOrganizationEventsTimeline(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingOrganizationEventsTimelineWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Organization Events Timeline
     */
    public listingOrganizationEventsTimeline(_options?: Configuration): Observable<Array<ListingOrganizationEventsTimelineItem>> {
        return this.listingOrganizationEventsTimelineWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<ListingOrganizationEventsTimelineItem>>) => apiResponse.data));
    }

    /**
     * Listing Random Organizations
     */
    public listingRandomOrganizationsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingRandomOrganizationsResponse>> {
        const requestContextPromise = this.requestFactory.listingRandomOrganizations(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingRandomOrganizationsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Random Organizations
     */
    public listingRandomOrganizations(_options?: Configuration): Observable<ListingRandomOrganizationsResponse> {
        return this.listingRandomOrganizationsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingRandomOrganizationsResponse>) => apiResponse.data));
    }

    /**
     * Listing Top Organization Events
     * @param organizationId
     */
    public listingTopOrganizationEventsWithHttpInfo(organizationId: number, _options?: Configuration): Observable<HttpInfo<ListingTopOrganizationEventsResponse>> {
        const requestContextPromise = this.requestFactory.listingTopOrganizationEvents(organizationId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTopOrganizationEventsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Top Organization Events
     * @param organizationId
     */
    public listingTopOrganizationEvents(organizationId: number, _options?: Configuration): Observable<ListingTopOrganizationEventsResponse> {
        return this.listingTopOrganizationEventsWithHttpInfo(organizationId, _options).pipe(map((apiResponse: HttpInfo<ListingTopOrganizationEventsResponse>) => apiResponse.data));
    }

    /**
     * Register Organization
     * @param registerOrganizationRequest
     */
    public registerOrganizationWithHttpInfo(registerOrganizationRequest?: RegisterOrganizationRequest, _options?: Configuration): Observable<HttpInfo<RegisterOrganizationResponse>> {
        const requestContextPromise = this.requestFactory.registerOrganization(registerOrganizationRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerOrganizationWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register Organization
     * @param registerOrganizationRequest
     */
    public registerOrganization(registerOrganizationRequest?: RegisterOrganizationRequest, _options?: Configuration): Observable<RegisterOrganizationResponse> {
        return this.registerOrganizationWithHttpInfo(registerOrganizationRequest, _options).pipe(map((apiResponse: HttpInfo<RegisterOrganizationResponse>) => apiResponse.data));
    }

    /**
     * Track User Actions
     * @param timeRange
     * @param groupBy
     * @param actionTypes
     * @param eventId
     * @param topN
     */
    public trackUserActionsWithHttpInfo(timeRange?: TrackingTimeRangeCode, groupBy?: TrackingTimeRangeCode, actionTypes?: Array<UserActionTypeCode>, eventId?: number, topN?: number, _options?: Configuration): Observable<HttpInfo<TrackUserActionsResponse>> {
        const requestContextPromise = this.requestFactory.trackUserActions(timeRange, groupBy, actionTypes, eventId, topN, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.trackUserActionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Track User Actions
     * @param timeRange
     * @param groupBy
     * @param actionTypes
     * @param eventId
     * @param topN
     */
    public trackUserActions(timeRange?: TrackingTimeRangeCode, groupBy?: TrackingTimeRangeCode, actionTypes?: Array<UserActionTypeCode>, eventId?: number, topN?: number, _options?: Configuration): Observable<TrackUserActionsResponse> {
        return this.trackUserActionsWithHttpInfo(timeRange, groupBy, actionTypes, eventId, topN, _options).pipe(map((apiResponse: HttpInfo<TrackUserActionsResponse>) => apiResponse.data));
    }

}

import { SpeakersApiRequestFactory, SpeakersApiResponseProcessor} from "../apis/SpeakersApi";
export class ObservableSpeakersApi {
    private requestFactory: SpeakersApiRequestFactory;
    private responseProcessor: SpeakersApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpeakersApiRequestFactory,
        responseProcessor?: SpeakersApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpeakersApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpeakersApiResponseProcessor();
    }

    /**
     * Get Speaker Detail
     * @param slug
     */
    public getSpeakerDetailWithHttpInfo(slug: string, _options?: Configuration): Observable<HttpInfo<GetSpeakerDetailResponse>> {
        const requestContextPromise = this.requestFactory.getSpeakerDetail(slug, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpeakerDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Speaker Detail
     * @param slug
     */
    public getSpeakerDetail(slug: string, _options?: Configuration): Observable<GetSpeakerDetailResponse> {
        return this.getSpeakerDetailWithHttpInfo(slug, _options).pipe(map((apiResponse: HttpInfo<GetSpeakerDetailResponse>) => apiResponse.data));
    }

    /**
     * Listing Random Speakers
     */
    public listingRandomSpeakersWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingRandomSpeakersResponse>> {
        const requestContextPromise = this.requestFactory.listingRandomSpeakers(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingRandomSpeakersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Random Speakers
     */
    public listingRandomSpeakers(_options?: Configuration): Observable<ListingRandomSpeakersResponse> {
        return this.listingRandomSpeakersWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingRandomSpeakersResponse>) => apiResponse.data));
    }

}

import { SurveysApiRequestFactory, SurveysApiResponseProcessor} from "../apis/SurveysApi";
export class ObservableSurveysApi {
    private requestFactory: SurveysApiRequestFactory;
    private responseProcessor: SurveysApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SurveysApiRequestFactory,
        responseProcessor?: SurveysApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SurveysApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SurveysApiResponseProcessor();
    }

    /**
     * Create Survey
     * @param createSurveyRequest
     */
    public createSurveyWithHttpInfo(createSurveyRequest?: CreateSurveyRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createSurvey(createSurveyRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createSurveyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Survey
     * @param createSurveyRequest
     */
    public createSurvey(createSurveyRequest?: CreateSurveyRequest, _options?: Configuration): Observable<number> {
        return this.createSurveyWithHttpInfo(createSurveyRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Listing Survey Options
     */
    public listingSurveyOptionsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<ListingSurveyOptionsItem>>> {
        const requestContextPromise = this.requestFactory.listingSurveyOptions(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingSurveyOptionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Survey Options
     */
    public listingSurveyOptions(_options?: Configuration): Observable<Array<ListingSurveyOptionsItem>> {
        return this.listingSurveyOptionsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<ListingSurveyOptionsItem>>) => apiResponse.data));
    }

}

import { TagsApiRequestFactory, TagsApiResponseProcessor} from "../apis/TagsApi";
export class ObservableTagsApi {
    private requestFactory: TagsApiRequestFactory;
    private responseProcessor: TagsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TagsApiRequestFactory,
        responseProcessor?: TagsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TagsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TagsApiResponseProcessor();
    }

    /**
     * Listing Tag Rank
     */
    public listingTagRankWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingTagRankResponse>> {
        const requestContextPromise = this.requestFactory.listingTagRank(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTagRankWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Tag Rank
     */
    public listingTagRank(_options?: Configuration): Observable<ListingTagRankResponse> {
        return this.listingTagRankWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingTagRankResponse>) => apiResponse.data));
    }

    /**
     * Listing Tags
     */
    public listingTagsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ListingTagsResponse>> {
        const requestContextPromise = this.requestFactory.listingTags(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTagsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Tags
     */
    public listingTags(_options?: Configuration): Observable<ListingTagsResponse> {
        return this.listingTagsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListingTagsResponse>) => apiResponse.data));
    }

}

import { TargetsApiRequestFactory, TargetsApiResponseProcessor} from "../apis/TargetsApi";
export class ObservableTargetsApi {
    private requestFactory: TargetsApiRequestFactory;
    private responseProcessor: TargetsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TargetsApiRequestFactory,
        responseProcessor?: TargetsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TargetsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TargetsApiResponseProcessor();
    }

    /**
     * Create Target
     * @param createTargetRequest
     */
    public createTargetWithHttpInfo(createTargetRequest?: CreateTargetRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createTarget(createTargetRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createTargetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Target
     * @param createTargetRequest
     */
    public createTarget(createTargetRequest?: CreateTargetRequest, _options?: Configuration): Observable<number> {
        return this.createTargetWithHttpInfo(createTargetRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Listing Target Options
     */
    public listingTargetOptionsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<ListingTargetOptionsItem>>> {
        const requestContextPromise = this.requestFactory.listingTargetOptions(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingTargetOptionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Target Options
     */
    public listingTargetOptions(_options?: Configuration): Observable<Array<ListingTargetOptionsItem>> {
        return this.listingTargetOptionsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<ListingTargetOptionsItem>>) => apiResponse.data));
    }

}

import { TicketsApiRequestFactory, TicketsApiResponseProcessor} from "../apis/TicketsApi";
export class ObservableTicketsApi {
    private requestFactory: TicketsApiRequestFactory;
    private responseProcessor: TicketsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TicketsApiRequestFactory,
        responseProcessor?: TicketsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TicketsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TicketsApiResponseProcessor();
    }

    /**
     * Cancel Tickets
     * @param cancelTicketsRequest
     */
    public cancelTicketsWithHttpInfo(cancelTicketsRequest?: CancelTicketsRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.cancelTickets(cancelTicketsRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.cancelTicketsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Cancel Tickets
     * @param cancelTicketsRequest
     */
    public cancelTickets(cancelTicketsRequest?: CancelTicketsRequest, _options?: Configuration): Observable<number> {
        return this.cancelTicketsWithHttpInfo(cancelTicketsRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Create Ticket
     * @param createTicketRequest
     */
    public createTicketWithHttpInfo(createTicketRequest?: CreateTicketRequest, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.createTicket(createTicketRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createTicketWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Ticket
     * @param createTicketRequest
     */
    public createTicket(createTicketRequest?: CreateTicketRequest, _options?: Configuration): Observable<number> {
        return this.createTicketWithHttpInfo(createTicketRequest, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Delete Ticket
     * @param ticketId
     */
    public deleteTicketWithHttpInfo(ticketId: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteTicket(ticketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteTicketWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Ticket
     * @param ticketId
     */
    public deleteTicket(ticketId: number, _options?: Configuration): Observable<void> {
        return this.deleteTicketWithHttpInfo(ticketId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get Draft Ticket
     * @param ticketId
     */
    public getDraftTicketWithHttpInfo(ticketId: number, _options?: Configuration): Observable<HttpInfo<Ticket>> {
        const requestContextPromise = this.requestFactory.getDraftTicket(ticketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getDraftTicketWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Draft Ticket
     * @param ticketId
     */
    public getDraftTicket(ticketId: number, _options?: Configuration): Observable<Ticket> {
        return this.getDraftTicketWithHttpInfo(ticketId, _options).pipe(map((apiResponse: HttpInfo<Ticket>) => apiResponse.data));
    }

    /**
     * Update Ticket
     * @param ticketId
     * @param updateTicketRequest
     */
    public updateTicketWithHttpInfo(ticketId: number, updateTicketRequest?: UpdateTicketRequest, _options?: Configuration): Observable<HttpInfo<TicketItem>> {
        const requestContextPromise = this.requestFactory.updateTicket(ticketId, updateTicketRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateTicketWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update Ticket
     * @param ticketId
     * @param updateTicketRequest
     */
    public updateTicket(ticketId: number, updateTicketRequest?: UpdateTicketRequest, _options?: Configuration): Observable<TicketItem> {
        return this.updateTicketWithHttpInfo(ticketId, updateTicketRequest, _options).pipe(map((apiResponse: HttpInfo<TicketItem>) => apiResponse.data));
    }

}

import { TransactionsApiRequestFactory, TransactionsApiResponseProcessor} from "../apis/TransactionsApi";
export class ObservableTransactionsApi {
    private requestFactory: TransactionsApiRequestFactory;
    private responseProcessor: TransactionsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TransactionsApiRequestFactory,
        responseProcessor?: TransactionsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TransactionsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TransactionsApiResponseProcessor();
    }

    /**
     * Get Transaction Status Counts
     */
    public getTransactionStatusCountsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<GetTransactionStatusCountsResponse>> {
        const requestContextPromise = this.requestFactory.getTransactionStatusCounts(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTransactionStatusCountsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Transaction Status Counts
     */
    public getTransactionStatusCounts(_options?: Configuration): Observable<GetTransactionStatusCountsResponse> {
        return this.getTransactionStatusCountsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<GetTransactionStatusCountsResponse>) => apiResponse.data));
    }

    /**
     * Handle Transaction
     */
    public handleTransactionWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.handleTransaction(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.handleTransactionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Handle Transaction
     */
    public handleTransaction(_options?: Configuration): Observable<void> {
        return this.handleTransactionWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Listing My Transactions
     * @param keyword
     * @param status
     * @param transactionId
     * @param page
     * @param perPage
     */
    public listingMyTransactionsWithHttpInfo(keyword?: string, status?: TransactionStatusCode, transactionId?: number, page?: number, perPage?: number, _options?: Configuration): Observable<HttpInfo<ListingMyTransactionsResponse>> {
        const requestContextPromise = this.requestFactory.listingMyTransactions(keyword, status, transactionId, page, perPage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingMyTransactionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing My Transactions
     * @param keyword
     * @param status
     * @param transactionId
     * @param page
     * @param perPage
     */
    public listingMyTransactions(keyword?: string, status?: TransactionStatusCode, transactionId?: number, page?: number, perPage?: number, _options?: Configuration): Observable<ListingMyTransactionsResponse> {
        return this.listingMyTransactionsWithHttpInfo(keyword, status, transactionId, page, perPage, _options).pipe(map((apiResponse: HttpInfo<ListingMyTransactionsResponse>) => apiResponse.data));
    }

}

import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";
export class ObservableUsersApi {
    private requestFactory: UsersApiRequestFactory;
    private responseProcessor: UsersApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersApiRequestFactory,
        responseProcessor?: UsersApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UsersApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UsersApiResponseProcessor();
    }

    /**
     * Get Total Unread Notifications
     */
    public getTotalUnreadNotificationsWithHttpInfo(_options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.getTotalUnreadNotifications(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTotalUnreadNotificationsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Total Unread Notifications
     */
    public getTotalUnreadNotifications(_options?: Configuration): Observable<number> {
        return this.getTotalUnreadNotificationsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Listing Notifications
     * @param perPage
     * @param page
     * @param isRead
     */
    public listingNotificationsWithHttpInfo(perPage?: number, page?: number, isRead?: boolean, _options?: Configuration): Observable<HttpInfo<ListingNotificationsResponse>> {
        const requestContextPromise = this.requestFactory.listingNotifications(perPage, page, isRead, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listingNotificationsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Listing Notifications
     * @param perPage
     * @param page
     * @param isRead
     */
    public listingNotifications(perPage?: number, page?: number, isRead?: boolean, _options?: Configuration): Observable<ListingNotificationsResponse> {
        return this.listingNotificationsWithHttpInfo(perPage, page, isRead, _options).pipe(map((apiResponse: HttpInfo<ListingNotificationsResponse>) => apiResponse.data));
    }

    /**
     * Mark Notification As Read
     * @param notificationId
     */
    public markNotificationAsReadWithHttpInfo(notificationId: number, _options?: Configuration): Observable<HttpInfo<number>> {
        const requestContextPromise = this.requestFactory.markNotificationAsRead(notificationId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.markNotificationAsReadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Mark Notification As Read
     * @param notificationId
     */
    public markNotificationAsRead(notificationId: number, _options?: Configuration): Observable<number> {
        return this.markNotificationAsReadWithHttpInfo(notificationId, _options).pipe(map((apiResponse: HttpInfo<number>) => apiResponse.data));
    }

    /**
     * Update Audience
     * @param updateUserRequest
     */
    public updateAudienceWithHttpInfo(updateUserRequest: UpdateUserRequest, _options?: Configuration): Observable<HttpInfo<GetMeResponse>> {
        const requestContextPromise = this.requestFactory.updateAudience(updateUserRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateAudienceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update Audience
     * @param updateUserRequest
     */
    public updateAudience(updateUserRequest: UpdateUserRequest, _options?: Configuration): Observable<GetMeResponse> {
        return this.updateAudienceWithHttpInfo(updateUserRequest, _options).pipe(map((apiResponse: HttpInfo<GetMeResponse>) => apiResponse.data));
    }

}
