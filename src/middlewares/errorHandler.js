const z = require("zod");
const ApiError = require("../errors/ApiError");

const errorHandler = (error, request, response, next) => {
    if(error instanceof z.ZodError){
        return response.status(400).json({message: error.issues[0].message});
    }

    if(error instanceof ApiError){
        return response.status(error.statusCode).json({message: error.message});
    }

    if(error.type === "entity.parse.failed"){
        return response.status(400).json({message: "JSON inválido"});
    }

    console.error(error);
    return response.status(500).json({message: "Erro interno do servidor"});
};

module.exports = errorHandler;