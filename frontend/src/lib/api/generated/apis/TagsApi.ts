// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';


    import type { ErrorResponse400 } from '../models/ErrorResponse400';
    import type { ErrorResponse401 } from '../models/ErrorResponse401';
    import type { ErrorResponse403 } from '../models/ErrorResponse403';
    import type { ListingTagRankResponse } from '../models/ListingTagRankResponse';
    import type { ListingTagsResponse } from '../models/ListingTagsResponse';

    /**
    * no description
    */
    export class TagsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Listing Tag Rank
        */
        public async listingTagRank(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/tags/rank';

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
            * Listing Tags
        */
        public async listingTags(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/api/v1/tags';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        }

        export class TagsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingTagRank
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingTagRankWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingTagRankResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingTagRankResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingTagRankResponse", ""
                        ) as ListingTagRankResponse;
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
                    const body: ListingTagRankResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingTagRankResponse", ""
                    ) as ListingTagRankResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to listingTags
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingTagsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingTagsResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingTagsResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingTagsResponse", ""
                        ) as ListingTagsResponse;
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
                    const body: ListingTagsResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingTagsResponse", ""
                    ) as ListingTagsResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

        }
