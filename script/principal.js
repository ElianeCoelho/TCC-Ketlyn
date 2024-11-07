
document.addEventListener("DOMContentLoaded", function() {
     const divUsuario = document.querySelector(".div-usuario");
    const iconeUsuario = document.getElementById("icone-usuario");
    const menuUsuario = document.getElementById("menu-usuario");
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));



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

    
    // Função para carregar os produtos do backend
    function carregarProdutos() {
        fetch('http://localhost:4000/api/produtos') // Substitua pela URL correta do seu backend
            .then(response => response.json())
            .then(produtos => {
                const carouselContainer = document.getElementById('carousel-container');
                
                // Limpa o container antes de adicionar novos produtos
                carouselContainer.innerHTML = '';

                // Itera sobre os produtos e constrói os elementos HTML para cada produto
                produtos.forEach(produto => {
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

                    // Adiciona os elementos na div-flex-container
                    divFlexContainer.appendChild(nomeProduto);
                    divFlexContainer.appendChild(img);
                    divFlexContainer.appendChild(preco);
                    divFlexContainer.appendChild(btn);

                    // Adiciona a div-flex-container no container principal
                    carouselContainer.appendChild(divFlexContainer);
                });

                // Iniciar o carrossel após os produtos serem carregados
                iniciarCarrossel();
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

