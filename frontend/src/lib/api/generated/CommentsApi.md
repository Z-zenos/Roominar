# .CommentsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteComment**](CommentsApi.md#deleteComment) | **DELETE** /api/v1/comments/{comment_id} | Delete Comment
[**deleteCommentReply**](CommentsApi.md#deleteCommentReply) | **DELETE** /api/v1/comments/replies/{reply_id} | Delete Comment Reply
[**listingCommentReplies**](CommentsApi.md#listingCommentReplies) | **GET** /api/v1/comments/{comment_id}/replies | Listing Comment Replies
[**pinComment**](CommentsApi.md#pinComment) | **POST** /api/v1/comments/{comment_id}/pin | Pin Comment
[**replyComment**](CommentsApi.md#replyComment) | **POST** /api/v1/comments/{comment_id}/replies | Reply Comment
[**unpinComment**](CommentsApi.md#unpinComment) | **DELETE** /api/v1/comments/{comment_id}/pin | Unpin Comment
[**updateComment**](CommentsApi.md#updateComment) | **PUT** /api/v1/comments/{comment_id} | Update Comment
[**updateCommentReply**](CommentsApi.md#updateCommentReply) | **PUT** /api/v1/comments/replies/{reply_id} | Update Comment Reply
[**voteComment**](CommentsApi.md#voteComment) | **POST** /api/v1/comments/{comment_id}/vote | Vote Comment


# **deleteComment**
> void deleteComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiDeleteCommentRequest = {
  // number
  commentId: 1,
};

apiInstance.deleteComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**number**] |  | defaults to undefined


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

# **deleteCommentReply**
> void deleteCommentReply()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiDeleteCommentReplyRequest = {
  // number
  replyId: 1,
};

apiInstance.deleteCommentReply(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **replyId** | [**number**] |  | defaults to undefined


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

# **listingCommentReplies**
> ListingCommentRepliesResponse listingCommentReplies()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiListingCommentRepliesRequest = {
  // number
  commentId: 1,
};

apiInstance.listingCommentReplies(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**number**] |  | defaults to undefined


### Return type

**ListingCommentRepliesResponse**

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

# **pinComment**
> number pinComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiPinCommentRequest = {
  // number
  commentId: 1,
};

apiInstance.pinComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**number**] |  | defaults to undefined


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

# **replyComment**
> number replyComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiReplyCommentRequest = {
  // number
  commentId: 1,
  // CreateCommentReplyRequest (optional)
  createCommentReplyRequest: null,
};

apiInstance.replyComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createCommentReplyRequest** | **CreateCommentReplyRequest**|  |
 **commentId** | [**number**] |  | defaults to undefined


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

# **unpinComment**
> void unpinComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiUnpinCommentRequest = {
  // number
  commentId: 1,
};

apiInstance.unpinComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**number**] |  | defaults to undefined


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

# **updateComment**
> number updateComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiUpdateCommentRequest = {
  // number
  commentId: 1,
  // UpdateEventCommentRequest (optional)
  updateEventCommentRequest: null,
};

apiInstance.updateComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateEventCommentRequest** | **UpdateEventCommentRequest**|  |
 **commentId** | [**number**] |  | defaults to undefined


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

# **updateCommentReply**
> number updateCommentReply()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiUpdateCommentReplyRequest = {
  // number
  replyId: 1,
  // UpdateCommentReplyRequest (optional)
  updateCommentReplyRequest: null,
};

apiInstance.updateCommentReply(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateCommentReplyRequest** | **UpdateCommentReplyRequest**|  |
 **replyId** | [**number**] |  | defaults to undefined


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

# **voteComment**
> number voteComment()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CommentsApi(configuration);

let body:.CommentsApiVoteCommentRequest = {
  // number
  commentId: 1,
  // VoteCommentRequest (optional)
  voteCommentRequest: null,
};

apiInstance.voteComment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **voteCommentRequest** | **VoteCommentRequest**|  |
 **commentId** | [**number**] |  | defaults to undefined


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
