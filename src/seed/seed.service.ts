import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeapiResponse } from './interfaces/pokeapi-response.interface';

@Injectable()
export class SeedService {

  private readonly axios : AxiosInstance = axios

  constructor(
    private readonly pokemonService : PokemonService
  ) {}

  async seedDB () {
    const { data } = await this.axios.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon?limit=100`)

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no : number = +segments[segments.length - 2]
      console.log({ name, no })
      
    })

    return data.results
  }
}
