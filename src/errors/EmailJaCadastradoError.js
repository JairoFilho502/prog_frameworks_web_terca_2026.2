const ApiError = require("./ApiError");

class EmailJaCadastradoError extends ApiError{
    constructor(message="Email já cadastrado para outro aluno", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = EmailJaCadastradoError;