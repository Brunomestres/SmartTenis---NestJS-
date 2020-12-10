import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor( private readonly jogadoresServices: JogadoresService){}
  
  @Post()
  async criarAtualizarJogador( 
    @Body() criarJogadorDto: CriarJogadorDto )
  {
    await this.jogadoresServices.criarAtualizarJogador(criarJogadorDto);
  }


  @Get()
  async consultarJogadores(
    @Query('email') email: string ): Promise<Jogador[] | Jogador>
  {
    console.log(email)
    if(email)
    {
      return await this.jogadoresServices.consultarEmail(email);
    }else{
      return await this.jogadoresServices.consultarTodos();
    }
  }

  @Delete()
  async deletarJogador(
    @Query('email') email: string): Promise<void>
  {
    this.jogadoresServices.deletarJogador(email);
  }

}
