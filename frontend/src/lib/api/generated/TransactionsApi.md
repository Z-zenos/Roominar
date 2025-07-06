# .TransactionsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTransactionStatusCounts**](TransactionsApi.md#getTransactionStatusCounts) | **GET** /api/v1/transactions/my-transactions/status-counts | Get Transaction Status Counts
[**handleTransaction**](TransactionsApi.md#handleTransaction) | **POST** /api/v1/transactions/webhook | Handle Transaction
[**listingMyTransactions**](TransactionsApi.md#listingMyTransactions) | **GET** /api/v1/transactions/my-transactions | Listing My Transactions


# **getTransactionStatusCounts**
> GetTransactionStatusCountsResponse getTransactionStatusCounts()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TransactionsApi(configuration);

let body:any = {};

apiInstance.getTransactionStatusCounts(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**GetTransactionStatusCountsResponse**

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

# **handleTransaction**
> void handleTransaction()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TransactionsApi(configuration);

let body:any = {};

apiInstance.handleTransaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listingMyTransactions**
> ListingMyTransactionsResponse listingMyTransactions()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TransactionsApi(configuration);

let body:.TransactionsApiListingMyTransactionsRequest = {
  // string (optional)
  keyword: "keyword_example",
  // TransactionStatusCode (optional)
  status: null,
  // number (optional)
  transactionId: 1,
  // number (optional)
  page: 1,
  // number (optional)
  perPage: 1,
};

apiInstance.listingMyTransactions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] |  | (optional) defaults to undefined
 **status** | **TransactionStatusCode** |  | (optional) defaults to undefined
 **transactionId** | [**number**] |  | (optional) defaults to undefined
 **page** | [**number**] |  | (optional) defaults to undefined
 **perPage** | [**number**] |  | (optional) defaults to undefined


### Return type

**ListingMyTransactionsResponse**

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
