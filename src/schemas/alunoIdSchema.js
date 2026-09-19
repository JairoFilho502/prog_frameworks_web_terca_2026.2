const z = require("zod");

const alunoIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "ID deve ser numérico")
        .transform(Number)
        .refine((n) => n <= 2147483647, "ID fora do intervalo permitido")
});

module.exports = alunoIdSchema;