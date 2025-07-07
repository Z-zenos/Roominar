# .EventsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**commentEvent**](EventsApi.md#commentEvent) | **POST** /api/v1/events/{event_id}/comments | Comment Event
[**createEventBookmark**](EventsApi.md#createEventBookmark) | **POST** /api/v1/events/{event_id}/bookmark | Create Event Bookmark
[**deleteEventBookmark**](EventsApi.md#deleteEventBookmark) | **DELETE** /api/v1/events/{event_id}/bookmark | Delete Event Bookmark
[**deleteManualCheckIn**](EventsApi.md#deleteManualCheckIn) | **DELETE** /api/v1/events/check-in/manual/{check_in_id} | Delete Manual Check In
[**feedbackEvent**](EventsApi.md#feedbackEvent) | **POST** /api/v1/events/{event_id}/feedback | Feedback Event
[**generateEventAi**](EventsApi.md#generateEventAi) | **POST** /api/v1/events/ai/draft | Generate Event Ai
[**getDraftEvent**](EventsApi.md#getDraftEvent) | **GET** /api/v1/events/draft | Get Draft Event
[**getEventDetail**](EventsApi.md#getEventDetail) | **GET** /api/v1/events/{slug} | Get Event Detail
[**getEventIdBySlug**](EventsApi.md#getEventIdBySlug) | **GET** /api/v1/events/{slug}/id | Get Event Id By Slug
[**listingEventComments**](EventsApi.md#listingEventComments) | **GET** /api/v1/events/{event_id}/comments | Listing Event Comments
[**listingEventOptions**](EventsApi.md#listingEventOptions) | **GET** /api/v1/events/options | Listing Event Options
[**listingEventPurchasedTickets**](EventsApi.md#listingEventPurchasedTickets) | **GET** /api/v1/events/{slug}/purchased-tickets | Listing Event Purchased Tickets
[**listingEventRank**](EventsApi.md#listingEventRank) | **GET** /api/v1/events/rank | Listing Event Rank
[**listingFeedbackCriteria**](EventsApi.md#listingFeedbackCriteria) | **GET** /api/v1/events/{event_id}/feedbacks/criteria | Listing Feedback Criteria
[**listingFeedbacks**](EventsApi.md#listingFeedbacks) | **GET** /api/v1/events/{event_id}/feedbacks | Listing Feedbacks
[**listingMyEvents**](EventsApi.md#listingMyEvents) | **GET** /api/v1/events/my-events | Listing My Events
[**listingRecommendationEvents**](EventsApi.md#listingRecommendationEvents) | **GET** /api/v1/events/recommendation | Listing Recommendation Events
[**listingRelatedEvents**](EventsApi.md#listingRelatedEvents) | **GET** /api/v1/events/{slug}/related-events | Listing Related Events
[**listingTicketsOfEvent**](EventsApi.md#listingTicketsOfEvent) | **GET** /api/v1/events/{event_id}/tickets | Listing Tickets Of Event
[**listingTrendingEvents**](EventsApi.md#listingTrendingEvents) | **GET** /api/v1/events/trending | Listing Trending Events
[**manualCheckIn**](EventsApi.md#manualCheckIn) | **POST** /api/v1/events/check-in/manual | Manual Check In
[**publishEvent**](EventsApi.md#publishEvent) | **POST** /api/v1/events/{event_id} | Publish Event
[**qrCheckIn**](EventsApi.md#qrCheckIn) | **POST** /api/v1/events/{event_id}/check-in/qr | Qr Check In
[**saveDraftEvent**](EventsApi.md#saveDraftEvent) | **PATCH** /api/v1/events/draft/{event_id} | Save Draft Event
[**searchEvents**](EventsApi.md#searchEvents) | **GET** /api/v1/events | Search Events


# **commentEvent**
> number commentEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiCommentEventRequest = {
  // number
  eventId: 1,
  // CommentEventRequest (optional)
  commentEventRequest: null,
};

apiInstance.commentEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentEventRequest** | **CommentEventRequest**|  |
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **createEventBookmark**
> number createEventBookmark()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiCreateEventBookmarkRequest = {
  // number
  eventId: 1,
};

apiInstance.createEventBookmark(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined


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

# **deleteEventBookmark**
> void deleteEventBookmark()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiDeleteEventBookmarkRequest = {
  // number
  eventId: 1,
};

apiInstance.deleteEventBookmark(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined


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

# **deleteManualCheckIn**
> void deleteManualCheckIn()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiDeleteManualCheckInRequest = {
  // number
  checkInId: 1,
};

apiInstance.deleteManualCheckIn(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkInId** | [**number**] |  | defaults to undefined


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

# **feedbackEvent**
> number feedbackEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiFeedbackEventRequest = {
  // number
  eventId: 1,
  // FeedbackEventRequest (optional)
  feedbackEventRequest: null,
};

apiInstance.feedbackEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedbackEventRequest** | **FeedbackEventRequest**|  |
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **generateEventAi**
> GenerateEventAIResponse generateEventAi()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiGenerateEventAiRequest = {
  // GenerateEventAIRequest (optional)
  generateEventAIRequest: null,
};

apiInstance.generateEventAi(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **generateEventAIRequest** | **GenerateEventAIRequest**|  |


### Return type

**GenerateEventAIResponse**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **getDraftEvent**
> GetDraftEventResponse getDraftEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:any = {};

apiInstance.getDraftEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**GetDraftEventResponse**

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

# **getEventDetail**
> GetEventDetailResponse getEventDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiGetEventDetailRequest = {
  // string
  slug: "slug_example",
};

apiInstance.getEventDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined


### Return type

**GetEventDetailResponse**

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

# **getEventIdBySlug**
> number getEventIdBySlug()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiGetEventIdBySlugRequest = {
  // string
  slug: "slug_example",
};

apiInstance.getEventIdBySlug(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined


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

# **listingEventComments**
> ListingEventCommentsResponse listingEventComments()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingEventCommentsRequest = {
  // number
  eventId: 1,
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingEventComments(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingEventCommentsResponse**

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

# **listingEventOptions**
> ListingEventOptionsResponse listingEventOptions()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:any = {};

apiInstance.listingEventOptions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListingEventOptionsResponse**

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

# **listingEventPurchasedTickets**
> ListingEventPurchasedTicketsResponse listingEventPurchasedTickets()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingEventPurchasedTicketsRequest = {
  // string
  slug: "slug_example",
  // string (optional)
  keyword: "keyword_example",
  // boolean (optional)
  isCheckedIn: true,
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingEventPurchasedTickets(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **isCheckedIn** | [**boolean**] |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingEventPurchasedTicketsResponse**

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

# **listingEventRank**
> ListingEventRankResponse listingEventRank()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:any = {};

apiInstance.listingEventRank(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListingEventRankResponse**

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

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingFeedbackCriteria**
> ListingFeedbackCriteriaResponse listingFeedbackCriteria()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingFeedbackCriteriaRequest = {
  // number
  eventId: 1,
};

apiInstance.listingFeedbackCriteria(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**ListingFeedbackCriteriaResponse**

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

# **listingFeedbacks**
> ListingFeedbacksResponse listingFeedbacks()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingFeedbacksRequest = {
  // number
  eventId: 1,
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingFeedbacks(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingFeedbacksResponse**

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

# **listingMyEvents**
> ListingMyEventsResponse listingMyEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingMyEventsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // MyEventStatusCode (optional)
  status: null,
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingMyEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **status** | **MyEventStatusCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingMyEventsResponse**

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

# **listingRecommendationEvents**
> ListingRecommendationEventsResponse listingRecommendationEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingRecommendationEventsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // boolean (optional)
  isOnline: true,
  // boolean (optional)
  isOffline: true,
  // boolean (optional)
  isApplyOngoing: true,
  // boolean (optional)
  isApplyEnded: true,
  // boolean (optional)
  isToday: true,
  // boolean (optional)
  isFree: true,
  // boolean (optional)
  isPaid: true,
  // Array<JobTypeCode> (optional)
  jobTypeCodes: [
    "DEV",
  ],
  // Array<IndustryCode> (optional)
  industryCodes: [
    "REAL_ESTATE",
  ],
  // Array<string> (optional)
  cityCodes: [
    "city_codes_example",
  ],
  // Array<number> (optional)
  tags: [
    1,
  ],
  // string (optional)
  startAtFrom: "start_at_from_example",
  // string (optional)
  startAtTo: "start_at_to_example",
  // number (optional)
  organizationId: 1,
  // EventSortByCode (optional)
  sortBy: "START_AT",
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingRecommendationEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **isOnline** | [**boolean**] |  | (optional) defaults to undefined
 **isOffline** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyOngoing** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyEnded** | [**boolean**] |  | (optional) defaults to undefined
 **isToday** | [**boolean**] |  | (optional) defaults to undefined
 **isFree** | [**boolean**] |  | (optional) defaults to undefined
 **isPaid** | [**boolean**] |  | (optional) defaults to undefined
 **jobTypeCodes** | **Array&lt;JobTypeCode&gt;** |  | (optional) defaults to undefined
 **industryCodes** | **Array&lt;IndustryCode&gt;** |  | (optional) defaults to undefined
 **cityCodes** | **Array&lt;string&gt;** |  | (optional) defaults to undefined
 **tags** | **Array&lt;number&gt;** |  | (optional) defaults to undefined
 **startAtFrom** | [**string**] |  | (optional) defaults to undefined
 **startAtTo** | [**string**] |  | (optional) defaults to undefined
 **organizationId** | [**number**] |  | (optional) defaults to undefined
 **sortBy** | **EventSortByCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingRecommendationEventsResponse**

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

# **listingRelatedEvents**
> ListingRelatedEventsResponse listingRelatedEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingRelatedEventsRequest = {
  // string
  slug: "slug_example",
};

apiInstance.listingRelatedEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **slug** | [**string**] |  | defaults to undefined


### Return type

**ListingRelatedEventsResponse**

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

# **listingTicketsOfEvent**
> Array<TicketItem> listingTicketsOfEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingTicketsOfEventRequest = {
  // number
  eventId: 1,
};

apiInstance.listingTicketsOfEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**Array<TicketItem>**

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

# **listingTrendingEvents**
> ListingTrendingEventsResponse listingTrendingEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiListingTrendingEventsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // boolean (optional)
  isOnline: true,
  // boolean (optional)
  isOffline: true,
  // boolean (optional)
  isApplyOngoing: true,
  // boolean (optional)
  isApplyEnded: true,
  // boolean (optional)
  isToday: true,
  // boolean (optional)
  isFree: true,
  // boolean (optional)
  isPaid: true,
  // Array<JobTypeCode> (optional)
  jobTypeCodes: [
    "DEV",
  ],
  // Array<IndustryCode> (optional)
  industryCodes: [
    "REAL_ESTATE",
  ],
  // Array<string> (optional)
  cityCodes: [
    "city_codes_example",
  ],
  // Array<number> (optional)
  tags: [
    1,
  ],
  // string (optional)
  startAtFrom: "start_at_from_example",
  // string (optional)
  startAtTo: "start_at_to_example",
  // number (optional)
  organizationId: 1,
  // EventSortByCode (optional)
  sortBy: "START_AT",
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.listingTrendingEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **isOnline** | [**boolean**] |  | (optional) defaults to undefined
 **isOffline** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyOngoing** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyEnded** | [**boolean**] |  | (optional) defaults to undefined
 **isToday** | [**boolean**] |  | (optional) defaults to undefined
 **isFree** | [**boolean**] |  | (optional) defaults to undefined
 **isPaid** | [**boolean**] |  | (optional) defaults to undefined
 **jobTypeCodes** | **Array&lt;JobTypeCode&gt;** |  | (optional) defaults to undefined
 **industryCodes** | **Array&lt;IndustryCode&gt;** |  | (optional) defaults to undefined
 **cityCodes** | **Array&lt;string&gt;** |  | (optional) defaults to undefined
 **tags** | **Array&lt;number&gt;** |  | (optional) defaults to undefined
 **startAtFrom** | [**string**] |  | (optional) defaults to undefined
 **startAtTo** | [**string**] |  | (optional) defaults to undefined
 **organizationId** | [**number**] |  | (optional) defaults to undefined
 **sortBy** | **EventSortByCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingTrendingEventsResponse**

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

# **manualCheckIn**
> number manualCheckIn()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiManualCheckInRequest = {
  // ManualCheckInRequest (optional)
  manualCheckInRequest: null,
};

apiInstance.manualCheckIn(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **manualCheckInRequest** | **ManualCheckInRequest**|  |


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **publishEvent**
> string publishEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiPublishEventRequest = {
  // number
  eventId: 1,
  // PublishEventRequest (optional)
  publishEventRequest: null,
};

apiInstance.publishEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **publishEventRequest** | **PublishEventRequest**|  |
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**string**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **qrCheckIn**
> number qrCheckIn()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiQrCheckInRequest = {
  // number
  eventId: 1,
  // QRCheckInRequest (optional)
  qRCheckInRequest: null,
};

apiInstance.qrCheckIn(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **qRCheckInRequest** | **QRCheckInRequest**|  |
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **saveDraftEvent**
> number saveDraftEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiSaveDraftEventRequest = {
  // number
  eventId: 1,
  // SaveDraftEventRequest (optional)
  saveDraftEventRequest: null,
};

apiInstance.saveDraftEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saveDraftEventRequest** | **SaveDraftEventRequest**|  |
 **eventId** | [**number**] |  | defaults to undefined


### Return type

**number**

### Authorization

[OAuth2PasswordBearer](README.md#OAuth2PasswordBearer)

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

# **searchEvents**
> SearchEventsResponse searchEvents()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .EventsApi(configuration);

let body:.EventsApiSearchEventsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // boolean (optional)
  isOnline: true,
  // boolean (optional)
  isOffline: true,
  // boolean (optional)
  isApplyOngoing: true,
  // boolean (optional)
  isApplyEnded: true,
  // boolean (optional)
  isToday: true,
  // boolean (optional)
  isFree: true,
  // boolean (optional)
  isPaid: true,
  // Array<JobTypeCode> (optional)
  jobTypeCodes: [
    "DEV",
  ],
  // Array<IndustryCode> (optional)
  industryCodes: [
    "REAL_ESTATE",
  ],
  // Array<string> (optional)
  cityCodes: [
    "city_codes_example",
  ],
  // Array<number> (optional)
  tags: [
    1,
  ],
  // string (optional)
  startAtFrom: "start_at_from_example",
  // string (optional)
  startAtTo: "start_at_to_example",
  // number (optional)
  organizationId: 1,
  // EventSortByCode (optional)
  sortBy: "START_AT",
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
};

apiInstance.searchEvents(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **isOnline** | [**boolean**] |  | (optional) defaults to undefined
 **isOffline** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyOngoing** | [**boolean**] |  | (optional) defaults to undefined
 **isApplyEnded** | [**boolean**] |  | (optional) defaults to undefined
 **isToday** | [**boolean**] |  | (optional) defaults to undefined
 **isFree** | [**boolean**] |  | (optional) defaults to undefined
 **isPaid** | [**boolean**] |  | (optional) defaults to undefined
 **jobTypeCodes** | **Array&lt;JobTypeCode&gt;** |  | (optional) defaults to undefined
 **industryCodes** | **Array&lt;IndustryCode&gt;** |  | (optional) defaults to undefined
 **cityCodes** | **Array&lt;string&gt;** |  | (optional) defaults to undefined
 **tags** | **Array&lt;number&gt;** |  | (optional) defaults to undefined
 **startAtFrom** | [**string**] |  | (optional) defaults to undefined
 **startAtTo** | [**string**] |  | (optional) defaults to undefined
 **organizationId** | [**number**] |  | (optional) defaults to undefined
 **sortBy** | **EventSortByCode** |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined


### Return type

**SearchEventsResponse**

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
