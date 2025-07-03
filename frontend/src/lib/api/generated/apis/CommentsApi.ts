// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import type {Configuration} from '../configuration';
import type {RequestContext, ResponseContext} from '../http/http';
import { HttpMethod, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import type {SecurityAuthentication} from '../auth/auth';


    import type { CreateCommentReplyRequest } from '../models/CreateCommentReplyRequest';
    import type { ErrorResponse400 } from '../models/ErrorResponse400';
    import type { ErrorResponse401 } from '../models/ErrorResponse401';
    import type { ErrorResponse403 } from '../models/ErrorResponse403';
    import type { HTTPValidationError } from '../models/HTTPValidationError';
    import type { ListingCommentRepliesResponse } from '../models/ListingCommentRepliesResponse';
    import type { UpdateCommentReplyRequest } from '../models/UpdateCommentReplyRequest';
    import type { UpdateEventCommentRequest } from '../models/UpdateEventCommentRequest';
    import type { VoteCommentRequest } from '../models/VoteCommentRequest';

    /**
    * no description
    */
    export class CommentsApiRequestFactory extends BaseAPIRequestFactory {

        /**
            * Delete Comment
            * @param commentId
        */
        public async deleteComment(commentId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "deleteComment", "commentId");
                    }


            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

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
            * Delete Comment Reply
            * @param replyId
        */
        public async deleteCommentReply(replyId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'replyId' is not null or undefined
                    if (replyId === null || replyId === undefined) {
                    throw new RequiredError("CommentsApi", "deleteCommentReply", "replyId");
                    }


            // Path Params
            const localVarPath = '/api/v1/comments/replies/{reply_id}'
                .replace('{' + 'reply_id' + '}', encodeURIComponent(String(replyId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Listing Comment Replies
            * @param commentId
            * @param perPage
            * @param page
        */
        public async listingCommentReplies(commentId: number, perPage?: number, page?: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "listingCommentReplies", "commentId");
                    }




            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}/replies'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

                // Query Params
                if (perPage !== undefined) {
                requestContext.setQueryParam("per_page", ObjectSerializer.serialize(perPage, "number", ""));
                }

                // Query Params
                if (page !== undefined) {
                requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "number", ""));
                }



                const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
                if (defaultAuth?.applySecurityAuthentication) {
                await defaultAuth?.applySecurityAuthentication(requestContext);
                }

            return requestContext;
            }

        /**
            * Pin Comment
            * @param commentId
        */
        public async pinComment(commentId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "pinComment", "commentId");
                    }


            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}/pin'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
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
            * Reply Comment
            * @param commentId
            * @param createCommentReplyRequest
        */
        public async replyComment(commentId: number, createCommentReplyRequest?: CreateCommentReplyRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "replyComment", "commentId");
                    }



            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}/replies'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(createCommentReplyRequest, "CreateCommentReplyRequest", ""),
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
            * Unpin Comment
            * @param commentId
        */
        public async unpinComment(commentId: number, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "unpinComment", "commentId");
                    }


            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}/pin'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

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
            * Update Comment
            * @param commentId
            * @param updateEventCommentRequest
        */
        public async updateComment(commentId: number, updateEventCommentRequest?: UpdateEventCommentRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "updateComment", "commentId");
                    }



            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(updateEventCommentRequest, "UpdateEventCommentRequest", ""),
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
            * Update Comment Reply
            * @param replyId
            * @param updateCommentReplyRequest
        */
        public async updateCommentReply(replyId: number, updateCommentReplyRequest?: UpdateCommentReplyRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'replyId' is not null or undefined
                    if (replyId === null || replyId === undefined) {
                    throw new RequiredError("CommentsApi", "updateCommentReply", "replyId");
                    }



            // Path Params
            const localVarPath = '/api/v1/comments/replies/{reply_id}'
                .replace('{' + 'reply_id' + '}', encodeURIComponent(String(replyId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(updateCommentReplyRequest, "UpdateCommentReplyRequest", ""),
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
            * Vote Comment
            * @param commentId
            * @param voteCommentRequest
        */
        public async voteComment(commentId: number, voteCommentRequest?: VoteCommentRequest, _options?: Configuration): Promise<RequestContext> {
            const _config = _options || this.configuration;

                    // verify required parameter 'commentId' is not null or undefined
                    if (commentId === null || commentId === undefined) {
                    throw new RequiredError("CommentsApi", "voteComment", "commentId");
                    }



            // Path Params
            const localVarPath = '/api/v1/comments/{comment_id}/vote'
                .replace('{' + 'comment_id' + '}', encodeURIComponent(String(commentId)));

            // Make Request Context
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


                // Body Params
                const contentType = ObjectSerializer.getPreferredMediaType([
                    "application/json"
            ]);
                requestContext.setHeaderParam("Content-Type", contentType);
                const serializedBody = ObjectSerializer.stringify(
                ObjectSerializer.serialize(voteCommentRequest, "VoteCommentRequest", ""),
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

        export class CommentsApiResponseProcessor {

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to deleteComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async deleteCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
            * @params response Response returned by the server for a request to deleteCommentReply
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async deleteCommentReplyWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
            * @params response Response returned by the server for a request to listingCommentReplies
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async listingCommentRepliesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListingCommentRepliesResponse >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: ListingCommentRepliesResponse = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "ListingCommentRepliesResponse", ""
                        ) as ListingCommentRepliesResponse;
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
                    const body: ListingCommentRepliesResponse = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "ListingCommentRepliesResponse", ""
                    ) as ListingCommentRepliesResponse;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to pinComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async pinCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
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
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to replyComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async replyCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
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
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to unpinComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async unpinCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
            * @params response Response returned by the server for a request to updateComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async updateCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
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
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to updateCommentReply
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async updateCommentReplyWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
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
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

            /**
            * Unwraps the actual response sent by the server from the response context and deserializes the response content
            * to the expected objects
            *
            * @params response Response returned by the server for a request to voteComment
            * @throws ApiException if the response code was not in [200, 299]
            */
            public async voteCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<number >> {
            const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
                if (isCodeInRange("200", response.httpStatusCode)) {
                        const body: number = ObjectSerializer.deserialize(
                        ObjectSerializer.parse(await response.body.text(), contentType),
                        "number", ""
                        ) as number;
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
                    const body: number = ObjectSerializer.deserialize(
                    ObjectSerializer.parse(await response.body.text(), contentType),
                    "number", ""
                    ) as number;
                return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }

            throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
            }

        }
