const {
    AuthFailureResponse,
    BadRequestResponse,
    NotFoundResponse,
    ServerErrorResponse,
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

class AppError extends Error {
    constructor(type, message = "Error", statusCode) {
        super(type);
        this.statusCode = statusCode;
        this.message = message;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    handleProductionError(err, req, res) {
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

    handle(err, res) {
        switch (err.type) {
            case ErrorType.BAD_TOKEN:
            case ErrorType.TOKEN_EXPIRED:
            case ErrorType.UNAUTHORIZED:
            case ErrorType.ACCESS_TOKEN:
            case ErrorType.INTERNAL:
            case ErrorType.NOT_FOUND:
            case ErrorType.BAD_REQUEST:
            case ErrorType.FORBIDDEN:

            default:
                if (process.env.NODE_ENV === "production") {
                    this.handleProductionError(err, req, res);
                }
        }
    }
}
