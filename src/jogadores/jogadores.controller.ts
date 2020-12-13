import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadore-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor( private readonly jogadoresServices: JogadoresService){}
  

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador( 
    @Body() criarJogadorDto: CriarJogadorDto )
  {
    await this.jogadoresServices.criarJogador(criarJogadorDto);
  }
  
  
  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador( 
    @Body() criarJogadorDto: CriarJogadorDto, 
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string ):Promise<void>
  {

    await this.jogadoresServices.atualizarJogador(_id, criarJogadorDto);
  }


  @Get()
  async consultarJogadores(): Promise<Jogador[] >
  {
    return await this.jogadoresServices.consultarTodos();
    
  }

  @Get('/:_id')
  async consultarJogadoresId(
    @Param('_id',JogadoresValidacaoParametrosPipe) _id: string ): Promise<Jogador>
  {
    return await this.jogadoresServices.consultarPorId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe ) _id: string): Promise<void>
  {
    this.jogadoresServices.deletarJogador(_id);
  }

}
