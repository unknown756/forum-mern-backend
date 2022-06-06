const sendForDevMode = (statusCode, responseStatus, err, res) => {
	return res.status(statusCode).json({
		responseStatus,
		message: err.message,
		stack: err.stack,
		err
	});
};

const sendForProdMode = (statusCode, responseStatus, err, res) =>{
	return res.status(statusCode).json({
		responseStatus,
		message: err.message
	});
};



const handleCastError = (err, statusCode, responseStatus, res) => {
	const invalidVal = err.message.split('"')[1];
	const message = "Invalid id: " + invalidVal;
	res.status(statusCode).json({
		responseStatus,
		message
	});
};
const handleValidationErr = (err, statusCode, responseStatus, res) => {
	const message = err.message.split(":")[2].split(".")[0];
    res.status(statusCode).json({
		responseStatus,
		message
	});
};
const handleMongoServerError = (err, statusCode, responseStatus, res) => {
    return res.status(statusCode).json({
        responseStatus,
        message: err.message
    });
};



const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const responseStatus = err.responseStatus || 'error';
	if (process.env.NODE_ENV === "development"){
		return sendForDevMode(statusCode, responseStatus,err, res)
	}
	if (err.name === "CastError") {
		return handleCastError(err, statusCode, responseStatus, res)
	}
	else if(err.name === "ValidationError") {
		return handleValidationErr(err, statusCode, responseStatus, res)
	}
    else if(err.name === "MongoServerError"){
        return handleMongoServerError(err, statusCode, responseStatus, res)
    }
	sendForProdMode(statusCode, responseStatus, err, res)
};


module.exports = errorHandler;
