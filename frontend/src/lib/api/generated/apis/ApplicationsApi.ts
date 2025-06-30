// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';


    import type { CreateApplicationCheckoutSessionResponse } from '../models/CreateApplicationCheckoutSessionResponse';
    import type { CreateApplicationRequest } from '../models/CreateApplicationRequest';
    import type { ErrorResponse400 } from '../models/ErrorResponse400';
    import type { ErrorResponse401 } from '../models/ErrorResponse401';
    import type { ErrorResponse403 } from '../models/ErrorResponse403';
    import type { HTTPValidationError } from '../models/HTTPValidationError';

    /**
    * no description
    */
    export class ApplicationsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Cancel Application
            * @param applicationId 
        */
        public async cancelApplication(applicationId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'applicationId' is not null or undefined
                    if (applicationId === null || applicationId === undefined) {
                    throw new RequiredError("ApplicationsApi", "cancelApplication", "applicationId");
                    }


            // Path Params
            const localVarPath = '/api/v1/applications/{application_id}'
                .replace('{' + 'application_id' + '}', encodeURIComponent(String(applicationId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Create Application Checkout Session
            * @param createApplicationRequest 
        */
        public async createApplicationCheckoutSession(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/applications/checkout-session';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(createApplicationRequest, "CreateApplicationRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Create Free Application
            * @param createApplicationRequest 
        */
        public async createFreeApplication(createApplicationRequest?: CreateApplicationRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/applications/free-application';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(createApplicationRequest, "CreateApplicationRequest", ""),
                contentType
                );
                requestContext.setBody(serializedBody);

                let authMethod: SecurityAuthentication | undefined;
                // Apply auth methods
                authMethod = _config.authMethods["OAuth2PasswordBearer"]
                if (authMethod?.applySecurityAuthentication) {
                await authMethod?.applySecurityAuthentication(requestContext);
                }

                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        }

        export class ApplicationsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to cancelApplication
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async cancelApplicationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("204", response.httpStatusCode)) {
                        return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
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
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
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

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createApplicationCheckoutSession
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createApplicationCheckoutSessionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CreateApplicationCheckoutSessionResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: CreateApplicationCheckoutSessionResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "CreateApplicationCheckoutSessionResponse", ""
                        ) as CreateApplicationCheckoutSessionResponse;
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
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: CreateApplicationCheckoutSessionResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "CreateApplicationCheckoutSessionResponse", ""
                    ) as CreateApplicationCheckoutSessionResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to createFreeApplication
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async createFreeApplicationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: string = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "string", ""
                        ) as string;
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
                if (isCodeInRange("422", response.httpStatusCode)) {
                        const body: HTTPValidationError = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "HTTPValidationError", ""
                        ) as HTTPValidationError;
                        throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
                }

            // Work around for missing responses in specification, e.g. for petstore.yaml
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                    const body: string = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "string", ""
                    ) as string;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

        }
