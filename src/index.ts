
import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})


app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

// Prática 1

app.get("/bands", async (req: Request, res: Response) => {
    try{
        const result = await db.raw(`SELECT * FROM bands`);
        res.status(200).send(result);
    }
    catch(error: any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/bands", async (req: Request, res: Response) => {

    try{
         /* const id = req.body.id
    const name = req.body.name */

    const {id, name} = req.body

    if(!id || !name){
        throw new Error("Há dados inválidos");
    }

    await db.raw(`
    INSERT INTO bands(id, name) 
    VALUES("${id}", "${name}")`);

    res.status(200).send("Banda cadastrada com sucesso!")

    }catch(error: any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

// Prática 3

app.put("/bands/:id", async (req: Request, res: Response) =>{

    try{

        const id = req.params.id;
        
        const newId = req.body.id;
        const newName = req.body.name;

        console.log(id);
        console.log(newId, newName)

        if(newId !== undefined){
            if(typeof newId !== "string"){
                res.status(400)
                throw new Error("ID deve ser uma string.")
            }

            if(newId.length < 2){
                res.status(400)
                throw new Error("O id deve possuir mais de dois caracteres!")
            }
        }

        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400);
                throw new Error("O nome deve ser uma string!")
            }

            if(newName.length < 3){
                res.status(400);
                throw new Error("O nome deve possuir mais de dois caracteres!");
            }
        }

        // usando a desestruturação desta forma "[]", já estamos obtendo o array na primeira posição;
        const [band] = await db.raw(`SELECT * FROM bands WHERE id="${id}"`)

        if(band){
            await db.raw(`
            UPDATE bands
            SET id = "${newId || band.id}", name = "${newName || band.name}"
            WHERE id = "${id}"
            `)
        } else {
            res.status(400);
            throw new Error("id não encontrado!");
        }

        res.status(200).send("Edição realizada com sucesso!");

    }catch(error: any){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//---------------------------------------------------------------------

//Exercício de fixação;

app.get("/songs", async (req: Request, res: Response) => {
    try{

        const result = await db.raw(`SELECT * FROM songs`)

        res.status(200).send(result);

    } catch(error: any){

        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/songs", async (req: Request, res: Response) => {
    try{

        const {id, name, band_id} = req.body;

        if(! id || !name || !band_id){
            res.status(400);
            throw new Error("Há dados inválidos!")
        }

        await db.raw(`
        INSERT INTO songs
        VALUES("${id}", "${name}", "${band_id}")
        `);

        res.status(200).send("Música cadastrada com sucesso!")


    } catch(error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


