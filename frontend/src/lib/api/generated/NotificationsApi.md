# .NotificationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**registerNotificationDeviceToken**](NotificationsApi.md#registerNotificationDeviceToken) | **POST** /api/v1/notifications/device-token | Register Notification Device Token
[**removeNotificationDeviceToken**](NotificationsApi.md#removeNotificationDeviceToken) | **DELETE** /api/v1/notifications/device-token/{fcm_token} | Remove Notification Device Token


# **registerNotificationDeviceToken**
> RegisterNotificationDeviceTokenResponse registerNotificationDeviceToken()

Register or update a device token for push notifications

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .NotificationsApi(configuration);

let body:.NotificationsApiRegisterNotificationDeviceTokenRequest = {
  // RegisterNotificationDeviceTokenRequest (optional)
  registerNotificationDeviceTokenRequest: null,
};

apiInstance.registerNotificationDeviceToken(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerNotificationDeviceTokenRequest** | **RegisterNotificationDeviceTokenRequest**|  |


### Return type

**RegisterNotificationDeviceTokenResponse**

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

# **removeNotificationDeviceToken**
> void removeNotificationDeviceToken()

Remove a device token when logging out

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .NotificationsApi(configuration);

let body:.NotificationsApiRemoveNotificationDeviceTokenRequest = {
  // string
  fcmToken: "fcm_token_example",
};

apiInstance.removeNotificationDeviceToken(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fcmToken** | [**string**] |  | defaults to undefined


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
**200** | Successful Response |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)
