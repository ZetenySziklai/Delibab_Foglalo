const { NotFoundError, AppError } = require("../errors");

function notFoundError(req, res, next)
{
    next(new NotFoundError("A kívánt erőforrás nem található!"));
}

function showError(error, req, res, next)
{
    // Ha az error már egy AppError példány, használjuk a statusCode-ját
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            code: error.statusCode,
            msg: error.message,
            ...(error.details && { details: error.details }),
            ...(error.data && { data: error.data })
        });
    }

    // Ha van status property (régi formátum), használjuk azt
    if (error.status) {
        return res.status(error.status).json({
            code: error.status,
            msg: error.message || "Internal Server Error"
        });
    }

    // Egyébként 500-as hiba
    res.status(500).json({
        code: 500,
        msg: error.message || "Internal Server Error"
    });
}

module.exports = [ notFoundError, showError ];