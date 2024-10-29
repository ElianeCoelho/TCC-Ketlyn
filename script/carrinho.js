// Atualiza o contador do carrinho
function atualizarContadorCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    document.getElementById('contador-carrinho').textContent = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
}

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    fetch(`http://localhost:4000/api/produtos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar o produto: ${response.status}`);
            }
            return response.json();
        })
        .then(produto => {
            // Verifica se o produto já está no carrinho
            const produtoExistente = carrinho.find(item => item.id === produto.id);
            if (produtoExistente) {
                // Incrementa a quantidade se já estiver no carrinho
                produtoExistente.quantidade++;
            } else {
                // Adiciona com quantidade inicial de 1
                produto.quantidade = 1;
                carrinho.push(produto);
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            atualizarContadorCarrinho();
            atualizarValorTotalCarrinho();

            const contadorElemento = document.getElementById('contador-carrinho');
            contadorElemento.classList.add('bounce');
            setTimeout(() => {
                contadorElemento.classList.remove('bounce');
            }, 500);
        })
        .catch(error => console.error('Erro ao adicionar o produto ao carrinho:', error));
}


// Função para carregar os itens do carrinho e exibi-los
function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let listaCarrinho = document.getElementById('lista-carrinho');
    let totalPreco = 0;

    listaCarrinho.innerHTML = ''; // Limpa a lista do carrinho

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
        document.getElementById('voltar-compras').style.display = 'block';
        atualizarContadorCarrinho();
        atualizarValorTotalCarrinho(); // Atualiza o valor total como zero
        return;
    } else {
        document.getElementById('voltar-compras').style.display = 'none';
    }

    carrinho.forEach((produto, index) => {
        let itemHTML = `
            <div class="produto-item">
                <div class="produto-detalhes">
                    <img class="produto-imagem" src="${produto.imagem}" alt="${produto.nome}">
                    <span class="produto-nome">${produto.nome}</span>
                    <span class="produto-quantidade">${produto.quantidade} kg</span>
                </div>
                <button class="adicionar-produto" onclick="adicionarQuantidade(${index})"> + </button>
                <span class="produto-preco">R$ ${parseFloat(produto.preco * produto.quantidade).toFixed(2)}</span>
                <button class="remover-produto" onclick="removerDoCarrinho(${index})"> - </button>
            </div>
        `;
        listaCarrinho.innerHTML += itemHTML;
        totalPreco += parseFloat(produto.preco * produto.quantidade);
    });

    document.getElementById('total-preco').textContent = totalPreco.toFixed(2);
    atualizarContadorCarrinho();
}

function adicionarQuantidade(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Aumenta a quantidade do produto em 1
    carrinho[index].quantidade += 1;

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualiza o carrinho na interface
    carregarCarrinho();
}


// Função para remover um item do carrinho
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho[index].quantidade > 1) {
        // Reduz a quantidade se for maior que 1
        carrinho[index].quantidade--;
    } else {
        // Remove do carrinho se a quantidade for 1
        carrinho.splice(index, 1);
    }

    if (carrinho.length === 0) {
        localStorage.removeItem('carrinho'); // Limpa o localStorage se estiver vazio
        document.getElementById('lista-carrinho').innerHTML = '<p>Seu carrinho está vazio.</p>';
        document.getElementById('total-preco').textContent = '0.00';
        document.getElementById('voltar-compras').style.display = 'block';
    } else {
        localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
    }

    carregarCarrinho();
    atualizarContadorCarrinho();
    atualizarValorTotalCarrinho();
}

// Função para atualizar o valor total do carrinho
function atualizarValorTotalCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let valorTotal = carrinho.reduce((total, produto) => total + parseFloat(produto.preco), 0);
    document.getElementById('total-preco').textContent = `R$ ${valorTotal.toFixed(2)}`;
}

// Função para voltar à página anterior
// Função para voltar à página principal e limpar o carrinho
function voltarCompras() {
    // Limpa o localStorage para esvaziar o carrinho
    localStorage.removeItem('carrinho');
    
    // Redireciona para a página principal
    window.location.href = 'principal.html'; // Substitua pelo caminho correto da página
}


// Carregar o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    atualizarContadorCarrinho();
    atualizarValorTotalCarrinho(); // Certifica-se de que o valor total é atualizado na carga inicial
});


// Dentro do evento de clique para o botão "Finalizar Compra"
document.getElementById('finalizar-compra').addEventListener('click', function() {
    const total = document.getElementById('total-preco').textContent; // Captura o valor total
    localStorage.setItem('valorTotal', total); // Armazena o valor total no localStorage
    window.location.href = 'pagamento.html'; // Substitua pelo caminho correto da sua página de pagamento
});

