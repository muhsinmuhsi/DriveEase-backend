"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apperror = void 0;
class apperror extends Error {
    constructor(messege, statuscode) {
        super(messege);
        this.statuscode = statuscode;
        this.status = `${statuscode}`.startsWith('4') ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.apperror = apperror;
