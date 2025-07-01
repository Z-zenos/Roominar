# .OrganizationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**analyzeEventCheckIns**](OrganizationsApi.md#analyzeEventCheckIns) | **GET** /api/v1/organizations/events/{slug}/analyze/check-ins | Analyze Event Check Ins
[**analyzeEventTickets**](OrganizationsApi.md#analyzeEventTickets) | **GET** /api/v1/organizations/events/{slug}/analyze/tickets | Analyze Event Tickets
[**createOrganizationFollow**](OrganizationsApi.md#createOrganizationFollow) | **POST** /api/v1/organizations/{organization_id}/follow | Create Organization Follow
[**deleteOrganizationFollow**](OrganizationsApi.md#deleteOrganizationFollow) | **DELETE** /api/v1/organizations/{organization_id}/follow | Delete Organization Follow
[**downloadAttendeesCsv**](OrganizationsApi.md#downloadAttendeesCsv) | **GET** /api/v1/organizations/attendees/csv | Download Attendees Csv
[**getAttendeeDetail**](OrganizationsApi.md#getAttendeeDetail) | **GET** /api/v1/organizations/attendees/{attendee_id} | Get Attendee Detail
[**getOrganizationDashboard**](OrganizationsApi.md#getOrganizationDashboard) | **GET** /api/v1/organizations/dashboard | Get Organization Dashboard
[**getOrganizationDetail**](OrganizationsApi.md#getOrganizationDetail) | **GET** /api/v1/organizations/{organization_slug} | Get Organization Detail
[**getTagStats**](OrganizationsApi.md#getTagStats) | **GET** /api/v1/organizations/tag-stats | Get Tag Stats
[**getTicketStats**](OrganizationsApi.md#getTicketStats) | **GET** /api/v1/organizations/ticket-stats | Get Ticket Stats
[**listingAttendees**](OrganizationsApi.md#listingAttendees) | **GET** /api/v1/organizations/attendees | Listing Attendees
[**listingAttendeesRanking**](OrganizationsApi.md#listingAttendeesRanking) | **GET** /api/v1/organizations/attendees/ranking | Listing Attendees Ranking
[**listingOrganizationEvents**](OrganizationsApi.md#listingOrganizationEvents) | **GET** /api/v1/organizations/events | Listing Organization Events
[**listingOrganizationEventsTimeline**](OrganizationsApi.md#listingOrganizationEventsTimeline) | **GET** /api/v1/organizations/events/timeline | Listing Organization Events Timeline
[**listingRandomOrganizations**](OrganizationsApi.md#listingRandomOrganizations) | **GET** /api/v1/organizations/random | Listing Random Organizations
[**listingTopOrganizationEvents**](OrganizationsApi.md#listingTopOrganizationEvents) | **GET** /api/v1/organizations/{organization_id}/top-events | Listing Top Organization Events
[**registerOrganization**](OrganizationsApi.md#registerOrganization) | **POST** /api/v1/organizations/register | Register Organization
[**trackUserActions**](OrganizationsApi.md#trackUserActions) | **GET** /api/v1/organizations/tracking/user-actions | Track User Actions


# **analyzeEventCheckIns**
> AnalyzeEventCheckInsResponse analyzeEventCheckIns()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiAnalyzeEventCheckInsRequest = {
  // string
  slug: "slug_example",
};

apiInstance.analyzeEventCheckIns(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined


### Return type

**AnalyzeEventCheckInsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **analyzeEventTickets**
> AnalyzeEventTicketsResponse analyzeEventTickets()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiAnalyzeEventTicketsRequest = {
  // string
  slug: "slug_example",
  // 'daily' | 'weekly' | 'monthly' | The granularity of the data. (optional)
  granularity: "daily",
};

apiInstance.analyzeEventTickets(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined
 **granularity** | [**&#39;daily&#39; | &#39;weekly&#39; | &#39;monthly&#39;**]**Array<&#39;daily&#39; &#124; &#39;weekly&#39; &#124; &#39;monthly&#39;>** | The granularity of the data. | (optional) defaults to 'daily'


### Return type

**AnalyzeEventTicketsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createOrganizationFollow**
> number createOrganizationFollow()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiCreateOrganizationFollowRequest = {
  // number
  organizationId: 1,
};

apiInstance.createOrganizationFollow(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | [**number**] |  | defaults to undefined


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteOrganizationFollow**
> void deleteOrganizationFollow()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiDeleteOrganizationFollowRequest = {
  // number
  organizationId: 1,
};

apiInstance.deleteOrganizationFollow(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | [**number**] |  | defaults to undefined


### Return type

**void**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **downloadAttendeesCsv**
> void downloadAttendeesCsv()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiDownloadAttendeesCsvRequest = {
  // string (optional)
  keyword: "keyword_example",
  // Date (optional)
  applyAtFrom: new Date('1970-01-01T00:00:00.00Z'),
  // Date (optional)
  applyAtTo: new Date('1970-01-01T00:00:00.00Z'),
  // boolean (optional)
  isCheckedIn: true,
  // JobTypeCode (optional)
  jobTypeCode: "DEV",
  // IndustryCode (optional)
  industryCode: "REAL_ESTATE",
  // AttendeeSortByCode (optional)
  sortBy: "APPLY_AT",
  // boolean (optional)
  withFilter: true,
  // number (optional)
  page: 1,
  // number (optional)
  perPage: 1,
};

apiInstance.downloadAttendeesCsv(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **applyAtFrom** | [**Date**] |  | (optional) defaults to undefined
 **applyAtTo** | [**Date**] |  | (optional) defaults to undefined
 **isCheckedIn** | [**boolean**] |  | (optional) defaults to undefined
 **jobTypeCode** | **JobTypeCode** |  | (optional) defaults to undefined
 **industryCode** | **IndustryCode** |  | (optional) defaults to undefined
 **sortBy** | **AttendeeSortByCode** |  | (optional) defaults to undefined
 **withFilter** | [**boolean**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/csv, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Stream plain text using utf8 charset. |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAttendeeDetail**
> GetAttendeeDetailResponse getAttendeeDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiGetAttendeeDetailRequest = {
  // number
  attendeeId: 1,
};

apiInstance.getAttendeeDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attendeeId** | [**number**] |  | defaults to undefined


### Return type

**GetAttendeeDetailResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getOrganizationDashboard**
> GetOrganizationDashboardResponse getOrganizationDashboard()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:any = {};

apiInstance.getOrganizationDashboard(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**GetOrganizationDashboardResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getOrganizationDetail**
> GetOrganizationDetailResponse getOrganizationDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiGetOrganizationDetailRequest = {
  // string
  organizationSlug: "organization_slug_example",
};

apiInstance.getOrganizationDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationSlug** | [**string**] |  | defaults to undefined


### Return type

**GetOrganizationDetailResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getTagStats**
> GetTagStatsResponse getTagStats()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:any = {};

apiInstance.getTagStats(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**GetTagStatsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getTicketStats**
> GetTicketStatsResponse getTicketStats()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiGetTicketStatsRequest = {
  // number (optional)
  eventId: 1,
  // Date (optional)
  startDate: new Date('1970-01-01T00:00:00.00Z'),
  // Date (optional)
  endDate: new Date('1970-01-01T00:00:00.00Z'),
  // TicketTypeCode (optional)
  ticketType: "EARLY_BIRD",
  // TicketStatusCode (optional)
  ticketStatus: "AVAILABLE",
};

apiInstance.getTicketStats(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | (optional) defaults to undefined
 **startDate** | [**Date**] |  | (optional) defaults to undefined
 **endDate** | [**Date**] |  | (optional) defaults to undefined
 **ticketType** | **TicketTypeCode** |  | (optional) defaults to undefined
 **ticketStatus** | **TicketStatusCode** |  | (optional) defaults to undefined


### Return type

**GetTicketStatsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingAttendees**
> ListingAttendeesResponse listingAttendees()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiListingAttendeesRequest = {
  // string | user name | event name | phone | email (optional)
  keyword: "keyword_example",
  // Date (optional)
  applyAtFrom: new Date('1970-01-01T00:00:00.00Z'),
  // Date (optional)
  applyAtTo: new Date('1970-01-01T00:00:00.00Z'),
  // boolean (optional)
  isCheckedIn: true,
  // JobTypeCode (optional)
  jobTypeCode: "DEV",
  // IndustryCode (optional)
  industryCode: "REAL_ESTATE",
  // AttendeeSortByCode (optional)
  sortBy: "APPLY_AT",
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingAttendees(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | user name | event name | phone | email | (optional) defaults to undefined
 **applyAtFrom** | [**Date**] |  | (optional) defaults to undefined
 **applyAtTo** | [**Date**] |  | (optional) defaults to undefined
 **isCheckedIn** | [**boolean**] |  | (optional) defaults to undefined
 **jobTypeCode** | **JobTypeCode** |  | (optional) defaults to undefined
 **industryCode** | **IndustryCode** |  | (optional) defaults to undefined
 **sortBy** | **AttendeeSortByCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingAttendeesResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingAttendeesRanking**
> Array<ListingAttendeesRankingItem> listingAttendeesRanking()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiListingAttendeesRankingRequest = {
  // string (optional)
  keyword: "keyword_example",
  // number (optional)
  eventId: 1,
  // number (optional)
  month: 1,
  // number (optional)
  year: 1,
  // number (optional)
  page: 1,
  // number (optional)
  perPage: 1,
};

apiInstance.listingAttendeesRanking(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **eventId** | [**number**] |  | (optional) defaults to undefined
 **month** | [**number**] |  | (optional) defaults to undefined
 **year** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined


### Return type

**Array<ListingAttendeesRankingItem>**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingOrganizationEvents**
> ListingOrganizationEventsResponse listingOrganizationEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiListingOrganizationEventsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // Array<number> (optional)
  tags: [
    1,
  ],
  // Array<EventMeetingToolCode> (optional)
  meetingToolCodes: [
    "ZOOM",
  ],
  // string (optional)
  startAtFrom: "start_at_from_example",
  // string (optional)
  startAtTo: "start_at_to_example",
  // Array<EventStatusCode> (optional)
  eventStatus: [
    "PUBLIC",
  ],
  // EventTimeStatusCode (optional)
  timeStatus: "APPLY_ONGOING",
  // ManageEventSortByCode (optional)
  sortBy: "SOLD_TICKETS_NUMBER",
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingOrganizationEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **tags** | **Array&lt;number&gt;** |  | (optional) defaults to undefined
 **meetingToolCodes** | **Array&lt;EventMeetingToolCode&gt;** |  | (optional) defaults to undefined
 **startAtFrom** | [**string**] |  | (optional) defaults to undefined
 **startAtTo** | [**string**] |  | (optional) defaults to undefined
 **eventStatus** | **Array&lt;EventStatusCode&gt;** |  | (optional) defaults to undefined
 **timeStatus** | **EventTimeStatusCode** |  | (optional) defaults to undefined
 **sortBy** | **ManageEventSortByCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingOrganizationEventsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingOrganizationEventsTimeline**
> Array<ListingOrganizationEventsTimelineItem> listingOrganizationEventsTimeline()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:any = {};

apiInstance.listingOrganizationEventsTimeline(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<ListingOrganizationEventsTimelineItem>**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingRandomOrganizations**
> ListingRandomOrganizationsResponse listingRandomOrganizations()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:any = {};

apiInstance.listingRandomOrganizations(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListingRandomOrganizationsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingTopOrganizationEvents**
> ListingTopOrganizationEventsResponse listingTopOrganizationEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiListingTopOrganizationEventsRequest = {
  // number
  organizationId: 1,
};

apiInstance.listingTopOrganizationEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | [**number**] |  | defaults to undefined


### Return type

**ListingTopOrganizationEventsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **registerOrganization**
> RegisterOrganizationResponse registerOrganization()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiRegisterOrganizationRequest = {
  // RegisterOrganizationRequest (optional)
  registerOrganizationRequest: null,
};

apiInstance.registerOrganization(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerOrganizationRequest** | **RegisterOrganizationRequest**|  |


### Return type

**RegisterOrganizationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **trackUserActions**
> TrackUserActionsResponse trackUserActions()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OrganizationsApi(configuration);

let body:.OrganizationsApiTrackUserActionsRequest = {
  // TrackingTimeRangeCode (optional)
  timeRange: null,
  // TrackingTimeRangeCode (optional)
  groupBy: null,
  // Array<UserActionTypeCode> (optional)
  actionTypes: [
    "VIEW",
  ],
  // number (optional)
  eventId: 1,
  // number (optional)
  topN: 1,
};

apiInstance.trackUserActions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **timeRange** | **TrackingTimeRangeCode** |  | (optional) defaults to undefined
 **groupBy** | **TrackingTimeRangeCode** |  | (optional) defaults to undefined
 **actionTypes** | **Array&lt;UserActionTypeCode&gt;** |  | (optional) defaults to undefined
 **eventId** | [**number**] |  | (optional) defaults to undefined
 **topN** | [**number**] |  | (optional) defaults to undefined


### Return type

**TrackUserActionsResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)
