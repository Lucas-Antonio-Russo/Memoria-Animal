const tempo = 1200; //tempo para vira a carta
const txt_qtdVidas = document.getElementById('qtd_vidas');
const txt_qtdPontos = document.getElementById('qtd_pontos');
const status_bar = document.getElementById('status');
const tela_jogo = document.getElementById('container');
const menu_jogo = document.getElementById('menu-game')
const select_num_qtd = document.getElementById('select_num_qtd');
const select_num_nivel = document.getElementById('select_num_nivel');
class Carta {
    gerarCartas(numero_cartas){
        const cartas = []; //array que irá armazenar as cartas do jogo
        let posicao_baralho = [] //array que irá armazenar as posições da carta na mesa
        for (let i = 1; i <= (numero_cartas/2) ;i++){
            const identificador = crypto.randomUUID(); //gera um número único para identificar a carta no jogo
            let posicao_carta_1; //variavel responsável por armazenar o número aleatório referente a posição da carta no baralho e de seu icone
            let posicao_carta_2; //variavel responsável por armazenar o número aleatório referente a posição do seu par da carta no baralho
            do {
                posicao_carta_1 = Math.round(Math.random() * (numero_cartas - 1)) + 1; //gera um número inicial e verifica se o mesmo já existe no array
            } while (posicao_baralho.includes(posicao_carta_1));
            posicao_baralho.push(posicao_carta_1); //caso não exista, o número é incluido no array e a carta possui uma posição única na mesa
            cartas.push({identificador: identificador, posicao: posicao_carta_1, icone: posicao_carta_1+".jpeg"});// reutilizei a mesma variável da posição para gerar o ícone 
            do {
                posicao_carta_2 = Math.round(Math.random() * (numero_cartas - 1)) + 1; //gera um número inicial e verifica se o mesmo já existe no array
            }
            while (posicao_baralho.includes(posicao_carta_2));
            posicao_baralho.push(posicao_carta_2); //caso não exista, o número é incluido no array e a carta possui uma posição única na mesa
            cartas.push({identificador: identificador, posicao: posicao_carta_2, icone: posicao_carta_1+".jpeg"});// reutilizei a mesma variável da posição para gerar o ícone 
        }
        return cartas;
    }
}
function ajustarGrid(){
    let larguraTela = window.innerWidth; 
    let condicao = select_num_qtd.value === '4' && larguraTela <= 600; 
    switch (true){
        case condicao:
            tela_jogo.classList.add('container_4cartas');
        break;

    }
}


let quantidade_vidas = 0;
function iniciarJogo(){
    menu_jogo.style.display = 'none';
    status_bar.style.display = 'flex';
    tela_jogo.style.display = 'grid';
    numero_cartas = select_num_qtd.value;
    const btn_inicio_jogo = document.getElementById('jogar');
    btn_inicio_jogo.remove();
    const clickSound = new Audio('sounds/click.mp3'); // Carrega o som
    clickSound.play();
    const jogo = new Carta(); //instancio a classe carta
    const baralho = jogo.gerarCartas(numero_cartas); //gero um baralho
    baralho.sort((a, b) => a.posicao - b.posicao); //coloco as cartas do baralho em ordem descrescente
    for (let i = 0; baralho.length > i; i++){ //crio cada carta e adiciono suas classes e propriedades, além de anexá-las a mesa
        const div_carta = document.createElement('div');
        const div_carta_inner = document.createElement('div');
        const div_card_front = document.createElement('div');
        const div_card_back = document.createElement('div');
        const img_front = document.createElement('img');
        const img_back = document.createElement('img');
        const mesa = document.getElementById('container'); 

        div_carta.className = 'card';
        div_carta_inner.className = 'card-inner';
        div_card_front.className = 'card-front';
        div_card_back.className = 'card-back';

        div_carta.addEventListener('click', function() {
            if (!div_carta.classList.contains('par-feito')) {
                verificaPar(div_carta);
            }
        });
        
        div_carta.setAttribute('estado','virada');
        div_carta.setAttribute('id',baralho[i].identificador)

        div_carta_inner.appendChild(div_card_front);
        img_back.src = 'img/background/'+baralho[i].icone;
        img_back.className = 'img_';
        img_front.src = 'img/background/background.jpeg';
        img_front.className = 'img_';
        div_card_front.appendChild(img_front);
        div_carta_inner.appendChild(div_card_back);
        div_card_back.appendChild(img_back);
        div_carta.appendChild(div_carta_inner);
        mesa.appendChild(div_carta);

        ajustarGrid();


    }
    let quantidade_cartas = document.getElementById('container').childElementCount;
    nivel_game = select_num_nivel.value;
    switch (nivel_game){
        case "facil":
            quantidade_vidas = quantidade_cartas/1;
        break;
        case "medio":
            quantidade_vidas = quantidade_cartas/2;
        break;
        case "dificil":
            quantidade_vidas = quantidade_cartas/4;
        break;
    }
    txt_qtdVidas.textContent = quantidade_vidas;
    txt_qtdPontos.textContent = quantidade_pontos;
    startTimer()
}

let primeira_carta = null;
let segunda_carta = null;
let em_analise = false;
let quantidade_pares = 0;
let quantidade_pontos = 0;
function verificaPar(carta){
    const corpo_pagina = document.getElementsByTagName('body')[0];
    const div_bloqueio = document.createElement('div');
    const msg_txt = document.createElement('p');
    const pt_txt = document.createElement('p');
    const btn_rst = document.createElement('button');
    msg_txt.id = 'msg_game';
    pt_txt.id = 'pt_game';
    btn_rst.id = 'btn_rst';
    btn_rst.textContent = 'Resetar';
    btn_rst.addEventListener("click", function() {location.reload();});
    let quantidade_cartas = document.getElementById('container').childElementCount;
    const flipSound = new Audio('sounds/flip_card.mp3'); // Carrega o som
    flipSound.play();
    
    if (em_analise || carta.classList.contains('flipped')) {
        return; 
    }

    if (!primeira_carta) {
        primeira_carta = carta;
        primeira_carta.classList.add('flipped');
        return;
    }

    if (primeira_carta === carta) {
        return; 
    }

    segunda_carta = carta;
    segunda_carta.classList.add('flipped');

    let primeira_carta_inner = primeira_carta.children[0];
    let primeira_carta_frente = primeira_carta_inner.children[0];
    let primeira_carta_atras = primeira_carta_inner.children[1];

    let segunda_carta_inner = segunda_carta.children[0];
    let segunda_carta_frente = segunda_carta_inner.children[0];
    let segunda_carta_atras = segunda_carta_inner.children[1];

    let id_primeira_carta = primeira_carta.getAttribute('id');
    let id_segunda_carta = segunda_carta.getAttribute('id');    

    em_analise = true;

    
    if(id_primeira_carta == id_segunda_carta){
        setTimeout(() => {
            const correctSound = new Audio('sounds/correct.mp3'); // Carrega o som
            correctSound.play();
        },500);
        quantidade_pares++;
        quantidade_pontos += 100;
        txt_qtdPontos.textContent = quantidade_pontos;

        primeira_carta_frente.classList.add('par-feito');
        primeira_carta_atras.classList.add('par-feito');
        segunda_carta_frente.classList.add('par-feito');
        segunda_carta_atras.classList.add('par-feito');
        primeira_carta.classList.add('par-feito');
        segunda_carta.classList.add('par-feito');
        primeira_carta = null;
        segunda_carta = null;
        em_analise = false;
    }else{  
        quantidade_pontos -= 25;
        txt_qtdPontos.textContent = quantidade_pontos;
        quantidade_vidas -= 1;
        txt_qtdVidas.textContent = quantidade_vidas;
        setTimeout(() => {
            const damageSound = new Audio('sounds/damage.mp3'); // Carrega o som
            damageSound.play();
        },600);
        setTimeout(() => {
            let flipSound = new Audio('sounds/flip_card2.mp3'); // Carrega o som
            flipSound.play();
            primeira_carta.classList.remove('flipped');
            segunda_carta.classList.remove('flipped');
            primeira_carta = null;
            segunda_carta = null;
            em_analise = false;
        },tempo);
    }
    
    if (quantidade_vidas < 0){
        txt_qtdVidas.textContent = '0';
        setTimeout(() => {
            div_bloqueio.id = 'bloqueio';
            corpo_pagina.appendChild(div_bloqueio);
            const failSound = new Audio('sounds/fail.mp3');
            failSound.play();
            msg_txt.textContent = 'O jogo terminou! ';
            pt_txt.textContent = 'Você fez ' +quantidade_pontos+ ' pontos em '+timerDisplay.textContent+ ' min!';
            div_bloqueio.appendChild(msg_txt);
            div_bloqueio.appendChild(pt_txt);
            div_bloqueio.appendChild(btn_rst);
            stopTimer();
        },1000);
      
        
    }else{ 
        if (quantidade_pares == (quantidade_cartas/2)){
            setTimeout(() => {
                div_bloqueio.id = 'bloqueio';
                corpo_pagina.appendChild(div_bloqueio);
                const sucesso = new Audio('sounds/sucess.mp3'); // Carrega o som
                sucesso.play();
            },1000);
            msg_txt.textContent = 'O jogo terminou!';
            pt_txt.textContent = 'Você fez ' +quantidade_pontos+' pontos em '+timerDisplay.textContent+ ' min!';
            div_bloqueio.appendChild(msg_txt);
            div_bloqueio.appendChild(pt_txt);
            div_bloqueio.appendChild(btn_rst);
            stopTimer();
        }
    }
}

let timer;
let isRunning = false;
let seconds = 0;
let minutes = 0;
const timerDisplay = document.getElementById('timer');

// Função para atualizar o display
function updateDisplay() {
  timerDisplay.textContent = 
    (minutes < 10 ? '0' : '') + minutes + ':' + 
    (seconds < 10 ? '0' : '') + seconds;
}

// Função para iniciar o cronômetro
function startTimer() {
  timer = setInterval(function () {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    updateDisplay();
  }, 1000);
  isRunning = true;
}

// Função para parar o cronômetro
function stopTimer() {
    clearInterval(timer); // Para o setInterval
    isRunning = false;
}

