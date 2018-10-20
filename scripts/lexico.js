import { Dicionario } from "./dicionario.js";
import { Token } from "./token.js";
import { utils } from "./utils.js";


export class Lexico {
    constructor() {
        console.log("inicializando Lexico");
        this.dicionario = new Dicionario();
        this.utils = utils;
    }

    /**
     * Verifica se o caractere é um numero
     * @param {String} str 
     */
    isNumber(str) {
        return /^[0-9]+$/.test(str);
    }

    /**
    * Verifica se o caractere é uma letra
    * @param {String} str 
    */
    isChar(str) {
        return /^[a-zA-Z]+$/.test(str);
    }


    /**
     *  faz uma busca no dicionário para descobrir a classificação do token
     * @param {String} str token
     */
    classify(str) {
        var classifications = [];
        var result = this.dicionario.queryWord(str);
        if(result == null){
            console.log("Word not found");
            this.utils.printAndSpeek(`The word ${str} was not found`);
            // throw(`The word ${str} was not found`);
            return false;
        }
        // se a palavra retornada for igual a palavra buscada
        if (result.word == str) {
            Object.keys(result.meaning).map(
                x => {
                    // se a palavra retornada for verbo, o tempo default é 'present'
                    if (x == this.dicionario.VERB)
                        classifications.push({ "classificacao": x, "tempoVerbal": "present", "isPlural":false });

                    // se a palvra retornada for substantivo, por fdefault, ela está em 'singular'
                    else if (x == this.dicionario.NOUN)
                        classifications.push({ "classificacao": x, "isPlural": false });
                    
                    else if (x == this.dicionario.PRONOUN)
                        classifications.push({ "classificacao": x, "personNumber": result.meaning[x] });
                    
                    else if(x == this.dicionario.AUXILIAR){

                        classifications.push({ "classificacao": this.dicionario.VERB, "classificacaoDetalhada": this.dicionario.AUXILIAR, "personTenseNumber":result.meaning[x] });
                    }

                    // quando a palavra sofre uma alteração (mudança de tempo, ou plural) e a classificação vem como
                    // string vazia por causa disso
                    else if (x == "") {
                        var definition = result.meaning[x][0].definition;
                        if (definition.includes(this.dicionario.PAST)) {
                            classifications.push({ "classificacao": this.dicionario.VERB, "tempoVerbal": this.dicionario.PAST });
                        }
                        else if (definition.includes(this.dicionario.PRESENT)) {
                            classifications.push({ "classificacao": this.dicionario.VERB, "tempoVerbal": this.dicionario.PRESENT });
                        }
                    }

                    // por default, só precisamos de classificação
                    else {
                        classifications.push({ "classificacao": x });
                    }
                }
            );
        }
        // se a palavra buscada for diferente, que dizer que o nome sofreu alguma alteração (palavras irregulares),
        // por exemplo, se um substantivo tiver no plural, ou um verbo estiver no passado
        else {
            Object.keys(result.meaning).map(
                x => {
                    var definition = result.meaning[x][0].definition;
                    // palavras no irregular e regular, respectivamente
                    if (definition.includes("plural form of") || str.endsWith("s")) {
                        // apenas substantivos têm plural
                        classifications.push({ "classificacao": this.dicionario.NOUN, "isPlural": true });
                    }

                    else if (definition.includes(this.dicionario.PAST)) {
                        // apenas verbo podem estar no passado
                        classifications.push({ "classificacao": this.dicionario.VERB, "tempoVerbal": this.dicionario.PAST });
                    }

                    // default
                    else{
                        // TODO: a palavra é diferente, mas nao estamos cobrindo o caso específico: devemos guardar pelo menos a classificação da palavra original
                        // ex: 'rainning' retorna 'rain' (verbo)
                        classifications.push({ "classificacao": x });
                        
                    }
                }
            )
        }

        return classifications;
    }

    /**
     * Método principal que analiza e classifica toda a string
     * @param {String} program 
     */
    analyze(program) {
        var line_count = 1;
        var token = "";
        var tam = program.length;
        var i = 0;
        var lex = [];
        var result = [];

        // verifica caractere a caractere
        while (i <= tam - 1) {

            // incrementa a linha
            if (program[i] == '\n') {
                line_count += 1;
                // ignorar
                i += 1;
                token = '';
                continue;
            }

            // verifica se é um numero
            else if (this.isNumber(program[i])) {
                // ignorar
                i += 1;
                token = '';
                continue;
            }

            // Verifica se é letra
            else if (this.isChar(program[i])) {
                token += program[i];
                i += 1;
                while (i < tam) {    //Procura por mais letras (formar um token)
                    if (this.isChar(program[i])) {
                        token += program[i];
                        i += 1;
                    }

                    else
                        break;
                }
                //nome proprio
                if(token[0] != '.' && token != 'I' && token[0] === token[0].toUpperCase() )
                    lex.push({ "classificacao": this.dicionario.PROPER_NOUN, "personNumber": [{person:'third', number:'singular'}] });
                
                else
                    lex = this.classify(token);
                
                if (lex == false )return {status:false, word: token};


                // colocar na resposta
                result.push(new Token(token, lex, line_count));

                // recomeçar
                token = '';
            }

            // nova palavra; separar o token
            else if ([' ', ','].includes(program[i])) {
                // ignorar
                i += 1;
                token = '';
                continue;
            }

            // delimitadores
            else if(['.', '?', '!'].includes(program[i])){
                token = '';
                // TODO: 'delimitador' deve ser parametrizado
                result.push(new Token(program[i], [{'classificacao': 'delimitador'}], line_count));

                i += 1;
                continue;

            }
        }

        return{ status: true, result: result};
    }
}