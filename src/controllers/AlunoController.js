const alunoService = require("../services/AlunoService");
const alunoIdSchema = require("../schemas/alunoIdSchema");

class AlunoController{

    async findMany(request, response){
        let {page, pageSize, orderBy, order} = request.query;
        page ||= 1;
        pageSize ||= 10;

        const camposOrdenaveis = ["id", "nome", "email", "createdAt", "updatedAt"];
        if(!camposOrdenaveis.includes(orderBy)){
            orderBy = "id";
        }
        if(order !== "asc" && order !== "desc"){
            order = "asc";
        }

        const {alunos, total} = await alunoService.findMany(page, pageSize, orderBy, order);
        return response.status(200).json({alunos, total});
    }

    async create(request, response){
        try{
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({aluno});
        }catch(e){
            return response.status(e.statusCode).json({error: e.message});
        }
    }

    async findUnique(request, response, next){
        try{
            const {id} = alunoIdSchema.parse(request.params);
            const aluno = await alunoService.findUnique(id);
            return response.status(200).json(aluno);
        }catch(e){
            next(e);
        }
    }
}

module.exports = new AlunoController();