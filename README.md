# Programação para Frameworks Web

Este repositório contém os códigos e exemplos desenvolvidos durante a disciplina **Programação para Frameworks Web**, ministrada pelo professor **Thiago Rodrigues**.

## 🚀 Executando o projeto

Para executar o projeto em sua máquina, siga os passos abaixo.

### 1. Clonar o repositório

Clone este repositório utilizando o Git:

```bash
git clone URL_DO_REPOSITORIO
```

Em seguida, entre na pasta do projeto:

```bash
cd NOME_DO_PROJETO
```

### 2. Instalar as dependências

Com o projeto na pasta, execute:

```bash
npm install
```

Esse comando irá instalar todas as dependências necessárias para executar o projeto.

Depois,

```bash
npx prisma generate
```

Esse comando irá fazer o Prisma gerar o Prisma Client a partir do seu schema.prisma.

### 3. Variáveis de Ambiente

> ⚠️ **Lembrete:** sempre que alterar o banco de dados, usuário, senha, porta ou ambiente de execução, **atualize as variáveis de ambiente abaixo**.

```env
DATABASE_URL="mysql://root:thiago@localhost:3306/univ"

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=thiago
DB_NAME=univ

PORT=3000
```

#### Banco de Dados

As variáveis abaixo devem corresponder às configurações do banco MySQL utilizado pela aplicação:

* `DATABASE_URL` — URL de conexão com o banco.
* `DB_HOST` — endereço do servidor MySQL.
* `DB_USER` — usuário do banco.
* `DB_PASSWORD` — senha do banco.
* `DB_NAME` — nome do banco de dados.

#### Servidor

* `PORT` — porta utilizada pela aplicação.

### ⚠️ Importante

Ao clonar o projeto ou configurar um novo ambiente, verifique e **atualize essas variáveis antes de executar a aplicação**.

### 4. Executar o projeto

Após a instalação das dependências, execute o comando definido no projeto para iniciá-lo, por exemplo:

```bash
npm start
```

ou:

```bash
npm run dev
```

> **Observação:** O comando para iniciar o projeto pode variar de acordo com o projeto desenvolvido em aula. Consulte o `package.json` para verificar os scripts disponíveis.

## 📚 API de Alunos

Essa é a parte da aplicação que venho desenvolvendo ao longo da disciplina: uma API para cadastrar, listar, buscar, atualizar e remover alunos. Segue o padrão que aprendemos em aula — Controller cuida da requisição e da resposta, Service cuida da regra de negócio e do Prisma, e os erros de negócio (aluno não encontrado, dado inválido, email duplicado) são tratados por exceções próprias que caem num middleware central de erros.

### Listando alunos — `GET /alunos`

Retorna os alunos cadastrados, já com paginação. Dá pra ordenar o resultado e também vem o total de alunos no banco (útil pra quem for montar uma paginação de verdade).

Os parâmetros são todos opcionais, passados na query string:

- `page` — qual página buscar (começa em 1)
- `pageSize` — quantos alunos por página (padrão é 10)
- `orderBy` — por qual campo ordenar: `id`, `nome`, `email`, `createdAt` ou `updatedAt`
- `order` — `asc` ou `desc`

Se algum desses vier faltando ou com um valor que não faz sentido, a API não quebra: ela cai num padrão razoável (`id` crescente).

```
GET /alunos?page=1&pageSize=10&orderBy=nome&order=asc
```

```json
{
  "alunos": [ { "id": 1, "nome": "...", "email": "..." } ],
  "total": 42
}
```

### Buscando um aluno específico — `GET /alunos/:id`

Passa o id na URL e recebe os dados daquele aluno. Se o id não for um número, a API responde 400. Se for um número válido mas não existir nenhum aluno com esse id, responde 404 com uma mensagem explicando.

### Cadastrando um aluno — `POST /alunos`

```json
{ "nome": "Joao da Silva", "email": "joao@email.com" }
```

Cadastra com sucesso e devolve 201. Se faltar nome ou email, devolve 400.

### Atualizando um aluno — `PUT /alunos/:id`

Dá pra atualizar só o nome, só o email, ou os dois juntos — o que vier no corpo da requisição é o que muda:

```json
{ "nome": "Novo Nome" }
```

Alguns cuidados que essa rota toma:

- Se o corpo vier vazio ou sem nome nem email, devolve 400 (não tem o que atualizar).
- Se o id não corresponder a nenhum aluno, devolve 404.
- Se o email novo já pertencer a outro aluno, devolve 409 — o campo é único no banco, então isso é tratado como conflito, não como erro de validação comum.

Dando tudo certo, devolve 200 com o aluno já atualizado.

### Removendo um aluno — `DELETE /alunos/:id`

Remove o aluno pelo id. Se ele não existir, 404. Se remover com sucesso, a resposta é 204 — sem corpo, porque depois de deletado não faz sentido devolver os dados do aluno.

---

**Disciplina:** Programação para Frameworks Web
**Professor:** Thiago Rodrigues