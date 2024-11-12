import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit : number

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    
    private readonly configService : ConfigService
  ) {

    this.configService.get<number>('defaultLimit')

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    }
    catch (err) {
      this.handleException(err)
    }

  }

  findAll( queryParams : PaginationDTO ) {
    const { limit = this.defaultLimit, offset = 0 } = queryParams

    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v')
  }

  async findOne(term: string) {
    let pokemon : Pokemon

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    if ( !pokemon && isValidObjectId(term) ) {
      pokemon = await this.pokemonModel.findById(term)
    }

    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if ( !pokemon ) throw new NotFoundException(`Pokemon with search term: ${term} not found`)
     
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term )

    if ( updatePokemonDto.name  ) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase() 
    }

    try {
      await pokemon.updateOne(updatePokemonDto)
  
      return { ...pokemon.toJSON(), ...updatePokemonDto } 
    } 
    catch (err) {
      this.handleException(err)
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id )
    // await pokemon.deleteOne()

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if ( deletedCount == 0 ) throw new BadRequestException(`Pokemon with id ${id} not found`)
  }


  private handleException( err : any ) {
    if (err.code === 11000 ) throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify(err.keyValue) }`)
    console.log(err)
    throw new InternalServerErrorException(`Can't create pokemon - Check the server logs`)
  }
}
