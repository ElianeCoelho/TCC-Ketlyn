document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showLoginBtn = document.getElementById("show-login");
    const showRegisterBtn = document.getElementById("show-register");

    // Esconde ambos os formulários no início
    loginForm.style.display = "none";
    registerForm.style.display = "none";

    // Função para mostrar o formulário de login
    showLoginBtn.addEventListener("click", () => {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });

    // Função para mostrar o formulário de cadastro
    showRegisterBtn.addEventListener("click", () => {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
    });

    // Lógica de login
    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault();
        
        const cpf = document.querySelector("#login-form input[name='cpf']").value;
        const senha = document.querySelector("#login-form input[name='senha']").value;

        // Envia o CPF e a senha para o servidor e espera a resposta com os dados do usuário
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, senha })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Salva os dados do usuário no localStorage
                localStorage.setItem("usuarioLogado", JSON.stringify({ 
                    nome: data.nome, 
                    cpf: data.cpf, 
                    telefone: data.telefone 
                }));
                window.location.href = "principal.html";
            } else {
                alert("CPF ou senha incorretos.");
            }
        })
        .catch(error => console.error("Erro ao fazer login:", error));
    });
});

// Autopreencher endereço com o CEP
document.getElementById('cep').addEventListener('blur', function() {
    let cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    if (cep.length === 8) {
        let url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    // Preenche os campos de endereço
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    alert('CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o CEP:', error);
                alert('Erro ao buscar o CEP.');
            });
    } else {
        alert('CEP inválido. Por favor, insira um CEP com 8 dígitos.');
    }
});
