const AppError = require("./AppError");

class UnauthorizedError extends AppError
{
    constructor(message = "Unauthorized entry", options = {})
    {
        super(message, { statusCode: 401, ...options });
    }
}

module.exports = UnauthorizedError;