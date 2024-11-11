import { Injectable } from '@nestjs/common';
import { PokeapiResponse } from './interfaces/pokeapi-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http : AxiosAdapter
    
  ) {}

  async seedDB () {

    await this.pokemonModel.deleteMany()
    
    const data = await this.http.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon?limit=10`)

    // const insertPromisesArray = [];
    const pokemonsToInsert : CreatePokemonDto[] = []

    data.results.forEach( ({ name, url }) => {
      const segments = url.split('/')
      const no : number = +segments[segments.length - 2]

      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no })
      // )
      pokemonsToInsert.push({ name, no })
    })

    // await Promise.all( insertPromisesArray )
    await this.pokemonModel.insertMany(pokemonsToInsert)

    return 'Seed Executed'
  }
}
