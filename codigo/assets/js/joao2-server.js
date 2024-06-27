const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

app.get('/voluntario', (req, res) => {
  const dados = JSON.parse(fs.readFileSync('db.json'));
  res.json(dados.voluntario);
});

app.put('/voluntario', (req, res) => {
  const novosDados = req.body;
  const dados = JSON.parse(fs.readFileSync('db.json'));


  for (const campo in novosDados) {
    if (campo !== 'fotoPerfil' || novosDados.fotoPerfil) {
      dados.voluntario[campo] = novosDados[campo];
    }
  }

  if (req.body.fotoPerfil) {
    const base64Data = req.body.fotoPerfil.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const fileExt = req.body.fotoPerfil.split(';')[0].split('/')[1];
    const fileName = `perfil_${Date.now()}.${fileExt}`;
    fs.writeFileSync(path.join('public', 'img', fileName), base64Data, 'base64');
    dados.voluntario.fotoPerfil = `img/${fileName}`;
  }

  fs.writeFileSync('db.json', JSON.stringify(dados, null, 2));
  res.json({ message: 'Dados atualizados com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
