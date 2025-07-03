# .ApplicationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createApplicationCheckoutSession**](ApplicationsApi.md#createApplicationCheckoutSession) | **POST** /api/v1/applications/checkout-session | Create Application Checkout Session
[**createFreeApplication**](ApplicationsApi.md#createFreeApplication) | **POST** /api/v1/applications/free-application | Create Free Application


# **createApplicationCheckoutSession**
> CreateApplicationCheckoutSessionResponse createApplicationCheckoutSession()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationsApi(configuration);

let body:.ApplicationsApiCreateApplicationCheckoutSessionRequest = {
  // CreateApplicationRequest (optional)
  createApplicationRequest: null,
};

apiInstance.createApplicationCheckoutSession(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createApplicationRequest** | **CreateApplicationRequest**|  |


### Return type

**CreateApplicationCheckoutSessionResponse**

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

# **createFreeApplication**
> string createFreeApplication()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationsApi(configuration);

let body:.ApplicationsApiCreateFreeApplicationRequest = {
  // CreateApplicationRequest (optional)
  createApplicationRequest: null,
};

apiInstance.createFreeApplication(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createApplicationRequest** | **CreateApplicationRequest**|  |


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
