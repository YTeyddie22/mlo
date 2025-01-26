const { Response } = require("express");

const StatusCode = {
    SUCCESS: "SUCCESS",
    WARN: "WARN",
    FAILURE: "FAILURE",
    RETRY: "RETRY",
    UNAUTHORIZED: "UNAUTHORIZED",
    INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
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

class ApiResponse {
    constructor(statusCode, status, message) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }
    /**Prepare our response for actions */
    prepare(res, response) {
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }

    send(res) {
        return this.prepare(res, this);
    }

    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        delete clone.status;

        for (const key in clone) {
            if (clone[key] === undefined) {
                delete clone[key];
            }
        }

        return clone;
    }
}

export class AuthFailureError extends ApiResponse {
    constructor(message = "Authentication Failure") {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    }
}

export class NotFoundResponse extends ApiResponse {
    constructor(message = "Not Found") {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
        this.url = undefined;
    }

    send(res) {
        this.url = res.req?.originalUrl;
        return super.prepare(res, this);
    }
}

export class ServerErrorResponse extends ApiResponse {
    constructor(message = "Internal Server Error") {
        super(StatusCode.FAILURE, ResponseStatus.SERVER_ERROR, message);
    }
}

export class SuccessMessageResponse extends ApiResponse {
    constructor(message) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}
