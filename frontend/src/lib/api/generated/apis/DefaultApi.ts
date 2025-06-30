// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';



    /**
    * no description
    */
    export class DefaultApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Healthcheck
        */
        public async healthcheckHealthcheckGet(_options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

            // Path Params
            const localVarPath = '/healthcheck';

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

        export class DefaultApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to healthcheckHealthcheckGet
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async healthcheckHealthcheckGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
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

        }
