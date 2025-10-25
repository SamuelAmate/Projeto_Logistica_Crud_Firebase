const firebaseConfig = {
  apiKey: "AIzaSyAYi7zQwInXmEAZUOHWpc-RpCyBC4P3Gfc",
  authDomain: "projetologistica-69748.firebaseapp.com",
  databaseURL: "https://projetologistica-69748-default-rtdb.firebaseio.com",
  projectId: "projetologistica-69748",
  storageBucket: "projetologistica-69748.firebasestorage.app",
  messagingSenderId: "845507595483",
  appId: "1:845507595483:web:981421b755c7611c9590fe",
  measurementId: "G-VEQSGTYW63"
};
// Inicializa Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.database().ref('Estoque')
const dbVenda = firebase.database().ref('Venda')

// Editar
$(document).on('click', '.edit-btn', function () {
  const id = $(this).data('id')
  dbVenda.child(id)
    .get()
    .then((snapshot) => {
      const venda = snapshot.val()
      $('#id').val(id)
      $('#nomeProduto').val(venda.nomeProduto)
      $('#txtComprador').val(venda.nomeComprador)
      $('#quantidadeProdutoVenda').val(venda.quantidadeProdutoVenda)
      $('#txtValorVenda').val(venda.valorVenda)
      $('#editarVenda').show()
    })
    .catch(error => {
      console.error('Erro ao carregar venda:', error)
      alert('Erro ao carregar dados da venda')
    })
})

// Excluir
$(document).on('click', '.delete-btn', function () {
  const id = $(this).data('id')
  if (confirm('Tem certeza que deseja excluir?')) {
    dbVenda.child(id).remove()
  }
})

function editarVenda() {
    var conteudo = document.getElementById("editarVenda");
    if (conteudo.style.display === "none") {
      conteudo.style.display = "block";
    } else {
      conteudo.style.display = "none";
    }
  }


function carregarProdutos() {
  db.on('value', (snapshot) => {
    const select = $('#nomeProduto')
    select.empty()
    select.append('<option value="" disabled selected>Selecione um produto</option>')
    snapshot.forEach((child) => {
      const produto = child.val()
      // Mudando para usar o nome do produto como value ao invés do key
      select.append(`
        <option value="${produto.nomeProduto}">${produto.nomeProduto}</option>
      `)
    })
  })
}

// Salvar Estoque (create/update)
$('#formVenda').submit(function (e) {
  e.preventDefault()

  const id = $('#id').val()
  const nomeProduto = $('#nomeProduto').val()
  const nomeComprador = $('#txtComprador').val()
  const valorVenda = $('#txtValorVenda').val()
  const quantidadeProdutoVenda = parseInt($('#quantidadeProdutoVenda').val())

  // Buscar quantidade disponível no estoque
  db.orderByChild('nomeProduto').equalTo(nomeProduto).once('value')
    .then((snapshot) => {
      const produtoEstoque = snapshot.val()
      const keyEstoque = Object.keys(produtoEstoque)[0]
      const quantidadeEstoque = produtoEstoque[keyEstoque].quantidadeProduto

      // Verificar se há quantidade suficiente
      if (quantidadeProdutoVenda > quantidadeEstoque) {
        alert('Quantidade insuficiente em estoque!')
        return
      }

      // Atualizar quantidade no estoque
      const novaQuantidade = quantidadeEstoque - quantidadeProdutoVenda
      db.child(keyEstoque).update({ quantidadeProduto: novaQuantidade })
        .then(() => {
          if (id) {
            dbVenda.child(id).update({ nomeProduto, nomeComprador, quantidadeProdutoVenda, valorVenda })
          } else {
            dbVenda.push({ nomeProduto, nomeComprador, quantidadeProdutoVenda, valorVenda })
          }
        })
      })

  
  this.reset()
  $('#id').val('')
})


function carregarVenda() {
  dbVenda.on('value', (snapshot) => {
    const tbody = $('#tabelaVenda')
    tbody.empty()
    snapshot.forEach((child) => {
      const user = child.val()
      const key = child.key
      tbody.append(`
        <tr>
          <td>${user.nomeProduto}</td>
          <td>${user.nomeComprador}</td>
          <td>${user.quantidadeProdutoVenda}</td>
          <td>${user.valorVenda}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${key}">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${key}">Excluir</button>
          </td>
        </tr>
      `)
    })
  })
}


// Inicializar
carregarProdutos();
carregarVenda();

