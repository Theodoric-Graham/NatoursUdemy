class AppError extends Error {
  constructor(message, statusCode) {
    //the parent class is Error, and whatever we pass into it is going to be the message property
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //first, the current object, then the appError class itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
