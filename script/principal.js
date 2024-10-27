
document.addEventListener("DOMContentLoaded", function() {
   
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

