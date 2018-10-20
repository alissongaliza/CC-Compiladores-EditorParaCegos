// TODO: fazer dicionario statico. (apenas para otimização)
export class Dicionario {
    constructor() {
        console.log("Iniciando Dicionario");

        this.csv = null; // usado quando a busca por uma palavra é feita por um arquivo
        
        // Constantes que podem facilitar a manutenção
        this.NOUN = 'noun';
        this.VERB = 'verb';
        this.PAST = "past";
        this.PRESENT = "present";
        this.DETERMINER = "determiner";
        this.PREPOSITION = "preposition";
        this.AUXILIAR = "auxiliar verb"
        this.PRONOUN = 'pronoun';
        this.PROPER_NOUN = 'proper noun'
        // this.ADVERB = 'TODO';
        
    }

    /**
     * consulta uma palavra na API
     * @param {String} palavra token
     */
    queryWord_(palavra) {
        console.log(`Iniciando teste de api para a palavra '${palavra}'`);
        var retorno = null;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: 60000, // sets timeout to 60 seconds
            url: `https://googledictionaryapi.eu-gb.mybluemix.net/?define=${palavra}&lang=en`,
            success: function (dataS) {
                // console.log(dataS);
                retorno = dataS;

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                // alert("TIME OUT - there is a network issue. Please try again later");
            },
            async: false,
        });

        console.log("retorno", retorno);
        return retorno;

    }

    /**
     * Algumas palavra em memória
     * @param {*} palavra 
     */
    queryWord(palavra) {
        switch (palavra) {
            case 'the':
                return {
                    "word": "the",
                    "phonetic": [
                        "ðə",
                        "ðɪ",
                        "ðiː"
                    ],
                    "meaning": {
                        "determiner": [
                            {
                                "definition": "denoting one or more people or things already mentioned or assumed to be common knowledge.",
                                "example": "what's the matter?"
                            },
                            {
                                "definition": "used to point forward to a following qualifying or defining clause or phrase.",
                                "example": "the fuss that he made of her"
                            },
                            {
                                "definition": "used to make a generalized reference to something rather than identifying a particular instance.",
                                "example": "he taught himself to play the violin"
                            },
                            {
                                "definition": "enough of (a particular thing).",
                                "example": "he hoped to publish monthly, if only he could find the money"
                            },
                            {
                                "definition": "(pronounced stressing ‘the’) used to indicate that someone or something is the best known or most important of that name or type.",
                                "example": "he was the hot young piano prospect in jazz"
                            },
                            {
                                "definition": "used adverbially with comparatives to indicate how one amount or degree of something varies in relation to another.",
                                "example": "the more she thought about it, the more devastating it became"
                            }
                        ]
                    }
                };
            case 'book':
                return {
                    "word": "book",
                    "phonetic": [
                        "bʊk"
                    ],
                    "meaning": {
                        "noun": [
                            {
                                "definition": "a written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
                                "example": "a book of selected poems",
                                "synonyms": [
                                    "volume",
                                    "tome",
                                    "work",
                                    "printed work",
                                    "publication",
                                    "title",
                                    "opus",
                                    "treatise"
                                ]
                            },
                            {
                                "definition": "a bound set of blank sheets for writing in.",
                                "example": "an accounts book",
                                "synonyms": [
                                    "notepad",
                                    "notebook",
                                    "pad",
                                    "memo pad",
                                    "exercise book",
                                    "binder"
                                ]
                            },
                            {
                                "definition": "a set of tickets, stamps, matches, samples of cloth, etc., bound together.",
                                "example": "a pattern book"
                            },
                            {
                                "definition": "the first six tricks taken by the declarer in a hand of bridge, after which further tricks count towards fulfilling the contract."
                            }
                        ],
                        "verb": [
                            {
                                "definition": "reserve (accommodation, a place, etc.); buy (a ticket) in advance.",
                                "example": "I have booked a table at the Swan",
                                "synonyms": [
                                    "reserve",
                                    "make a reservation for",
                                    "arrange in advance",
                                    "prearrange",
                                    "arrange for",
                                    "order"
                                ]
                            },
                            {
                                "definition": "make an official note of the personal details of (a person who has broken a law or rule).",
                                "example": "the cop booked me and took me down to the station"
                            },
                            {
                                "definition": "leave suddenly.",
                                "example": "they just ate your pizza and drank your soda and booked"
                            }
                        ]
                    }
                };
            case 'on':
                return {
                    "word": "on",
                    "phonetic": [
                        "ɒn"
                    ],
                    "meaning": {
                        "preposition": [
                            {
                                "definition": "physically in contact with and supported by (a surface).",
                                "example": "on the table was a water jug"
                            },
                            {
                                "definition": "forming a distinctive or marked part of the surface of.",
                                "example": "a scratch on her arm"
                            },
                            {
                                "definition": "having (the thing mentioned) as a topic; about.",
                                "example": "a book on careers"
                            },
                            {
                                "definition": "as a member of (a committee, jury, or other body).",
                                "example": "they would be allowed to serve on committees"
                            },
                            {
                                "definition": "having (the thing mentioned) as a target, aim, or focus.",
                                "example": "five air raids on Schweinfurt"
                            },
                            {
                                "definition": "(often followed by a noun without a determiner) having (the thing mentioned) as a medium for transmitting or storing information.",
                                "example": "put your ideas down on paper"
                            },
                            {
                                "definition": "in the course of (a journey).",
                                "example": "he was on his way to see his mother"
                            },
                            {
                                "definition": "indicating the day or part of a day during which an event takes place.",
                                "example": "reported on September 26"
                            },
                            {
                                "definition": "engaged in.",
                                "example": "his attendant was out on errands"
                            },
                            {
                                "definition": "regularly taking (a drug or medicine).",
                                "example": "he is on morphine to relieve the pain"
                            },
                            {
                                "definition": "paid for by.",
                                "example": "the drinks are on me"
                            },
                            {
                                "definition": "added to.",
                                "example": "a few pence on the electricity bill is nothing compared with your security"
                            }
                        ],
                        "adverb": [
                            {
                                "definition": "physically in contact with and supported by a surface.",
                                "example": "make sure the lid is on"
                            },
                            {
                                "definition": "indicating continuation of a movement or action.",
                                "example": "she burbled on",
                                "synonyms": [
                                    "interminably",
                                    "at length",
                                    "for a long time",
                                    "continuously",
                                    "endlessly",
                                    "ceaselessly",
                                    "without a pause/break"
                                ]
                            },
                            {
                                "definition": "(of an event) taking place or being presented.",
                                "example": "what's on at the May Festival"
                            },
                            {
                                "definition": "(of an electrical appliance or power supply) functioning.",
                                "example": "they always left the lights on",
                                "synonyms": [
                                    "functioning",
                                    "in operation",
                                    "working",
                                    "in use",
                                    "operating"
                                ]
                            },
                            {
                                "definition": "(of an actor) on stage."
                            }
                        ],
                        "noun": [
                            {
                                "definition": "the leg side."
                            }
                        ]
                    }
                };
            case 'table':
                return {
                    "word": "table",
                    "phonetic": [
                        "ˈteɪb(ə)l"
                    ],
                    "meaning": {
                        "noun": [
                            {
                                "definition": "a piece of furniture with a flat top and one or more legs, providing a level surface for eating, writing, or working at.",
                                "example": "she put the plate on the table",
                                "synonyms": [
                                    "bench",
                                    "board",
                                    "work surface",
                                    "worktop",
                                    "counter",
                                    "desk",
                                    "bar",
                                    "buffet",
                                    "stand",
                                    "workbench",
                                    "worktable",
                                    "top",
                                    "horizontal surface",
                                    "surface"
                                ]
                            },
                            {
                                "definition": "a set of facts or figures systematically displayed, especially in columns.",
                                "example": "the population has grown, as shown in table 1",
                                "synonyms": [
                                    "list",
                                    "chart",
                                    "diagram",
                                    "figure",
                                    "graph",
                                    "plan"
                                ]
                            },
                            {
                                "definition": "a flat, typically rectangular, vertical surface; a panel."
                            },
                            {
                                "definition": "a horizontal moulding, especially a cornice."
                            }
                        ],
                        "verb": [
                            {
                                "definition": "present formally for discussion or consideration at a meeting.",
                                "example": "more than 200 amendments to the bill have already been tabled",
                                "synonyms": [
                                    "submit",
                                    "put forward",
                                    "bring forward",
                                    "propose",
                                    "suggest",
                                    "move",
                                    "enter",
                                    "lodge",
                                    "file",
                                    "introduce",
                                    "air",
                                    "moot",
                                    "lay"
                                ]
                            },
                            {
                                "definition": "postpone consideration of.",
                                "example": "I'd like the issue to be tabled for the next few months"
                            },
                            {
                                "definition": "strengthen (a sail) by making a hem at the edge."
                            }
                        ]
                    }
                };
            case 'is':
                // "third person singular present of be."
                return {
                    "word": "is",
                    "meaning": {
                        "auxiliar verb": [
                            {
                                "person": "third",
                                "number":"singular",
                                "tense": "present"
                            }
                        ]
                    }
                };
            case 'are':
                // "second person singular present and first, second, third person plural present of be."
                return {
                    "word": "are",
                    "meaning": {
                        "auxiliar verb": [
                            {
                                "person": "second",
                                "number":"singular",
                                "tense": "present"
                            },
                            {
                                "person": "first",
                                "number":"plural",
                                "tense": "present"
                            },
                            {
                                "person": "second",
                                "number":"plural",
                                "tense": "present"
                            },
                            {
                                "person": "third",
                                "number":"plural",
                                "tense": "present"
                            },

                        ]
                    }
                };

            case 'am':
                return {
                    "word": "am",
                    "meaning": {
                        "auxiliar verb": [
                            {
                                "person": "first",
                                "number":"singular",
                                "tense": "present"
                            }
                        ]
                    }
                };    
            case 'I':
                return {
                    "word": "I",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "first",
                                "number":"singular"
                            }
                        ]
                    }
                };    
            case 'you':
                return {
                    "word": "you",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "second",
                                "number":"singular"
                            },
                            {
                                "person": "second",
                                "number":"plural"
                            }
                        ]
                    }
                };    
            case 'he':
                return {
                    "word": "he",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "third",
                                "number":"singular"
                            }
                        ]
                    }
                };    
            case 'she':
                return {
                    "word": "she",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "third",
                                "number":"singular"
                            }
                        ]
                    }
                };    
            case 'it':
                return {
                    "word": "it",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "third",
                                "number":"singular"
                            }
                        ]
                    }
                };    
            case 'we':
                return {
                    "word": "we",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "first",
                                "number":"plural"
                            }
                        ]
                    }
                };    
            case 'they':
                return {
                    "word": "they",
                    "meaning": {
                        "pronoum": [
                            {
                                "person": "third",
                                "number": "plural"
                            }
                        ]
                    }
                };   

            default:
                return this.queryWord_(palavra);
        }
    }


}
