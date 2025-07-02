// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';


    import type { CommentEventRequest } from '../models/CommentEventRequest';
    import type { CreateDraftEventRequest } from '../models/CreateDraftEventRequest';
    import type { CreateSurveyResponseResultRequest } from '../models/CreateSurveyResponseResultRequest';
    import type { ErrorResponse400 } from '../models/ErrorResponse400';
    import type { ErrorResponse401 } from '../models/ErrorResponse401';
    import type { ErrorResponse403 } from '../models/ErrorResponse403';
    import type { EventSortByCode } from '../models/EventSortByCode';
    import type { GenerateEventAIRequest } from '../models/GenerateEventAIRequest';
    import type { GenerateEventAIResponse } from '../models/GenerateEventAIResponse';
    import type { GetDraftEventResponse } from '../models/GetDraftEventResponse';
    import type { GetEventDetailResponse } from '../models/GetEventDetailResponse';
    import type { GetEventSurveyResponse } from '../models/GetEventSurveyResponse';
    import type { HTTPValidationError } from '../models/HTTPValidationError';
    import type { IndustryCode } from '../models/IndustryCode';
    import type { JobTypeCode } from '../models/JobTypeCode';
    import type { ListingEventCommentsResponse } from '../models/ListingEventCommentsResponse';
    import type { ListingEventOptionsResponse } from '../models/ListingEventOptionsResponse';
    import type { ListingEventPurchasedTicketsResponse } from '../models/ListingEventPurchasedTicketsResponse';
    import type { ListingEventRankResponse } from '../models/ListingEventRankResponse';
    import type { ListingMyEventsResponse } from '../models/ListingMyEventsResponse';
    import type { ListingRecommendationEventsResponse } from '../models/ListingRecommendationEventsResponse';
    import type { ListingRelatedEventsResponse } from '../models/ListingRelatedEventsResponse';
    import type { ListingTrendingEventsResponse } from '../models/ListingTrendingEventsResponse';
    import type { ManualCheckInRequest } from '../models/ManualCheckInRequest';
    import type { MyEventStatusCode } from '../models/MyEventStatusCode';
    import type { PublishEventRequest } from '../models/PublishEventRequest';
    import type { QRCheckInRequest } from '../models/QRCheckInRequest';
    import type { SaveDraftEventRequest } from '../models/SaveDraftEventRequest';
    import type { SearchEventsResponse } from '../models/SearchEventsResponse';
    import type { TicketItem } from '../models/TicketItem';

    /**
    * no description
    */
    export class EventsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Comment Event
            * @param eventId
            * @param commentEventRequest
        */
        public async commentEvent(eventId: number, commentEventRequest?: CommentEventRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "commentEvent", "eventId");
                    }



            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/comments'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(commentEventRequest, "CommentEventRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Create Draft Event
            * @param createDraftEventRequest
        */
        public async createDraftEvent(createDraftEventRequest?: CreateDraftEventRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/events/draft';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(createDraftEventRequest, "CreateDraftEventRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Create Event Bookmark
            * @param eventId
        */
        public async createEventBookmark(eventId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "createEventBookmark", "eventId");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/bookmark'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Create Survey Response Result
            * @param eventId
            * @param createSurveyResponseResultRequest
        */
        public async createSurveyResponseResult(eventId: number, createSurveyResponseResultRequest?: CreateSurveyResponseResultRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "createSurveyResponseResult", "eventId");
                    }



            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/survey'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(createSurveyResponseResultRequest, "CreateSurveyResponseResultRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Delete Event Bookmark
            * @param eventId
        */
        public async deleteEventBookmark(eventId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "deleteEventBookmark", "eventId");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/bookmark'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Delete Manual Check In
            * @param checkInId
        */
        public async deleteManualCheckIn(checkInId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'checkInId' is not null or undefined
                    if (checkInId === null || checkInId === undefined) {
                    throw new RequiredError("EventsApi", "deleteManualCheckIn", "checkInId");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/check-in/manual/{check_in_id}'
                .replace('{' + 'check_in_id' + '}', encodeURIComponent(String(checkInId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Generate Event Ai
            * @param generateEventAIRequest
        */
        public async generateEventAi(generateEventAIRequest?: GenerateEventAIRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/events/ai/draft';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(generateEventAIRequest, "GenerateEventAIRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Get Draft Event
        */
        public async getDraftEvent(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/events/draft';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Get Event Detail
            * @param slug
        */
        public async getEventDetail(slug: string, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'slug' is not null or undefined
                    if (slug === null || slug === undefined) {
                    throw new RequiredError("EventsApi", "getEventDetail", "slug");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{slug}'
                .replace('{' + 'slug' + '}', encodeURIComponent(String(slug)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Get Event Survey
            * @param eventId
        */
        public async getEventSurvey(eventId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "getEventSurvey", "eventId");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/survey'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Event Comments
            * @param eventId
            * @param perPage
            * @param page
        */
        public async listingEventComments(eventId: number, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "listingEventComments", "eventId");
                    }




            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/comments'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Event Options
        */
        public async listingEventOptions(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/events/options';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Event Purchased Tickets
            * @param slug
            * @param keyword
            * @param isCheckedIn
            * @param perPage
            * @param page
        */
        public async listingEventPurchasedTickets(slug: string, keyword?: string, isCheckedIn?: boolean, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'slug' is not null or undefined
                    if (slug === null || slug === undefined) {
                    throw new RequiredError("EventsApi", "listingEventPurchasedTickets", "slug");
                    }






            // Path Params
            const localVarPath = '/api/v1/events/{slug}/purchased-tickets'
                .replace('{' + 'slug' + '}', encodeURIComponent(String(slug)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (isCheckedIn !== undefined) {
                requestContext.setQueryParam("is_checked_in", ObjectSerializer.serialize(isCheckedIn, "boolean", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Event Rank
        */
        public async listingEventRank(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/events/rank';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing My Events
            * @param keyword
            * @param status
            * @param perPage
            * @param page
        */
        public async listingMyEvents(keyword?: string, status?: MyEventStatusCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;





            // Path Params
            const localVarPath = '/api/v1/events/my-events';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer.serialize(status, "MyEventStatusCode", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
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
        public async listingRecommendationEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;



















            // Path Params
            const localVarPath = '/api/v1/events/recommendation';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (isOnline !== undefined) {
                requestContext.setQueryParam("is_online", ObjectSerializer.serialize(isOnline, "boolean", ""));
                }

                // Query Params
                if (isOffline !== undefined) {
                requestContext.setQueryParam("is_offline", ObjectSerializer.serialize(isOffline, "boolean", ""));
                }

                // Query Params
                if (isApplyOngoing !== undefined) {
                requestContext.setQueryParam("is_apply_ongoing", ObjectSerializer.serialize(isApplyOngoing, "boolean", ""));
                }

                // Query Params
                if (isApplyEnded !== undefined) {
                requestContext.setQueryParam("is_apply_ended", ObjectSerializer.serialize(isApplyEnded, "boolean", ""));
                }

                // Query Params
                if (isToday !== undefined) {
                requestContext.setQueryParam("is_today", ObjectSerializer.serialize(isToday, "boolean", ""));
                }

                // Query Params
                if (isFree !== undefined) {
                requestContext.setQueryParam("is_free", ObjectSerializer.serialize(isFree, "boolean", ""));
                }

                // Query Params
                if (isPaid !== undefined) {
                requestContext.setQueryParam("is_paid", ObjectSerializer.serialize(isPaid, "boolean", ""));
                }

                // Query Params
                if (jobTypeCodes !== undefined) {
                requestContext.setQueryParam("job_type_codes", ObjectSerializer.serialize(jobTypeCodes, "Array<JobTypeCode>", ""));
                }

                // Query Params
                if (industryCodes !== undefined) {
                requestContext.setQueryParam("industry_codes", ObjectSerializer.serialize(industryCodes, "Array<IndustryCode>", ""));
                }

                // Query Params
                if (cityCodes !== undefined) {
                requestContext.setQueryParam("city_codes", ObjectSerializer.serialize(cityCodes, "Array<string>", ""));
                }

                // Query Params
                if (tags !== undefined) {
                requestContext.setQueryParam("tags", ObjectSerializer.serialize(tags, "Array<number>", ""));
                }

                // Query Params
                if (startAtFrom !== undefined) {
                requestContext.setQueryParam("start_at_from", ObjectSerializer.serialize(startAtFrom, "string", ""));
                }

                // Query Params
                if (startAtTo !== undefined) {
                requestContext.setQueryParam("start_at_to", ObjectSerializer.serialize(startAtTo, "string", ""));
                }

                // Query Params
                if (organizationId !== undefined) {
                requestContext.setQueryParam("organization_id", ObjectSerializer.serialize(organizationId, "number", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "EventSortByCode", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Related Events
            * @param slug
        */
        public async listingRelatedEvents(slug: string, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'slug' is not null or undefined
                    if (slug === null || slug === undefined) {
                    throw new RequiredError("EventsApi", "listingRelatedEvents", "slug");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{slug}/related-events'
                .replace('{' + 'slug' + '}', encodeURIComponent(String(slug)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Tickets Of Event
            * @param eventId
        */
        public async listingTicketsOfEvent(eventId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "listingTicketsOfEvent", "eventId");
                    }


            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/tickets'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
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
        public async listingTrendingEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;



















            // Path Params
            const localVarPath = '/api/v1/events/trending';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (isOnline !== undefined) {
                requestContext.setQueryParam("is_online", ObjectSerializer.serialize(isOnline, "boolean", ""));
                }

                // Query Params
                if (isOffline !== undefined) {
                requestContext.setQueryParam("is_offline", ObjectSerializer.serialize(isOffline, "boolean", ""));
                }

                // Query Params
                if (isApplyOngoing !== undefined) {
                requestContext.setQueryParam("is_apply_ongoing", ObjectSerializer.serialize(isApplyOngoing, "boolean", ""));
                }

                // Query Params
                if (isApplyEnded !== undefined) {
                requestContext.setQueryParam("is_apply_ended", ObjectSerializer.serialize(isApplyEnded, "boolean", ""));
                }

                // Query Params
                if (isToday !== undefined) {
                requestContext.setQueryParam("is_today", ObjectSerializer.serialize(isToday, "boolean", ""));
                }

                // Query Params
                if (isFree !== undefined) {
                requestContext.setQueryParam("is_free", ObjectSerializer.serialize(isFree, "boolean", ""));
                }

                // Query Params
                if (isPaid !== undefined) {
                requestContext.setQueryParam("is_paid", ObjectSerializer.serialize(isPaid, "boolean", ""));
                }

                // Query Params
                if (jobTypeCodes !== undefined) {
                requestContext.setQueryParam("job_type_codes", ObjectSerializer.serialize(jobTypeCodes, "Array<JobTypeCode>", ""));
                }

                // Query Params
                if (industryCodes !== undefined) {
                requestContext.setQueryParam("industry_codes", ObjectSerializer.serialize(industryCodes, "Array<IndustryCode>", ""));
                }

                // Query Params
                if (cityCodes !== undefined) {
                requestContext.setQueryParam("city_codes", ObjectSerializer.serialize(cityCodes, "Array<string>", ""));
                }

                // Query Params
                if (tags !== undefined) {
                requestContext.setQueryParam("tags", ObjectSerializer.serialize(tags, "Array<number>", ""));
                }

                // Query Params
                if (startAtFrom !== undefined) {
                requestContext.setQueryParam("start_at_from", ObjectSerializer.serialize(startAtFrom, "string", ""));
                }

                // Query Params
                if (startAtTo !== undefined) {
                requestContext.setQueryParam("start_at_to", ObjectSerializer.serialize(startAtTo, "string", ""));
                }

                // Query Params
                if (organizationId !== undefined) {
                requestContext.setQueryParam("organization_id", ObjectSerializer.serialize(organizationId, "number", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "EventSortByCode", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Manual Check In
            * @param manualCheckInRequest
        */
        public async manualCheckIn(manualCheckInRequest?: ManualCheckInRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/events/check-in/manual';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(manualCheckInRequest, "ManualCheckInRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Publish Event
            * @param eventId
            * @param publishEventRequest
        */
        public async publishEvent(eventId: number, publishEventRequest?: PublishEventRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "publishEvent", "eventId");
                    }



            // Path Params
            const localVarPath = '/api/v1/events/{event_id}'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(publishEventRequest, "PublishEventRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Qr Check In
            * @param eventId
            * @param qRCheckInRequest
        */
        public async qrCheckIn(eventId: number, qRCheckInRequest?: QRCheckInRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "qrCheckIn", "eventId");
                    }



            // Path Params
            const localVarPath = '/api/v1/events/{event_id}/check-in/qr'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(qRCheckInRequest, "QRCheckInRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Save Draft Event
            * @param eventId
            * @param saveDraftEventRequest
        */
        public async saveDraftEvent(eventId: number, saveDraftEventRequest?: SaveDraftEventRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'eventId' is not null or undefined
                    if (eventId === null || eventId === undefined) {
                    throw new RequiredError("EventsApi", "saveDraftEvent", "eventId");
                    }



            // Path Params
            const localVarPath = '/api/v1/events/draft/{event_id}'
                .replace('{' + 'event_id' + '}', encodeURIComponent(String(eventId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(saveDraftEventRequest, "SaveDraftEventRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
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
        public async searchEvents(keyword?: string, isOnline?: boolean, isOffline?: boolean, isApplyOngoing?: boolean, isApplyEnded?: boolean, isToday?: boolean, isFree?: boolean, isPaid?: boolean, jobTypeCodes?: Array<JobTypeCode>, industryCodes?: Array<IndustryCode>, cityCodes?: Array<string>, tags?: Array<number>, startAtFrom?: string, startAtTo?: string, organizationId?: number, sortBy?: EventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;



















            // Path Params
            const localVarPath = '/api/v1/events';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (isOnline !== undefined) {
                requestContext.setQueryParam("is_online", ObjectSerializer.serialize(isOnline, "boolean", ""));
                }

                // Query Params
                if (isOffline !== undefined) {
                requestContext.setQueryParam("is_offline", ObjectSerializer.serialize(isOffline, "boolean", ""));
                }

                // Query Params
                if (isApplyOngoing !== undefined) {
                requestContext.setQueryParam("is_apply_ongoing", ObjectSerializer.serialize(isApplyOngoing, "boolean", ""));
                }

                // Query Params
                if (isApplyEnded !== undefined) {
                requestContext.setQueryParam("is_apply_ended", ObjectSerializer.serialize(isApplyEnded, "boolean", ""));
                }

                // Query Params
                if (isToday !== undefined) {
                requestContext.setQueryParam("is_today", ObjectSerializer.serialize(isToday, "boolean", ""));
                }

                // Query Params
                if (isFree !== undefined) {
                requestContext.setQueryParam("is_free", ObjectSerializer.serialize(isFree, "boolean", ""));
                }

                // Query Params
                if (isPaid !== undefined) {
                requestContext.setQueryParam("is_paid", ObjectSerializer.serialize(isPaid, "boolean", ""));
                }

                // Query Params
                if (jobTypeCodes !== undefined) {
                requestContext.setQueryParam("job_type_codes", ObjectSerializer.serialize(jobTypeCodes, "Array<JobTypeCode>", ""));
                }

                // Query Params
                if (industryCodes !== undefined) {
                requestContext.setQueryParam("industry_codes", ObjectSerializer.serialize(industryCodes, "Array<IndustryCode>", ""));
                }

                // Query Params
                if (cityCodes !== undefined) {
                requestContext.setQueryParam("city_codes", ObjectSerializer.serialize(cityCodes, "Array<string>", ""));
                }

                // Query Params
                if (tags !== undefined) {
                requestContext.setQueryParam("tags", ObjectSerializer.serialize(tags, "Array<number>", ""));
                }

                // Query Params
                if (startAtFrom !== undefined) {
                requestContext.setQueryParam("start_at_from", ObjectSerializer.serialize(startAtFrom, "string", ""));
                }

                // Query Params
                if (startAtTo !== undefined) {
                requestContext.setQueryParam("start_at_to", ObjectSerializer.serialize(startAtTo, "string", ""));
                }

                // Query Params
                if (organizationId !== undefined) {
                requestContext.setQueryParam("organization_id", ObjectSerializer.serialize(organizationId, "number", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "EventSortByCode", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        }

        export class EventsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to commentEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async commentEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createDraftEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createDraftEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createEventBookmark
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createEventBookmarkWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createSurveyResponseResult
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createSurveyResponseResultWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to deleteEventBookmark
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async deleteEventBookmarkWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("204", response.httpStatusCode)) {
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: void = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "void", ""
                    ) as void;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to deleteManualCheckIn
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async deleteManualCheckInWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("204", response.httpStatusCode)) {
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: void = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "void", ""
                    ) as void;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to generateEventAi
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async generateEventAiWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GenerateEventAIResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GenerateEventAIResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GenerateEventAIResponse", ""
                        ) as GenerateEventAIResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: GenerateEventAIResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GenerateEventAIResponse", ""
                    ) as GenerateEventAIResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getDraftEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getDraftEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetDraftEventResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetDraftEventResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetDraftEventResponse", ""
                        ) as GetDraftEventResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: GetDraftEventResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetDraftEventResponse", ""
                    ) as GetDraftEventResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getEventDetail
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getEventDetailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetEventDetailResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetEventDetailResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetEventDetailResponse", ""
                        ) as GetEventDetailResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: GetEventDetailResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetEventDetailResponse", ""
                    ) as GetEventDetailResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getEventSurvey
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getEventSurveyWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetEventSurveyResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetEventSurveyResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetEventSurveyResponse", ""
                        ) as GetEventSurveyResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: GetEventSurveyResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetEventSurveyResponse", ""
                    ) as GetEventSurveyResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingEventComments
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingEventCommentsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingEventCommentsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingEventCommentsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingEventCommentsResponse", ""
                        ) as ListingEventCommentsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingEventCommentsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingEventCommentsResponse", ""
                    ) as ListingEventCommentsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingEventOptions
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingEventOptionsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingEventOptionsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingEventOptionsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingEventOptionsResponse", ""
                        ) as ListingEventOptionsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingEventOptionsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingEventOptionsResponse", ""
                    ) as ListingEventOptionsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingEventPurchasedTickets
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingEventPurchasedTicketsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingEventPurchasedTicketsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingEventPurchasedTicketsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingEventPurchasedTicketsResponse", ""
                        ) as ListingEventPurchasedTicketsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingEventPurchasedTicketsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingEventPurchasedTicketsResponse", ""
                    ) as ListingEventPurchasedTicketsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingEventRank
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingEventRankWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingEventRankResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingEventRankResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingEventRankResponse", ""
                        ) as ListingEventRankResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingEventRankResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingEventRankResponse", ""
                    ) as ListingEventRankResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingMyEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingMyEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingMyEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingMyEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingMyEventsResponse", ""
                        ) as ListingMyEventsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingMyEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingMyEventsResponse", ""
                    ) as ListingMyEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingRecommendationEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingRecommendationEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingRecommendationEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingRecommendationEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingRecommendationEventsResponse", ""
                        ) as ListingRecommendationEventsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingRecommendationEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingRecommendationEventsResponse", ""
                    ) as ListingRecommendationEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingRelatedEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingRelatedEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingRelatedEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingRelatedEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingRelatedEventsResponse", ""
                        ) as ListingRelatedEventsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingRelatedEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingRelatedEventsResponse", ""
                    ) as ListingRelatedEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingTicketsOfEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingTicketsOfEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<TicketItem> >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: Array<TicketItem> = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "Array<TicketItem>", ""
                        ) as Array<TicketItem>;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: Array<TicketItem> = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "Array<TicketItem>", ""
                    ) as Array<TicketItem>;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingTrendingEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingTrendingEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingTrendingEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingTrendingEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingTrendingEventsResponse", ""
                        ) as ListingTrendingEventsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: ListingTrendingEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingTrendingEventsResponse", ""
                    ) as ListingTrendingEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to manualCheckIn
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async manualCheckInWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to publishEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async publishEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: string = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "string", ""
                        ) as string;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: string = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "string", ""
                    ) as string;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to qrCheckIn
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async qrCheckInWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to saveDraftEvent
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async saveDraftEventWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to searchEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async searchEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: SearchEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "SearchEventsResponse", ""
                        ) as SearchEventsResponse;
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
                }
                if (isCodeInRange("400", response.httpStatusCode)) {
                        const body: ErrorResponse400 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse400", ""
                        ) as ErrorResponse400;
                        throw new ApiException<ErrorResponse400>(response.httpStatusCode, "Bad Request", body, response.headers);
                }
                if (isCodeInRange("401", response.httpStatusCode)) {
                        const body: ErrorResponse401 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse401", ""
                        ) as ErrorResponse401;
                        throw new ApiException<ErrorResponse401>(response.httpStatusCode, "Unauthorized", body, response.headers);
                }
                if (isCodeInRange("403", response.httpStatusCode)) {
                        const body: ErrorResponse403 = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ErrorResponse403", ""
                        ) as ErrorResponse403;
                        throw new ApiException<ErrorResponse403>(response.httpStatusCode, "Forbidden", body, response.headers);
                }
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: SearchEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "SearchEventsResponse", ""
                    ) as SearchEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

        }
