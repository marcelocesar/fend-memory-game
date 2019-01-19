document.addEventListener("DOMContentLoaded", inicializarJogoDaMemoria, true);

let intervaloTempoJogo;
let cartas = [];
let qtdCartasIniciado = [];
let qtdCartasEncontradas = [];
let vericaCartasTimeOut;
let totalMovimentos = 0;
let totalAcertos = 0;
let avaliacaoTotal = 0;
let contadorMovimentos = document.querySelector('.moves');
let jogoFinalizado = document.querySelector('.modal');
let btnReiniciarJogo = document.querySelector('.restart');
let btnNovoJogo = document.querySelector('.novojogo');
let cartasEvents = document.querySelectorAll('li');
let segundos = 0;
let minutos = 0;
let tempoJogo = `00:00`;
let cartasSelecionadas = 0;
btnReiniciarJogo.onclick = reiniciarJogo;
btnNovoJogo.onclick = reiniciarJogo;

function tempo() {
    segundos++;
    if (segundos === 60){
        minutos++;
        if(minutos < 10) {
            minutos = `0${minutos}`;
        }
        segundos = 00;
    }
    if(segundos < 10) {
        segundos = `0${segundos}`;
    }
    if(minutos === 0) {
        minutos = `00`;
    }
    tempoJogo = `${minutos}:${segundos}`;
    document.querySelector('.timer').textContent = tempoJogo;
}

function inicializarJogoDaMemoria() {

    const templateCards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
    let pair1 = shuffle(templateCards);
    let pair2 = shuffle(templateCards);
    const cards = pair1.concat(pair2);
    const deck = document.querySelector('.deck');
    let cartaEvent;
    
    qtdCartasIniciado = cards.length;
    intervaloTempoJogo = window.setInterval(tempo, 1000);
    contadorMovimentos.innerHTML = totalMovimentos;

    for (const [index, card] of cards.entries()) {
        const li = document.createElement('li');
        li.classList.add('card');
        li.setAttribute('id', `carta_${card}_${index}`);
        li.setAttribute('data-carta', `${card}`);
        const icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add(`fa-${card}`);
        li.appendChild(icon);
        deck.appendChild(li);
        cartaEvent = document.querySelector(`#carta_${card}_${index}`);
        cartaEvent.addEventListener('click', virarCarta, false);
    }  
}

function virarCarta(event) {

    const cartaSelecionada = event.target;
    if(cartasSelecionadas === 2){
        for(li of cartasEvents) {
            li.removeEventListener('click', null);
        }
        return;
    }
    cartaSelecionada.removeEventListener('click', virarCarta, false);
    if (cartaSelecionada.nodeName === 'LI' && cartaSelecionada.hasAttribute('data-carta') && !cartaSelecionada.classList.contains('match')) {
        if (cartas.length <= 2) {
            cartaSelecionada.classList.toggle('open');
            cartaSelecionada.classList.toggle('show');
            cartas.push(cartaSelecionada);
            cartasSelecionadas++;
            if (cartas.length === 2) {
                contadorMovimento(event);
                vericaCartasTimeOut = window.setTimeout(()=> {
                    verificaCartasIguais(cartas);
                    cartasSelecionadas = 0;
                }, 500);
                
            } 
        }
    }
}

function verificaCartasIguais(cartas) {
    
    let carta1 = cartas[0];
    let carta2 = cartas[1];
    const iguais =  carta1.dataset.carta === carta2.dataset.carta;
    if (iguais) {
        cartasCertas(carta1, carta2);
        window.clearTimeout(vericaCartasTimeOut);
        jogoGanho(carta1, carta2);
        totalAcertos++;
    } else {
        cartasErradas(carta1, carta2);
        for(li of cartasEvents) {
            li.addEventListener('click', virarCarta, false);
        }
        window.clearTimeout(vericaCartasTimeOut);
    }
}

function cartasCertas(carta1, carta2) {
    
    carta1.classList.add('match');
    carta2.classList.add('match');
    cartas = [];
}

function cartasErradas(carta1, carta2) {
    
    carta1.classList.remove('show');
    carta1.classList.remove('open');
    carta1.addEventListener('click', virarCarta);
    carta2.classList.remove('show');
    carta2.classList.remove('open');
    carta2.addEventListener('click', virarCarta);
    cartas = [];
}

function jogoGanho(carta1, carta2) {
    
    carta1.classList.remove('show');
    carta1.classList.remove('open');
    carta1.addEventListener('click', virarCarta);
    carta2.classList.remove('show');
    carta2.classList.remove('open');
    carta2.addEventListener('click', virarCarta);
    qtdCartasEncontradas.push(carta1);
    qtdCartasEncontradas.push(carta2);
    cartas = [];
    if (qtdCartasEncontradas.length === qtdCartasIniciado) {
        jogoFinalizado.classList.remove('hide');
        window.clearInterval(intervaloTempoJogo);
        document.querySelector('#resultado').innerHTML = `<span>${totalMovimentos} movimentos</span><br><span>${avaliacaoTotal} estrelas</span><br>Tempo: ${tempoJogo}`;
    }
}

function contadorMovimento(event) {
    
    if (event.type === 'click') {
        totalMovimentos += 1;
        contadorMovimentos.innerHTML = totalMovimentos;
        avaliacao(totalMovimentos);
    }
}

function avaliacao(totalMovimentos) {

    let avaliacao = document.querySelector('.stars');
    let zeroEstrela  = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>`;
    let umaEstrela  = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>`;
    let duasEstrela = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li>`;
    let tresEstrela = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;

    if (totalMovimentos <= 10) {
        avaliacao.innerHTML = zeroEstrela;
        avaliacao.innerHTML = tresEstrela;
        avaliacaoTotal = 3;
    } else if (totalMovimentos > 10 && totalMovimentos <= 16) {
        avaliacao.innerHTML = zeroEstrela;
        avaliacao.innerHTML = duasEstrela;
        avaliacaoTotal = 2;
    } else if (totalMovimentos > 16 && totalMovimentos < 24) {
        avaliacao.innerHTML = zeroEstrela;
        avaliacao.innerHTML = umaEstrela;
        avaliacaoTotal = 1;
    } else {
        avaliacao.innerHTML = zeroEstrela;
        avaliacao.innerHTML = zeroEstrela;
        avaliacaoTotal = 0;
    }
}

function reiniciarJogo() {
    
    window.clearInterval(intervaloTempoJogo);
    cartas = [];
    vericaCartasTimeOut = undefined;
    totalMovimentos = 0;
    avaliacaoTotal = 0;
    document.querySelector('.deck').innerHTML = '';
    jogoFinalizado.classList.add('hide');
    document.querySelector('.stars').innerHTML = `<li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>`;
    segundos = 0;
    minutos = 0;
    tempoJogo = `00:00`; 
    inicializarJogoDaMemoria();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
