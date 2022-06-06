class AppError extends Error{
	constructor(message, statusCode){
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.responseStatus = String(statusCode).startsWith("5") ? "error":"fail";

		Error.captureStackTrace(this, this.constructor)

	}
};

module.exports = AppError;
