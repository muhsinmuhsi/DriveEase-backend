"use strict";
module.exports = (err, req, res, next) => {
    if (typeof err === 'string') {
        err = { message: err, statuscode: 400 }; // Default status code is 400 for bad requests
    }
    err.statuscode = err.statuscode || 500;
    err.status = err.status || "error";
    res.status(err.statuscode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
