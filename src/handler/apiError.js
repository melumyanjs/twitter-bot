class ApiError extends Error {
    constructor(status, message, errors = []){
        super()
        this.status = status
        this.message = message
        this.errors = errors
    }

    static badRequest(msg, err = []) {
        return new ApiError(400, msg, err)
    }

    static unauthorized(msg){
        return new ApiError(401, msg)
    }

    static notFound(msg){
        return new ApiError(404, msg)
    }

    static forbidden(msg) {
        return new ApiError(403, msg)
    }

    static internal(msg) {
        return new ApiError(500, msg)
    }


}

module.exports = ApiError