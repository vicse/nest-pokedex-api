import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IPokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<IPokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);
      return { name, no };
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed successfully';
  }
}
