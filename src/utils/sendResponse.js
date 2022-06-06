const sendResponse = (res, statusCode, data) => {
	return res.status(statusCode).json({
		respStatus: "success",
		data,
	});
};

module.exports = sendResponse;

