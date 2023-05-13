// Importando as bibliotecas e arquivos
const database = require('./db');
const Fornecedor = require('./models/fornecedor');

// criando o servidor
const express = require('express');
const app = express();
const porta = 9443;
const bodyParser = require('body-parser');

// Setar os valores da view e engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));

// Definindo rotas
app.get('/', (req, res) =>{
 res.send('Olá, seja bem vindo ao cadastro de fornecedores. <br><a href="/cadfornecedor">Clique aqui para cadastrar um fornecedor</a>');
});

app.get('/cadfornecedor', function(req, res) {
res.render('formFornecedor');
});

app.post('/addfornecedor', function(req, res) {
  // Verifica se o nome do fornecedor já está cadastrado
  Fornecedor.findOne({ 
    where: { nome: req.body.nome }
  }).then(function(fornecedor) {
    if (!fornecedor) {
      Fornecedor.create({
      nome: req.body.nome,
      telefone: req.body.telefone,
      email: req.body.email,
    }).then(function() {
        res.send('Fornecedor cadastrado com sucesso! <br><a href="/cadfornecedor">Clique aqui para cadastrar um novo fornecedor</a>');
    });
    } else {
      res.send('Fornecedor já cadastrado! <br><a href="/cadfornecedor">Clique aqui para cadastrar um novo fornecedor</a>');
    }
  });
});

app.listen(porta, () => {
  console.log("Server rodando");
});

(async() => {
  try {
    const resultado = await database.sync();
    console.log(resultado);
    const fornecedores = await Fornecedor.findAll();
    console.log("Lista de Fornecedores \n ", fornecedores)
  } catch (error) {
    console.log(error);
  }
})();