document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/voluntario')
      .then(response => response.json())
      .then(dados => {
        document.getElementById('profile-image').src = dados.fotoPerfil;
        document.getElementById('primeiro-nome').value = dados.primeiroNome;
        document.getElementById('sobrenome').value = dados.sobrenome;
        document.getElementById('email').value = dados.email;
        document.getElementById('nacionalidade').value = dados.nacionalidade;
        document.getElementById('data-nascimento').value = dados.dataNascimento;
        document.getElementById('celular').value = dados.celular;
      });
  
    const form = document.getElementById('profile-form');
    const uploadImage = document.getElementById('upload-image');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const dados = {
        primeiroNome: document.getElementById('primeiro-nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        nacionalidade: document.getElementById('nacionalidade').value,
        dataNascimento: document.getElementById('data-nascimento').value,
        celular: document.getElementById('celular').value
      };
  
      if (uploadImage.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          dados.fotoPerfil = e.target.result;
          enviarDados(dados);
        };
        reader.readAsDataURL(uploadImage.files[0]);
      } else {
        enviarDados(dados);
      }
    });
  
    function enviarDados(dados) {
      fetch('http://localhost:3001/voluntario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        document.getElementById('profile-image').src = dados.fotoPerfil;
      });
    }
  });
  