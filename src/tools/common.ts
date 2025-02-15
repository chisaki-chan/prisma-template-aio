export const apiOk = (response: any, data: any) => {
    return response.status(200).json({
        success: true,
        status: 200,
        data: data
    });
}

function apiError(res, message, code) {

    return res.status(code).json({
        success: false,
        status: code,
        error: {
            message: message
        }
    });
}


function badRequest(res, data, message) {
    return res.status(400).json({
        success: false,
        status: "error",
        message: message ? message : "Bad Request",
        data: data,
        errorCode: "400"
    });
}

function serverError(res, data, message) {
    return res.status(500).json({
        success: false,
        status: "error",
        message: message ? message : "Internal Server Error",
        data: data,
        errorCode: "500"
    });
}

function dataCreated(res, data, message) {
    return res.status(201).json({
        success: true,
        status: "success",
        code: 201,
        message: message ? message : "Data added successfully",
        data: data
    });
}

function dataUpdated(res, data, message) {
    return res.status(201).json({
        success: true,
        status: "success",
        code: 201,
        message: message ? message : "Data updated successfully",
        data: data
    });
}

function success(res, data, message) {
    return res.status(200).json({
        success: true,
        status: "success",
        code: 200,
        message: message ? message : "The requested operation was successful",
        data: data
    });
}


function forbiddenError(res, data, message) {
    return res.status(403).json({
        success: false,
        status: "error",
        message: message ? message : "Request requires authorization, please provide a token",
        data: data,
        errorCode: "403"
    });
}

function errorToken(res, data, message) {
    return res.status(401).json({
        success: false,
        status: "error",
        message: message ? message : "Token consistency error",
        data: data,
        errorCode: "401"
    });
}

function errorHandle(res, message, code) {
    return res.status(code).json({
        isSuccess: false,
        status: code,
        error: {
            message: message
        }
    });
}

export default {
    apiOk,
    apiError,
    badRequest,
    serverError,
    dataCreated,
    success,
    dataUpdated,
    forbiddenError,
    errorHandle
} 
