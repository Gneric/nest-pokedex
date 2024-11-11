export interface PokeapiResponse {
    count:    number;
    next:     string;
    previous: null;
    results:  PokemonGeneral[];
}

export interface PokemonGeneral {
    name: string;
    url:  string;
}