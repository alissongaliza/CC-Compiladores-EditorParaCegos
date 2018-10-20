import { Lexico } from "./scripts/lexico.js";
import { Sintatico } from "./scripts/sintatico.js";
import { utils } from "./scripts/utils.js";

console.log("index.js");

// welcome sppech
// utils.printAndSpeek2("welcome, whenever I say, you can repeat me by pressing 'esc' or continue by pressing 'enter'");


ko.applyBindings(viewModel);

function runLexico() {
    console.log("iniciando teste");
    var lexico = new Lexico();

    // pegar o texto completo
    var myInputArea = document.getElementById('inputArea');
    var txtCompleto = String(myInputArea.value);
    var frases = txtCompleto.split(/[.!?]/);

    

    // separar em frases e analisar indivudalmente
    // for (const frase of frases) {
    for (var cont = 0; cont<frases.length;cont++){
        var frase = frases[cont];
    

        // não precisa analisar tokens vazios
        if (frase == '') {
            continue;
        }

        // recolocar o '.' no final da frase para a gramática aceitar

        var lexicoAnalise = lexico.analyze(frase + '.');

        viewModel.lexicoTokens(lexicoAnalise.status == true ? lexicoAnalise.result : []);

        var sintatico = new Sintatico(viewModel.lexicoTokens);

        var sintaticoAnalise = sintatico.comecarAnalise();
        viewModel.lexicoTokens(sintaticoAnalise.tokens());


        // se alguma frase der errado, para a execução
        // selecionar a parte do texto que esta errada
        if (!lexicoAnalise.status || !sintaticoAnalise.status) {

            // analise lexica deu certo entao a sintatica deu errado
            if (lexicoAnalise.status) {
                // pegar o incio da frase
                let inicioFrase = encontrarInicioDaFrase(frases, cont); // apenas para testar

                // selecionar a frase toda
                setSelectionRange(myInputArea, inicioFrase, inicioFrase + frase.length);

            // lexica deu errado
            } else {
                // pegar a posicao inicial do token
                let posicaoInicial = encontrarIncioDoToken(lexicoAnalise.word, frases, cont); // apenas para testar

                // selecionar palavra errada
                setSelectionRange(myInputArea, posicaoInicial, posicaoInicial + lexicoAnalise.word.length);
            }


            // parar a execução do for
            break;
        }

        console.log(viewModel.lexicoTokens);
    }
    try {
       
        

    } catch(e){
        console.log('e', e);
    }
   
}



document.getElementById("buttonReproduce").onclick = runLexico;

/**
 * Seleciona uma substring do texto de um div
 * @param {Element} input 
 * @param {number} selectionStart 
 * @param {number} selectionEnd 
 */
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

/**
 * Função para testar setSelectionRange
 * @deprecated
 */
function select() {
    setSelectionRange(document.getElementById('inputArea'), 0, 3);
}

// document.getElementById("buttonReproduce").onclick = select;

/**
 * Para selecionar uma substring no div de entrada, é preciso conhecer onde a
 * frase começa.
 * @param {Array} frases conjunto de frases em array
 * @param {Number} numeroFrase a frase específica
 * @return {Number} caractere no qual a frase começa
 */
function encontrarInicioDaFrase(frases, numeroFrase) {
    var posicaoInicial = 0;
    for (var cont = 0; cont < frases.length && cont < numeroFrase; cont++) {
        var frase = frases[cont];
    
        //+1 por causa do '.'
        posicaoInicial+= frase.length+1;
    }

    return posicaoInicial;
}

function encontrarIncioDoToken(token, frases, numeroFrase){
    var posicaoInicial = 0;
    // frases anteriores
    for (var cont = 0; cont < frases.length && cont < numeroFrase; cont++) {
        var frase = frases[cont];

        //+1 por causa do '.'
        posicaoInicial+= frase.length+1;
    }

    // na frase onde aconteceu o problema
    posicaoInicial += frases[numeroFrase].indexOf(token);

    return posicaoInicial;
}