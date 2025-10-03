function notFoundError(req, res, next)
{
    const error = new Error("A kívánt erőforrás nem található!");

    error.status = 404;

    next(error);
}

function showError(error, req, res, next)
{
    res.status(error.status || 500).json(
    {
        code: error.status || 500,
        msg: error.message || "Internal Server Error"
    });
}

module.exports = [ notFoundError, showError ];