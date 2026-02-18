const { NotFoundError, AppError } = require("../errors");

function notFoundError(req, res, next)
{
    next(new NotFoundError("A kívánt erőforrás nem található!"));
}

function showError(error, req, res, next)
{
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            code: error.statusCode,
            msg: error.message,
            ...(error.details && { details: error.details }),
            ...(error.data && { data: error.data })
        });
    }

    if (error.status) {
        return res.status(error.status).json({
            code: error.status,
            msg: error.message || "Internal Server Error"
        });
    }

    res.status(500).json({
        code: 500,
        msg: error.message || "Internal Server Error"
    });
}

module.exports = [ notFoundError, showError ];