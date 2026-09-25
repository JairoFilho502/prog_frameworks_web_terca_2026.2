const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const EmailJaCadastradoError = require("../errors/EmailJaCadastradoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        //SELECT * FROM alunos ORDER BY orderBy order LIMIT pageSize OFFSET skip
        const [alunos, total] = await Promise.all([
            prisma.aluno.findMany({
                skip: (page-1)*pageSize,
                take: Number(pageSize),
                orderBy: { [orderBy]: order }
            }),
            prisma.aluno.count()
        ]);

        return { alunos, total };
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }

    async findUnique(id){
        const aluno = await prisma.aluno.findUnique({
            where: { id }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, dadosAtualizacao){
        const {nome, email} = dadosAtualizacao;

        //Dados inválidos: corpo vazio ou sem nenhum campo válido para atualizar.
        //Reaproveita AlunoInvalidoError, pois é a mesma natureza de erro do create
        //(dado de entrada ausente/insuficiente), só que agora no update.
        if(!nome && !email){
            throw new AlunoInvalidoError("Informe nome e/ou email para atualizar");
        }

        //Aluno não encontrado: reaproveita a mesma exceção do findUnique.
        const aluno = await this.findUnique(id);

        const dados = {};
        if(nome) dados.nome = nome;
        if(email) dados.email = email;

        try{
            const alunoAtualizado = await prisma.aluno.update({
                where: { id: aluno.id },
                data: dados
            });
            return alunoAtualizado;
        }catch(e){
            //P2002: violação de constraint @unique do Prisma (email duplicado).
            //Merece exceção própria, pois é um erro de conflito de dado,
            //diferente de "dado ausente" (AlunoInvalidoError) ou "não encontrado".
            if(e.code === "P2002"){
                throw new EmailJaCadastradoError();
            }
            throw e;
        }
    }
}

module.exports = new AlunoService();