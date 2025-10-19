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

// Carregar Estoque
function carregarEstoque() {
  db.on('value', (snapshot) => {
    const tbody = $('#tabelaEstoque')
    tbody.empty()
    snapshot.forEach((child) => {
      const user = child.val()
      const key = child.key
      tbody.append(`
        <tr>
          <td>${user.nomeProduto}</td>
          <td>${user.nomeDistribuidora}</td>
          <td>${user.quantidadeProduto}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${key}">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${key}">Excluir</button>
          </td>
        </tr>
      `)
    })
  })
};

// Salvar Estoque (create/update)
$('#formEstoque').submit(function (e) {
  e.preventDefault()

  const id = $('#id').val()
  const nomeProduto = $('#txtProduto').val()
  const nomeDistribuidora = $('#txtDistribuidora').val()
  const quantidadeProduto = $('#txtQuantidade').val()

  if (id) {
    db.child(id).update({ nomeProduto, nomeDistribuidora, quantidadeProduto })
  } else {
    db.push({ nomeProduto, nomeDistribuidora, quantidadeProduto })
  }

  this.reset()
  $('#id').val('')
});

// Editar
$(document).on('click', '.edit-btn', function () {
  const id = $(this).data('id')
  db.child(id)
    .get()
    .then((snapshot) => {
      const user = snapshot.val()
      $('#id').val(id)
      $('#txtProduto').val(user.nomeProduto)
      $('#txtDistribuidora').val(user.nomeDistribuidora)
      $('#txtQuantidade').val(user.quantidadeProduto)
    })
});

// Excluir
$(document).on('click', '.delete-btn', function () {
  const id = $(this).data('id')
  if (confirm('Tem certeza que deseja excluir?')) {
    db.child(id).remove()
  }
});

function editarEstoque() {
    var conteudo = document.getElementById("editarEstoque");
    if (conteudo.style.display === "none") {
      conteudo.style.display = "block";
    } else {
      conteudo.style.display = "none";
    }
  };

// Inicializar
carregarEstoque();
