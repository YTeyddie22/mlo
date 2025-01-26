const {
    AuthFailureResponse,
    BadRequestResponse,
    NotFoundResponse,
    ServerErrorResponse,
    ForbiddenResponse,
} = require("./apiResponse");

const ErrorType = {
    BAD_TOKEN: "BadTokenError",
    TOKEN_EXPIRED: "TokenExpiredError",
    UNAUTHORIZED: "AuthFailureError",
    ACCESS_TOKEN: "AccessTokenError",
    INTERNAL: "InternalError",
    NOT_FOUND: "NotFoundError",
    BAD_REQUEST: "BadRequestError",
    FORBIDDEN: "ForbiddenError",
};

class ApiError extends Error {
    constructor(type, message = "Error", statusCode) {
        super(type);
        this.statusCode = statusCode;
        this.message = message;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    _handleProductionError(err, req, res) {
        //? For The Client invalidation

        const { status, message, statusCode } = err;

        /**
         * For The API
         */

        if (req.originalUrl.startsWith("/api")) {
            if (err.isOperational) {
                return res.status(statusCode).json({
                    status,
                    message,
                });
            }

            // 1) Log error

            console.error("ERROR 💥", err);

            // 2) Send generic message

            return res.status(500).json({
                status: "error",
                message: "Something went very wrong!",
            });
        }

        /**
         ** For The Rendered Website
         */

        if (err.isOperational) {
            return res.status(statusCode).render("error", {
                title: "Something Is wrong",
                msg: message,
            });
        }

        // 1) Log error

        console.error("ERROR 💥", err);

        // 2) Send generic message

        return res.status(statusCode).render("error", {
            title: "Something went terrible",
            msg: "Please try again some other time",
        });
    }

    static handle(err, res) {
        switch (err.type) {
            case ErrorType.BAD_TOKEN:
            case ErrorType.TOKEN_EXPIRED:
            case ErrorType.UNAUTHORIZED:
                return new AuthFailureResponse(err.message).send(res);
            case ErrorType.ACCESS_TOKEN:
            case ErrorType.INTERNAL:
                return new ServerErrorResponse(err.message).send(res);
            case ErrorType.NOT_FOUND:
                return new NotFoundResponse(err.message).send(res);
            case ErrorType.BAD_REQUEST:
                return new BadRequestResponse(err.message).send(res);
            case ErrorType.FORBIDDEN:
                return new ForbiddenResponse(err.message).send(res);

            default:
                if (process.env.NODE_ENV === "production") {
                    this._handleProductionErrorhandleProductionError(
                        err,
                        req,
                        res
                    );
                }
        }
    }
}

export class InternalError extends ApiError {
    constructor(message = "Internal Server Error") {
        super(ErrorType.INTERNAL, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(ErrorType.BAD_REQUEST, message);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(ErrorType.UNAUTHORIZED, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(ErrorType.NOT_FOUND, message);
    }
}

export class BadTokenError extends ApiError {
    constructor(message = "Token is not valid") {
        super(ErrorType.BAD_TOKEN, message);
    }
}

export class TokenExpiredError extends ApiError {
    constructor(message = "Token is expired") {
        super(ErrorType.TOKEN_EXPIRED, message);
    }
}

export class AccessTokenError extends ApiError {
    constructor(message = "Invalid access token") {
        super(ErrorType.ACCESS_TOKEN, message);
    }
}
