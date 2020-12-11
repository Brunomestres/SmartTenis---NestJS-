import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

  private readonly logger = new Logger(JogadoresService.name);
  private jogadores: Jogador[] = [];
  
  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}


  
  async criarAtualizarJogador( criarJogaodorDto: CriarJogadorDto ):Promise<void>
  {
    const { email } = criarJogaodorDto;

    const jogadorFound = await this.jogadorModel.findOne({ email }).exec();

    if( jogadorFound ) 
    {
      await this.atualizar( criarJogaodorDto);
    }else{
      await this.criar(criarJogaodorDto);
    }

  }

  async consultarTodos(): Promise<Jogador[]>
  {
    return await this.jogadorModel.find().exec();
  }

  async consultarEmail(email:string): Promise<Jogador> 
  {
    const jogadorFound = this.jogadores.find( item => item.email == email );
    if( !jogadorFound ) 
    {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado!`);
    }
    return jogadorFound;  
  }

  async deletarJogador (email:string): Promise<void>
  {

    return await this.jogadorModel.remove({email}).exec();


    // const jogadorFound = this.jogadores.find( item => item.email == email );
    // this.jogadores = this.jogadores.filter(item => item.email !== jogadorFound.email); 
 
  }

  private async criar(criarJogaodorDto: CriarJogadorDto ):Promise<Jogador> 
  {


    const jogadorCriado = new this.jogadorModel(criarJogaodorDto);

    return await jogadorCriado.save();

    // const { name, email, phoneNumber } = criarJogaodorDto;

    // const jogador: Jogador = {
    //   _id: uuidv4(),
    //   name,
    //   email,
    //   phoneNumber,
    //   ranking: 'A',
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'wherever'
    // }
    // this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    // this.jogadores.push(jogador);

  }

  private async  atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> 
  {

    return await this.jogadorModel.findOneAndUpdate({email: criarJogadorDto.email },{ $set: criarJogadorDto}).exec();


    // const { name } = criarJogadorDto;
    // jogadorFound.name = name;
  }
}
