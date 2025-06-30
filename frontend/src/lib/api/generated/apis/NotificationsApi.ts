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
    import type { HTTPValidationError } from '../models/HTTPValidationError';
    import type { RegisterNotificationDeviceTokenRequest } from '../models/RegisterNotificationDeviceTokenRequest';
    import type { RegisterNotificationDeviceTokenResponse } from '../models/RegisterNotificationDeviceTokenResponse';

    /**
    * no description
    */
    export class NotificationsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Register or update a device token for push notifications
            * Register Notification Device Token
            * @param registerNotificationDeviceTokenRequest 
        */
        public async registerNotificationDeviceToken(registerNotificationDeviceTokenRequest?: RegisterNotificationDeviceTokenRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;


            // Path Params
            const localVarPath = '/api/v1/notifications/device-token';

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(registerNotificationDeviceTokenRequest, "RegisterNotificationDeviceTokenRequest", ""),
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
            * Remove a device token when logging out
            * Remove Notification Device Token
            * @param fcmToken 
        */
        public async removeNotificationDeviceToken(fcmToken: string, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'fcmToken' is not null or undefined
                    if (fcmToken === null || fcmToken === undefined) {
                    throw new RequiredError("NotificationsApi", "removeNotificationDeviceToken", "fcmToken");
                    }


            // Path Params
            const localVarPath = '/api/v1/notifications/device-token/{fcm_token}'
                .replace('{' + 'fcm_token' + '}', encodeURIComponent(String(fcmToken)));

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

        }

        export class NotificationsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to registerNotificationDeviceToken
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async registerNotificationDeviceTokenWithHttpInfo(response: ResponseContext): Promise<HttpInfo<RegisterNotificationDeviceTokenResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: RegisterNotificationDeviceTokenResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "RegisterNotificationDeviceTokenResponse", ""
                        ) as RegisterNotificationDeviceTokenResponse;
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
                    const body: RegisterNotificationDeviceTokenResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "RegisterNotificationDeviceTokenResponse", ""
                    ) as RegisterNotificationDeviceTokenResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to removeNotificationDeviceToken
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async removeNotificationDeviceTokenWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
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

        }
