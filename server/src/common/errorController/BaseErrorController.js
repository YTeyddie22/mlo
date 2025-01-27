import {
    BadRequestResponse,
    BadRequestResponseWithData,
    CreatedMessageResponse,
    NotFoundResponse,
    ServerErrorResponse,
    SuccessMessageResponse,
    SuccessResponse,
} from "./apiResponse";

class BaseController {
    #res;
    #req;

    constructor(req, res) {
        this.#req = req;
        this.#res = res;
    }

    createdResponse() {
        return new CreatedMessageResponse().send(this.#res);
    }

    createResponseWithData(data) {
        return new SuccessResponse("Success", data).send(this.#res);
    }

    successResponse() {
        return new SuccessMessageResponse("Success").send(this.#res);
    }

    successResponseWithData(data) {
        return new SuccessResponse("Success", data).send(this.#res);
    }

    badRequestResponse() {
        return new BadRequestResponse("Bad Request").send(this.#res);
    }

    badRequestResponseWithData(data) {
        return new BadRequestResponseWithData("Bad Request", data).send(
            this.#res
        );
    }

    notFoundResponse() {
        return new NotFoundResponse("Not Found").send(this.#res);
    }

    serverErrorResponse() {
        return new ServerErrorResponse().send(this.#res);
    }
}

export default BaseController;
