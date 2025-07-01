# .UsersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTotalUnreadNotifications**](UsersApi.md#getTotalUnreadNotifications) | **GET** /api/v1/users/total-unread-notifications | Get Total Unread Notifications
[**listingNotifications**](UsersApi.md#listingNotifications) | **GET** /api/v1/users/notifications | Listing Notifications
[**markNotificationAsRead**](UsersApi.md#markNotificationAsRead) | **PATCH** /api/v1/users/notifications/{notification_id}/read | Mark Notification As Read
[**updateAudience**](UsersApi.md#updateAudience) | **PATCH** /api/v1/users/profile | Update Audience


# **getTotalUnreadNotifications**
> number getTotalUnreadNotifications()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:any = {};

apiInstance.getTotalUnreadNotifications(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingNotifications**
> ListingNotificationsResponse listingNotifications()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiListingNotificationsRequest = {
  // number (optional)
  perPage: 1,
  // number (optional)
  page: 1,
  // boolean (optional)
  isRead: true,
};

apiInstance.listingNotifications(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **perPage** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined
 **isRead** | [**boolean**] |  | (optional) defaults to undefined


### Return type

**ListingNotificationsResponse**

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

# **markNotificationAsRead**
> number markNotificationAsRead()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiMarkNotificationAsReadRequest = {
  // number
  notificationId: 1,
};

apiInstance.markNotificationAsRead(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationId** | [**number**] |  | defaults to undefined


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

# **updateAudience**
> GetMeResponse updateAudience(updateUserRequest)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .UsersApi(configuration);

let body:.UsersApiUpdateAudienceRequest = {
  // UpdateUserRequest
  updateUserRequest: null,
};

apiInstance.updateAudience(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUserRequest** | **UpdateUserRequest**|  |


### Return type

**GetMeResponse**

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
