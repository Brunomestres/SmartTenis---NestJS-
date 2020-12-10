import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

  private readonly logger = new Logger(JogadoresService.name);
  private jogadores: Jogador[] = [];
  
  
  async criarAtualizarJogador( criarJogaodorDto: CriarJogadorDto ):Promise<void>
  {
    const { email } = criarJogaodorDto;
    const jogadorFound = this.jogadores.find( item => item.email == email );

    if( jogadorFound ) 
    {
      await this.atualizar( jogadorFound, criarJogaodorDto);
    }else{
      await this.criar(criarJogaodorDto);
    }

  }

  async consultarTodos(): Promise<Jogador[]>
  {
    return await this.jogadores;
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
    const jogadorFound = this.jogadores.find( item => item.email == email );
    this.jogadores = this.jogadores.filter(item => item.email !== jogadorFound.email); 
 
  }

  private criar(criarJogaodorDto: CriarJogadorDto ): void 
  {
    const { name, email, phoneNumber } = criarJogaodorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'wherever'
    }
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(jogadorFound: Jogador, criarJogadorDto: CriarJogadorDto):void
  {
    const { name } = criarJogadorDto;
    jogadorFound.name = name;
  }
}
