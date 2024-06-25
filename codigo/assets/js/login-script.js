document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.formLogin');
  const registroForm = document.querySelector('.formRegistro'); 

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const senha = loginForm.querySelector('input[type="password"]').value;

      try {
        const response = await fetch(`http://localhost:3000/usuarios?email=${email}`);
        const usuarios = await response.json();

        if (usuarios.length > 0 && usuarios[0].senha === senha) {
          sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarios[0]));
          atualizarMenu();
          window.location.href = '../index.html'; 
        } else {
          alert('Credenciais inválidas');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
      }
    });
  }

  if (registroForm) {
    registroForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const novoUsuario = {
        email: registroForm.querySelector('input[type="email"]').value,
        senha: registroForm.querySelector('input[type="password"]').value,
        nome: registroForm.querySelector('input[type="text"]').value, 
        cpf: registroForm.querySelector('input[type="text"]').value,
        telefone: registroForm.querySelector('input[type="text"]').value, 
      };

      try {
        const response = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
          alert('Registro bem-sucedido!');
          window.location.href = '../pages/login.html'; 
        } else {
          alert('Erro ao registrar. Verifique os dados e tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('Ocorreu um erro ao registrar. Tente novamente mais tarde.');
      }
    });
  }

  function atualizarMenu() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const m4 = document.getElementById('m4');
    const m5 = document.getElementById('m5');

    if (usuarioLogado) {
      m4.textContent = 'Sair';
      m4.href = '#'; 
      m5.style.display = 'none';
    } else {
      m4.textContent = 'Entrar';
      m4.href = 'pages/login.html';
      m5.style.display = 'block'; 
    }
  }

  atualizarMenu(); 
});
