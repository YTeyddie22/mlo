const { Response } = require("express");

const StatusCode = {
    SUCCESS: "SUCCESS",
    WARN: "WARN",
    FAILURE: "FAILURE",
    RETRY: "RETRY",
    UNAUTHORIZED: "UNAUTHORIZED",
    INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
    SERVER_ERROR: "SERVER_ERROR",
};

const ResponseStatus = {
    SUCCESS: 200,
    CREATED: 201,
    PARTIAL_CONTENT: 206,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

class APIResponse {
    constructor(StatusCode, ResponseStatus, message) {}
}
