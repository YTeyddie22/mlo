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
    /**
     * @param {number} statusCode
     * @param {string} status
     * @param {string} message
     */

    constructor(statusCode, status, message) {
        this._statusCode = statusCode;
        this._status = status;
        this._message = message;
    }

    /**
     * Prepares the response object.
     * @param {Response} res
     * @param {ApiResponse} response
     * @returns {Response}
     */
    _prepare(res, response) {
        return res.status(this._status).json(ApiResponse._sanitize(response));
    }

    send(res) {
        return this._prepare(res, this);
    }

    static _sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        delete clone._status;

        for (const key in clone) {
            if (clone[key] === undefined) {
                delete clone[key];
            }
        }

        return clone;
    }
}

export class AuthFailureResponse extends ApiResponse {
    constructor(message = "Authentication Failure") {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    }
}

export class NotFoundResponse extends ApiResponse {
    #url;
    constructor(message = "Not Found") {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
        this.#url = undefined;
    }

    send(res) {
        this.#url = res.req?.originalUrl;
        return super._prepare(res, { ...this, url: this.#url });
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

export class SuccessResponse extends ApiResponse {
    #data;
    constructor(message, data) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
        this.#data = data;
    }

    send(res) {
        return super._prepare(res, { ...this, data: this.#data });
    }
}

export class CreatedMessageResponse extends ApiResponse {
    constructor(message = "Created") {
        super(StatusCode.SUCCESS, ResponseStatus.CREATED, message);
    }
}

export class CreatedResponse extends ApiResponse {
    /**
     * @param {string} message
     * @param {*} data
     */
    #data;
    constructor(message, data) {
        super(StatusCode.SUCCESS, ResponseStatus.CREATED, message);
        this.#data = data;
    }

    /**
     * Sends the response
     * @param {Response} res
     * @returns {Response}
     */

    send(res) {
        return super._prepare(res, { data: this.#data });
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = "Bad Request") {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
    }
}

export class BadRequestResponseWithData extends ApiResponse {
    #data;
    constructor(message, data) {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
        this.#data = data;
    }

    send(res) {
        return super._prepare(res, { ...this, data: this.#data });
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message = "Forbidden") {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
    }
}
