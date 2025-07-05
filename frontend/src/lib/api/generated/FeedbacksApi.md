# .FeedbacksApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteFeedback**](FeedbacksApi.md#deleteFeedback) | **DELETE** /api/v1/feedbacks/{feedback_id} | Delete Feedback
[**updateFeedback**](FeedbacksApi.md#updateFeedback) | **PUT** /api/v1/feedbacks/{feedback_id} | Update Feedback


# **deleteFeedback**
> void deleteFeedback()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .FeedbacksApi(configuration);

let body:.FeedbacksApiDeleteFeedbackRequest = {
  // number
  feedbackId: 1,
};

apiInstance.deleteFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedbackId** | [**number**] |  | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

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

# **updateFeedback**
> number updateFeedback()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .FeedbacksApi(configuration);

let body:.FeedbacksApiUpdateFeedbackRequest = {
  // number
  feedbackId: 1,
  // UpdateFeedbackRequest (optional)
  updateFeedbackRequest: null,
};

apiInstance.updateFeedback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateFeedbackRequest** | **UpdateFeedbackRequest**|  |
 **feedbackId** | [**number**] |  | defaults to undefined


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
