
document.addEventListener("DOMContentLoaded", function() {
     const divUsuario = document.querySelector(".div-usuario");
    const iconeUsuario = document.getElementById("icone-usuario");
    const menuUsuario = document.getElementById("menu-usuario");
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    const inputPesquisa = document.getElementById("barraPesquisaInput");
    const botaoPesquisa = document.getElementById("botaoPesquisa");

    botaoPesquisa.addEventListener("click", function() {
        const termoPesquisa = inputPesquisa.value.toLowerCase();
        carregarProdutos(termoPesquisa);
    });

    // Monitorar alterações no campo de pesquisa para restaurar a lista completa ao limpar
    inputPesquisa.addEventListener("input", function() {
        const termoPesquisa = inputPesquisa.value.toLowerCase();
        if (termoPesquisa === "") {
            carregarProdutos(); // Carrega todos os produtos novamente

        }
    });

    if (usuarioLogado && usuarioLogado.nome) {
        // Cria o menu suspenso com o nome do usuário e botão de logout
        menuUsuario.innerHTML = `
            <ul>
                <li>Bem-vindo, ${usuarioLogado.nome}</li>
                <li><button id="logout">Logout</button></li>
            </ul>
        `;

        // Adiciona o evento de logout
        document.getElementById("logout").addEventListener("click", function() {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "cadastroCliente.html";
        });
    }

    // Exibe ou oculta o menu ao clicar no ícone do usuário
    iconeUsuario.addEventListener("click", function() {
        if (menuUsuario.style.display === "none" || menuUsuario.style.display === "") {
            menuUsuario.style.display = "block";
        } else {
            menuUsuario.style.display = "none";
        }
    });

    // Fecha o menu se o usuário clicar fora dele
    document.addEventListener("click", function(event) {
        if (!divUsuario.contains(event.target)) {
            menuUsuario.style.display = "none";
        }
    });

    
    function carregarProdutos(termoPesquisa = "") {
        fetch('http://localhost:4000/api/produtos') // Substitua pela URL correta do seu backend
            .then(response => response.json())
            .then(produtos => {
                const carouselContainer = document.getElementById('carousel-container');
                
                // Remove o carrossel atual, se estiver inicializado, para evitar conflitos
                if ($(carouselContainer).hasClass('slick-initialized')) {
                    $(carouselContainer).slick('unslick');
                }
    
                // Limpa o container
                carouselContainer.innerHTML = '';
    
                // Filtra os produtos com base no termo de pesquisa
                produtos
                    .filter(produto => produto.nome.toLowerCase().includes(termoPesquisa))
                    .forEach(produto => {
                        const divFlexContainer = document.createElement('div');
                        divFlexContainer.classList.add('div-flex-container');
    
                        const nomeProduto = document.createElement('p');
                        nomeProduto.textContent = produto.nome;
    
                        const img = document.createElement('img');
                        img.classList.add('imagem');
                        img.src = produto.imagem;
                        img.alt = produto.nome;
    
                        const preco = document.createElement('p');
                        preco.textContent = `Preço: R$ ${produto.preco}`;
    
                        const btn = document.createElement('button');
                        btn.classList.add('btn');
                        btn.textContent = 'Comprar';
                        btn.onclick = () => adicionarAoCarrinho(produto.id);
    
                        divFlexContainer.appendChild(nomeProduto);
                        divFlexContainer.appendChild(img);
                        divFlexContainer.appendChild(preco);
                        divFlexContainer.appendChild(btn);
    
                        carouselContainer.appendChild(divFlexContainer);
                    });
    
                // Somente reinicia o carrossel se o termo de pesquisa estiver vazio (mostrando todos os produtos)
                if (termoPesquisa === "") {
                    iniciarCarrossel();
                }
            })
            .catch(error => console.error('Erro ao carregar os produtos:', error));
    }
    


    // Função para iniciar o carrossel
    function iniciarCarrossel() {
        const container = document.getElementById('carousel-container');
        const slickOptions = {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: true,
            arrows: true,
            prevArrow: '<button class="slick-prev" style="background-color: gray; font-size: 24px; border-radius: 50%; margin-left:12px;">&#10094;</button>',
            nextArrow: '<button class="slick-next" style="background-color: gray; font-size: 24px; border-radius: 50%; margin-right:10px;">&#10095;</button>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };

        if (typeof $(container).slick === 'function') {
            $(container).slick(slickOptions);
        } else {
            console.error('Slick Carousel não está disponível');
        }
    }

    // Chama a função para carregar os produtos quando a página carregar
    carregarProdutos();
});

