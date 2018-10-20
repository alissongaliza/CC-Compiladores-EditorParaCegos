import { utils } from "./utils.js";
import { Dicionario } from "./dicionario.js";
import { MyStack } from "./myStack.js";
export class Sintatico {

    constructor(list_tokens) {
        console.log("Iniciando Sintatico");

        this.list_tokens = list_tokens;  //lista de tokens
        this.index = 0;      //índice do token atual
        this.current = this.list_tokens()[0];    //token atual
        
        
        this.utils = utils;
        this.dicionario = new Dicionario();


        // Guarda o ultimo erro gerado para exibir ao usuário
        this.lastError = {mensagem : '', local : {word : '', wordPosition: 0}}; 
        this.personNumber = new MyStack();

        
    }

    /**
     * Retornar o próximo token da lista
     */
    next() {
        if (this.index < (this.list_tokens()).length - 1) { // verifica se o próximo índice pertence ao array
            this.index += 1;
            this.current = this.list_tokens()[this.index]; // pega o token atual
            // print (this.current)
            return this.current;
        }

        this.lastError.mensagem = "Erro: O programa terminou, mas a análise não";
        // this.current = {'lex':['default']};
        // console.log('Tokens acabaram. Usando token auxiliar para testar epsilon');
        
        throw ("Erro: O programa terminou, mas a análise não");    // caso chegue ao fim da lista sem terminar o programa
        // return null;
    }

    /**
     * Regride 1 no índice da lista de tokens.
     */
    regride_token() {
        this.index -= 1;
    }



    // Analise

    //  █████╗ ███╗   ██╗ █████╗ ██╗     ██╗███████╗███████╗
    // ██╔══██╗████╗  ██║██╔══██╗██║     ██║██╔════╝██╔════╝
    // ███████║██╔██╗ ██║███████║██║     ██║███████╗█████╗  
    // ██╔══██║██║╚██╗██║██╔══██║██║     ██║╚════██║██╔══╝  
    // ██║  ██║██║ ╚████║██║  ██║███████╗██║███████║███████╗
    // ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚══════╝
    //                                                              
    comecarAnalise() {
        console.log("Iniciando analise");


        if (!this.sentence()) {
            this.utils.printAndSpeek('Invalid Sentence');
            this.utils.printAndSpeek(this.lastError.mensagem);
            return {status: false, mensagem:this.lastError};
        } else {
            this.utils.printAndSpeek("Sentence ok");
            return {status: true, tokens: this.list_tokens};
        }


    }


    // Não terminais
    // ███╗   ██╗ █████╗  ██████╗     ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗███████╗
    // ████╗  ██║██╔══██╗██╔═══██╗    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║██╔════╝
    // ██╔██╗ ██║███████║██║   ██║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║███████╗
    // ██║╚██╗██║██╔══██║██║   ██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║╚════██║
    // ██║ ╚████║██║  ██║╚██████╔╝       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║██║███████║
    // ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚══════╝
    //                                                                                                    



    /**
     * S = NP VP | VP
     */
    sentence() {

        if (!this.current){
            return false;
        }
        
        if(this.nounPhrase())
            this.personNumber.push(this.list_tokens()[this.index - 1]);


        if (!this.verbPhrase()) {
            return false;
        }

        if (['.','!','?'].includes(this.current.word))
            return true;
        else
            return false;
        
    }

    /**
     * VP = verb verbPhrase_2
     * | verb NP verbPhrase_2
     * | verb NP PP verbPhrase_2
     * | verb PP verbPhrase_2
     * | Aux verb
     */
    verbPhrase() {


        if (!this.isAux() && this.isVerb()) {

            this.personNumber.push(this.list_tokens()[this.index - 1])
            var message = this.personNumber.reduz_pessoa();
            if (message != 'ok') {
                this.lastError.mensagem = message;
                return false;
            }
            if (this.nounPhrase()) {
                this.preposition();
                if (!this.verbPhrase_2())
                    return false;

                return true;
            }
            else if (this.preposition()) {
                if (!this.verbPhrase_2())
                    return false;
                return true;
            }
            else if (this.verbPhrase_2()) {
                return true;
            }
            else {
                if (!this.verbPhrase_2())
                    return false;

                return true; //apenas verbo
            }
        }


        else if (this.isAux()) {
            this.next();
            this.personNumber.push(this.list_tokens()[this.index - 1])
            var message = this.personNumber.reduz_pessoa();
            if (message != 'ok') {
                this.lastError.mensagem = message;
                return false;
            }
            if (!this.isVerb())
                return false;
            if (!this.verbPhrase_2())
                return false;

            return true;

        }
        else {
            return false;
        }

    }

    /**
     * Retirando a recursividade a esquerda do método verbPhrase
     * 
     * verbPhrase_2 = PP VP_2 
     * | ε
     */
    verbPhrase_2() {
        if (this.preposition()){
            return this.verbPhrase_2();
        }
        else{
            return true ; // epsilon
        }
    }

    /**
     * NP = pronoum 
     * | proper_noum 
     * | DET NOMINAL
     */
    nounPhrase() {
        if(this.isPronoun())
            return true;
        else if(this.isProperNoun())
            return true;
        else if(this.isDeterminer()){
            if(this.nominal())
                return true;
        }
        return false;
    }

    /**
     * NOMINAL = noun NOMINAL_2 |
     */
    nominal() {
        if (this.isNoun()){
            if (this.nominal_2())
                return true;
        }
        return false;
    }

    /**
     * Tratando a recursividade a esquerda do método nominal()
     * 
     * NOMINAL_2 = noun NOMINAL_2 
     * | PP NOMINAL_2 
     * | ε
     */
    nominal_2() {

        if (this.isNoun()) {
            if (this.nominal_2())
                return true;
            return false;
        }
        else if(this.preposition()){
            if (this.nominal_2())
                return true;
            return false;
        }
        return true; //epsilon
    }

    /**
     * PP = preposition NP
     */
    preposition() {
        if(this.isPreposition()){
            // this.next();
            if(this.nounPhrase())
                return true;
        }
        return false;
    }




    // Terminais
    // ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗███████╗
    // ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║██╔════╝
    //    ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║███████╗
    //    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║╚════██║
    //    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║██║███████║
    //    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚══════╝
    //                                                                     



    isNoun() {


        var retorno = false;
        this.current.lex.map( (x) => {
            if(x.classificacao == this.dicionario.NOUN)
                retorno = true;
            }
        );
        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.NOUN;
            this.next();
            return true;
        }

        
        this.lastError.mensagem = `expected a noum before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false;
    }

    isVerb() {

        var retorno = false;
        this.current.lex.map( (x) => {
            if(x.classificacao == this.dicionario.VERB)
                retorno = true;
            }
        );
        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.VERB;
            this.next();
            return true;
        }

        this.lastError.mensagem = `expected a verb before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false;
    }

    isDeterminer() {

        var retorno = false;
        this.current.lex.map( (x) => {
            if(x.classificacao == this.dicionario.DETERMINER)
                retorno = true;
            }
        );
        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.DETERMINER;            
            this.next();
            return true;
        }

        this.lastError.mensagem = `expected a determiner before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false;
    }


    isPreposition() {

        var retorno = false;
        this.current.lex.map( (x) => {
            if(x.classificacao == this.dicionario.PREPOSITION)
                retorno = true;
            }
        );
        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.PREPOSITION;
            this.next();
            return true;
        }

        this.lastError.mensagem = `expected a preposition before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false;
    }

    /**
     * Tratando substantivos próprios apenas verificando se a palavra começa com letra maiúscula
     */
    isProperNoun() {
        if(this.current.lex[0].classificacao == this.dicionario.PROPER_NOUN){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.PROPER_NOUN;
            this.next();
            return true;
        }
        this.lastError.mensagem = `expected a proper before after '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false
    }

    isPronoun(){

        var retorno = false;
        this.current.lex.map( (x) => {
            if(x.classificacao == this.dicionario.PRONOUN)
                retorno = true;
            }
        );
        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.PRONOUN;
            this.next();
            return true;
        }

        this.lastError.mensagem = `expected a pronoum before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return false;
    }

    /**
     * verificar se é um verbo aux: (look ahead vendo se tem dois verbos seguidos)
     */
    isAux(){
        var retorno = false;

        // ve se PODE ser auxiliar
        this.current.lex.map( (x) => {
            if(x.classificacaoDetalhada == this.dicionario.AUXILIAR ){
                // verifica se o proximo é verbo
                this.list_tokens()[this.index+1].lex.map(y=>{
                    if(y.classificacao == this.dicionario.VERB)
                        retorno = true;
                });
            }
        });

        if(retorno){
            this.list_tokens()[this.index]['usedClassification'] = this.dicionario.AUXILIAR;
            // this.next();
            return true;
        }

        this.lastError.mensagem = `expected an auxiliar before '${this.current.word}' ( word number ${this.index+1} )`;
        this.lastError.local = {word : this.current.word, wordPosition: this.index};
        return retorno;
    }
    
}