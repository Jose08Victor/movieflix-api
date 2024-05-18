const express = require('express');
const { PrismaClient } = require('@prisma/client');

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get('/movies', async (_, res) => {
   const movies = await prisma.movie.findMany({
      orderBy: { title: 'asc' },
      include: { genres: true, languages: true },
   });
   res.json(movies);
});

//serve para pegar as requisições do body em json
app.use(express.json())

app.post('/movies', async (req, res) => {
   const { title, genre_id, language_id, oscar_count, release_date } = req.body;
   
   try {
      await prisma.movie.create({
         data: {
            title,
            genre_id,
            language_id,
            oscar_count,
            release_date: new Date(release_date),
         },
      });
   } catch (error) {
      return res.status(500).send({ message: "Falha ao cadastrar um filme" })
   }

   res.status(201).send();
});


app.listen(port, () => {
   console.log(`Servidor em execução em http://localhost:${port}`);
});