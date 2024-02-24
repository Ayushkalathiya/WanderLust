class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        // console.error(message);
    }
}

 module.exports = ExpressError;