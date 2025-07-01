// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';


    import type { AnalyzeEventCheckInsResponse } from '../models/AnalyzeEventCheckInsResponse';
    import type { AnalyzeEventTicketsResponse } from '../models/AnalyzeEventTicketsResponse';
    import type { AttendeeSortByCode } from '../models/AttendeeSortByCode';
    import type { ErrorResponse400 } from '../models/ErrorResponse400';
    import type { ErrorResponse401 } from '../models/ErrorResponse401';
    import type { ErrorResponse403 } from '../models/ErrorResponse403';
    import type { EventMeetingToolCode } from '../models/EventMeetingToolCode';
    import type { EventStatusCode } from '../models/EventStatusCode';
    import type { EventTimeStatusCode } from '../models/EventTimeStatusCode';
    import type { GetAttendeeDetailResponse } from '../models/GetAttendeeDetailResponse';
    import type { GetOrganizationDashboardResponse } from '../models/GetOrganizationDashboardResponse';
    import type { GetOrganizationDetailResponse } from '../models/GetOrganizationDetailResponse';
    import type { GetTagStatsResponse } from '../models/GetTagStatsResponse';
    import type { GetTicketStatsResponse } from '../models/GetTicketStatsResponse';
    import type { HTTPValidationError } from '../models/HTTPValidationError';
    import type { IndustryCode } from '../models/IndustryCode';
    import type { JobTypeCode } from '../models/JobTypeCode';
    import type { ListingAttendeesRankingItem } from '../models/ListingAttendeesRankingItem';
    import type { ListingAttendeesResponse } from '../models/ListingAttendeesResponse';
    import type { ListingOrganizationEventsResponse } from '../models/ListingOrganizationEventsResponse';
    import type { ListingOrganizationEventsTimelineItem } from '../models/ListingOrganizationEventsTimelineItem';
    import type { ListingRandomOrganizationsResponse } from '../models/ListingRandomOrganizationsResponse';
    import type { ListingTopOrganizationEventsResponse } from '../models/ListingTopOrganizationEventsResponse';
    import type { ManageEventSortByCode } from '../models/ManageEventSortByCode';
    import type { RegisterOrganizationRequest } from '../models/RegisterOrganizationRequest';
    import type { RegisterOrganizationResponse } from '../models/RegisterOrganizationResponse';
    import type { TicketStatusCode } from '../models/TicketStatusCode';
    import type { TicketTypeCode } from '../models/TicketTypeCode';
    import type { TrackUserActionsResponse } from '../models/TrackUserActionsResponse';
    import type { TrackingTimeRangeCode } from '../models/TrackingTimeRangeCode';
    import type { UserActionTypeCode } from '../models/UserActionTypeCode';

    /**
    * no description
    */
    export class OrganizationsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Analyze Event Check Ins
            * @param slug
        */
        public async analyzeEventCheckIns(slug: string, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'slug' is not null or undefined
                    if (slug === null || slug === undefined) {
                    throw new RequiredError("OrganizationsApi", "analyzeEventCheckIns", "slug");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/events/{slug}/analyze/check-ins'
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
            * Analyze Event Tickets
            * @param slug
            * @param granularity The granularity of the data.
        */
        public async analyzeEventTickets(slug: string, granularity?: 'daily' | 'weekly' | 'monthly', _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'slug' is not null or undefined
                    if (slug === null || slug === undefined) {
                    throw new RequiredError("OrganizationsApi", "analyzeEventTickets", "slug");
                    }



            // Path Params
            const localVarPath = '/api/v1/organizations/events/{slug}/analyze/tickets'
                .replace('{' + 'slug' + '}', encodeURIComponent(String(slug)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (granularity !== undefined) {
                requestContext.setQueryParam("granularity", ObjectSerializer.serialize(granularity, "'daily' | 'weekly' | 'monthly'", ""));
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
            * Create Organization Follow
            * @param organizationId
        */
        public async createOrganizationFollow(organizationId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'organizationId' is not null or undefined
                    if (organizationId === null || organizationId === undefined) {
                    throw new RequiredError("OrganizationsApi", "createOrganizationFollow", "organizationId");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/{organization_id}/follow'
                .replace('{' + 'organization_id' + '}', encodeURIComponent(String(organizationId)));

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
            * Delete Organization Follow
            * @param organizationId
        */
        public async deleteOrganizationFollow(organizationId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'organizationId' is not null or undefined
                    if (organizationId === null || organizationId === undefined) {
                    throw new RequiredError("OrganizationsApi", "deleteOrganizationFollow", "organizationId");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/{organization_id}/follow'
                .replace('{' + 'organization_id' + '}', encodeURIComponent(String(organizationId)));

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
        public async downloadAttendeesCsv(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, withFilter?: boolean, page?: number, perPage?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;











            // Path Params
            const localVarPath = '/api/v1/organizations/attendees/csv';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (applyAtFrom !== undefined) {
                requestContext.setQueryParam("apply_at_from", ObjectSerializer.serialize(applyAtFrom, "Date", "date-time"));
                }

                // Query Params
                if (applyAtTo !== undefined) {
                requestContext.setQueryParam("apply_at_to", ObjectSerializer.serialize(applyAtTo, "Date", "date-time"));
                }

                // Query Params
                if (isCheckedIn !== undefined) {
                requestContext.setQueryParam("is_checked_in", ObjectSerializer.serialize(isCheckedIn, "boolean", ""));
                }

                // Query Params
                if (jobTypeCode !== undefined) {
                requestContext.setQueryParam("job_type_code", ObjectSerializer.serialize(jobTypeCode, "JobTypeCode", ""));
                }

                // Query Params
                if (industryCode !== undefined) {
                requestContext.setQueryParam("industry_code", ObjectSerializer.serialize(industryCode, "IndustryCode", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "AttendeeSortByCode", ""));
                }

                // Query Params
                if (withFilter !== undefined) {
                requestContext.setQueryParam("with_filter", ObjectSerializer.serialize(withFilter, "boolean", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
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
            * Get Attendee Detail
            * @param attendeeId
        */
        public async getAttendeeDetail(attendeeId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'attendeeId' is not null or undefined
                    if (attendeeId === null || attendeeId === undefined) {
                    throw new RequiredError("OrganizationsApi", "getAttendeeDetail", "attendeeId");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/attendees/{attendee_id}'
                .replace('{' + 'attendee_id' + '}', encodeURIComponent(String(attendeeId)));

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
            * Get Organization Dashboard
        */
        public async getOrganizationDashboard(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/organizations/dashboard';

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
            * Get Organization Detail
            * @param organizationSlug
        */
        public async getOrganizationDetail(organizationSlug: string, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'organizationSlug' is not null or undefined
                    if (organizationSlug === null || organizationSlug === undefined) {
                    throw new RequiredError("OrganizationsApi", "getOrganizationDetail", "organizationSlug");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/{organization_slug}'
                .replace('{' + 'organization_slug' + '}', encodeURIComponent(String(organizationSlug)));

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
            * Get Tag Stats
        */
        public async getTagStats(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/organizations/tag-stats';

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
            * Get Ticket Stats
            * @param eventId
            * @param startDate
            * @param endDate
            * @param ticketType
            * @param ticketStatus
        */
        public async getTicketStats(eventId?: number, startDate?: Date, endDate?: Date, ticketType?: TicketTypeCode, ticketStatus?: TicketStatusCode, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;






            // Path Params
            const localVarPath = '/api/v1/organizations/ticket-stats';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (eventId !== undefined) {
                requestContext.setQueryParam("event_id", ObjectSerializer.serialize(eventId, "number", ""));
                }

                // Query Params
                if (startDate !== undefined) {
                requestContext.setQueryParam("start_date", ObjectSerializer.serialize(startDate, "Date", "date-time"));
                }

                // Query Params
                if (endDate !== undefined) {
                requestContext.setQueryParam("end_date", ObjectSerializer.serialize(endDate, "Date", "date-time"));
                }

                // Query Params
                if (ticketType !== undefined) {
                requestContext.setQueryParam("ticket_type", ObjectSerializer.serialize(ticketType, "TicketTypeCode", ""));
                }

                // Query Params
                if (ticketStatus !== undefined) {
                requestContext.setQueryParam("ticket_status", ObjectSerializer.serialize(ticketStatus, "TicketStatusCode", ""));
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
            * Listing Attendees
            * @param keyword user name | event name | phone | email
            * @param applyAtFrom
            * @param applyAtTo
            * @param isCheckedIn
            * @param jobTypeCode
            * @param industryCode
            * @param sortBy
            * @param perPage
            * @param page
        */
        public async listingAttendees(keyword?: string, applyAtFrom?: Date, applyAtTo?: Date, isCheckedIn?: boolean, jobTypeCode?: JobTypeCode, industryCode?: IndustryCode, sortBy?: AttendeeSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;










            // Path Params
            const localVarPath = '/api/v1/organizations/attendees';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (applyAtFrom !== undefined) {
                requestContext.setQueryParam("apply_at_from", ObjectSerializer.serialize(applyAtFrom, "Date", "date-time"));
                }

                // Query Params
                if (applyAtTo !== undefined) {
                requestContext.setQueryParam("apply_at_to", ObjectSerializer.serialize(applyAtTo, "Date", "date-time"));
                }

                // Query Params
                if (isCheckedIn !== undefined) {
                requestContext.setQueryParam("is_checked_in", ObjectSerializer.serialize(isCheckedIn, "boolean", ""));
                }

                // Query Params
                if (jobTypeCode !== undefined) {
                requestContext.setQueryParam("job_type_code", ObjectSerializer.serialize(jobTypeCode, "JobTypeCode", ""));
                }

                // Query Params
                if (industryCode !== undefined) {
                requestContext.setQueryParam("industry_code", ObjectSerializer.serialize(industryCode, "IndustryCode", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "AttendeeSortByCode", ""));
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
            * Listing Attendees Ranking
            * @param keyword
            * @param eventId
            * @param month
            * @param year
            * @param page
            * @param perPage
        */
        public async listingAttendeesRanking(keyword?: string, eventId?: number, month?: number, year?: number, page?: number, perPage?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;







            // Path Params
            const localVarPath = '/api/v1/organizations/attendees/ranking';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (eventId !== undefined) {
                requestContext.setQueryParam("event_id", ObjectSerializer.serialize(eventId, "number", ""));
                }

                // Query Params
                if (month !== undefined) {
                requestContext.setQueryParam("month", ObjectSerializer.serialize(month, "number", ""));
                }

                // Query Params
                if (year !== undefined) {
                requestContext.setQueryParam("year", ObjectSerializer.serialize(year, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
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
        public async listingOrganizationEvents(keyword?: string, tags?: Array<number>, meetingToolCodes?: Array<EventMeetingToolCode>, startAtFrom?: string, startAtTo?: string, eventStatus?: Array<EventStatusCode>, timeStatus?: EventTimeStatusCode, sortBy?: ManageEventSortByCode, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;











            // Path Params
            const localVarPath = '/api/v1/organizations/events';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (keyword !== undefined) {
                requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
                }

                // Query Params
                if (tags !== undefined) {
                requestContext.setQueryParam("tags", ObjectSerializer.serialize(tags, "Array<number>", ""));
                }

                // Query Params
                if (meetingToolCodes !== undefined) {
                requestContext.setQueryParam("meeting_tool_codes", ObjectSerializer.serialize(meetingToolCodes, "Array<EventMeetingToolCode>", ""));
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
                if (eventStatus !== undefined) {
                requestContext.setQueryParam("event_status", ObjectSerializer.serialize(eventStatus, "Array<EventStatusCode>", ""));
                }

                // Query Params
                if (timeStatus !== undefined) {
                requestContext.setQueryParam("time_status", ObjectSerializer.serialize(timeStatus, "EventTimeStatusCode", ""));
                }

                // Query Params
                if (sortBy !== undefined) {
                requestContext.setQueryParam("sort_by", ObjectSerializer.serialize(sortBy, "ManageEventSortByCode", ""));
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
            * Listing Organization Events Timeline
        */
        public async listingOrganizationEventsTimeline(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/organizations/events/timeline';

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
            * Listing Random Organizations
        */
        public async listingRandomOrganizations(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/organizations/random';

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
            * Listing Top Organization Events
            * @param organizationId
        */
        public async listingTopOrganizationEvents(organizationId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'organizationId' is not null or undefined
                    if (organizationId === null || organizationId === undefined) {
                    throw new RequiredError("OrganizationsApi", "listingTopOrganizationEvents", "organizationId");
                    }


            // Path Params
            const localVarPath = '/api/v1/organizations/{organization_id}/top-events'
                .replace('{' + 'organization_id' + '}', encodeURIComponent(String(organizationId)));

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
            * Register Organization
            * @param registerOrganizationRequest
        */
        public async registerOrganization(registerOrganizationRequest?: RegisterOrganizationRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/organizations/register';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(registerOrganizationRequest, "RegisterOrganizationRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);


                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Track User Actions
            * @param timeRange
            * @param groupBy
            * @param actionTypes
            * @param eventId
            * @param topN
        */
        public async trackUserActions(timeRange?: TrackingTimeRangeCode, groupBy?: TrackingTimeRangeCode, actionTypes?: Array<UserActionTypeCode>, eventId?: number, topN?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;






            // Path Params
            const localVarPath = '/api/v1/organizations/tracking/user-actions';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (timeRange !== undefined) {
                requestContext.setQueryParam("time_range", ObjectSerializer.serialize(timeRange, "TrackingTimeRangeCode", ""));
                }

                // Query Params
                if (groupBy !== undefined) {
                requestContext.setQueryParam("group_by", ObjectSerializer.serialize(groupBy, "TrackingTimeRangeCode", ""));
                }

                // Query Params
                if (actionTypes !== undefined) {
                requestContext.setQueryParam("action_types", ObjectSerializer.serialize(actionTypes, "Array<UserActionTypeCode>", ""));
                }

                // Query Params
                if (eventId !== undefined) {
                requestContext.setQueryParam("event_id", ObjectSerializer.serialize(eventId, "number", ""));
                }

                // Query Params
                if (topN !== undefined) {
                requestContext.setQueryParam("top_n", ObjectSerializer.serialize(topN, "number", ""));
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

        export class OrganizationsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to analyzeEventCheckIns
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async analyzeEventCheckInsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AnalyzeEventCheckInsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: AnalyzeEventCheckInsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "AnalyzeEventCheckInsResponse", ""
                        ) as AnalyzeEventCheckInsResponse;
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
                    const body: AnalyzeEventCheckInsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "AnalyzeEventCheckInsResponse", ""
                    ) as AnalyzeEventCheckInsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to analyzeEventTickets
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async analyzeEventTicketsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AnalyzeEventTicketsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: AnalyzeEventTicketsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "AnalyzeEventTicketsResponse", ""
                        ) as AnalyzeEventTicketsResponse;
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
                    const body: AnalyzeEventTicketsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "AnalyzeEventTicketsResponse", ""
                    ) as AnalyzeEventTicketsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createOrganizationFollow
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createOrganizationFollowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
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
            * @params response Response returned by the server for a request to deleteOrganizationFollow
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async deleteOrganizationFollowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
            * @params response Response returned by the server for a request to downloadAttendeesCsv
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async downloadAttendeesCsvWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
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
            * @params response Response returned by the server for a request to getAttendeeDetail
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getAttendeeDetailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetAttendeeDetailResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetAttendeeDetailResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetAttendeeDetailResponse", ""
                        ) as GetAttendeeDetailResponse;
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
                    const body: GetAttendeeDetailResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetAttendeeDetailResponse", ""
                    ) as GetAttendeeDetailResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getOrganizationDashboard
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getOrganizationDashboardWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetOrganizationDashboardResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetOrganizationDashboardResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetOrganizationDashboardResponse", ""
                        ) as GetOrganizationDashboardResponse;
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
                    const body: GetOrganizationDashboardResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetOrganizationDashboardResponse", ""
                    ) as GetOrganizationDashboardResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getOrganizationDetail
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getOrganizationDetailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetOrganizationDetailResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetOrganizationDetailResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetOrganizationDetailResponse", ""
                        ) as GetOrganizationDetailResponse;
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
                    const body: GetOrganizationDetailResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetOrganizationDetailResponse", ""
                    ) as GetOrganizationDetailResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getTagStats
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getTagStatsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetTagStatsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetTagStatsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetTagStatsResponse", ""
                        ) as GetTagStatsResponse;
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
                    const body: GetTagStatsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetTagStatsResponse", ""
                    ) as GetTagStatsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to getTicketStats
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async getTicketStatsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetTicketStatsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: GetTicketStatsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "GetTicketStatsResponse", ""
                        ) as GetTicketStatsResponse;
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
                    const body: GetTicketStatsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "GetTicketStatsResponse", ""
                    ) as GetTicketStatsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingAttendees
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingAttendeesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingAttendeesResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingAttendeesResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingAttendeesResponse", ""
                        ) as ListingAttendeesResponse;
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
                    const body: ListingAttendeesResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingAttendeesResponse", ""
                    ) as ListingAttendeesResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingAttendeesRanking
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingAttendeesRankingWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<ListingAttendeesRankingItem> >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: Array<ListingAttendeesRankingItem> = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "Array<ListingAttendeesRankingItem>", ""
                        ) as Array<ListingAttendeesRankingItem>;
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
                    const body: Array<ListingAttendeesRankingItem> = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "Array<ListingAttendeesRankingItem>", ""
                    ) as Array<ListingAttendeesRankingItem>;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingOrganizationEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingOrganizationEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingOrganizationEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingOrganizationEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingOrganizationEventsResponse", ""
                        ) as ListingOrganizationEventsResponse;
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
                    const body: ListingOrganizationEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingOrganizationEventsResponse", ""
                    ) as ListingOrganizationEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingOrganizationEventsTimeline
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingOrganizationEventsTimelineWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<ListingOrganizationEventsTimelineItem> >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: Array<ListingOrganizationEventsTimelineItem> = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "Array<ListingOrganizationEventsTimelineItem>", ""
                        ) as Array<ListingOrganizationEventsTimelineItem>;
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
                    const body: Array<ListingOrganizationEventsTimelineItem> = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "Array<ListingOrganizationEventsTimelineItem>", ""
                    ) as Array<ListingOrganizationEventsTimelineItem>;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingRandomOrganizations
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingRandomOrganizationsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingRandomOrganizationsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingRandomOrganizationsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingRandomOrganizationsResponse", ""
                        ) as ListingRandomOrganizationsResponse;
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
                    const body: ListingRandomOrganizationsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingRandomOrganizationsResponse", ""
                    ) as ListingRandomOrganizationsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingTopOrganizationEvents
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingTopOrganizationEventsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingTopOrganizationEventsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingTopOrganizationEventsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingTopOrganizationEventsResponse", ""
                        ) as ListingTopOrganizationEventsResponse;
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
                    const body: ListingTopOrganizationEventsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingTopOrganizationEventsResponse", ""
                    ) as ListingTopOrganizationEventsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to registerOrganization
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async registerOrganizationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<RegisterOrganizationResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: RegisterOrganizationResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "RegisterOrganizationResponse", ""
                        ) as RegisterOrganizationResponse;
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
                    const body: RegisterOrganizationResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "RegisterOrganizationResponse", ""
                    ) as RegisterOrganizationResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to trackUserActions
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async trackUserActionsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TrackUserActionsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: TrackUserActionsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "TrackUserActionsResponse", ""
                        ) as TrackUserActionsResponse;
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
                    const body: TrackUserActionsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "TrackUserActionsResponse", ""
                    ) as TrackUserActionsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

        }
