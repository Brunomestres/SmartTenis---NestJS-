import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { DesafioStatus } from './desafio-status.enum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = await this.jogadoresService.consultarTodos();
    console.log(jogadores);
    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );
      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador!`,
        );
      }
    });

    const solicitanteDaPartida = await criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id === criarDesafioDto.solicitante,
    );

    this.logger.log(`solicitanteDaPartida: ${solicitanteDaPartida}`);

    if (solicitanteDaPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    const categoriaDoJogador = await this.categoriasService.consultarCategoriaDoJogador(
      criarDesafioDto.solicitante,
    );

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }
    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();

    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(`desafioCriado: ${desafioCriado}`);

    return await desafioCriado.save();
  }

  async consultarDesafios(): Promise<Desafio[]> {
    return await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }
  async consultarDesafioJogador(_id: any): Promise<Desafio[]> {
    const jogadores = await this.jogadoresService.consultarTodos();
    const jogadorFilter = jogadores.filter((jogador) => jogador._id == _id);
    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    /*
        Atualizaremos a data da resposta quando o status do desafio vier preenchido 
        */
    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirPartida(
    _id: string,
    atribuirPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioFound = await this.desafioModel.findById(_id).exec();
    if (!desafioFound) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    const jogadorFilter = desafioFound.jogadores.filter(
      (jogador) => jogador._id == atribuirPartidaDto.def,
    );

    this.logger.log(`desafioFound: ${desafioFound}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }
    const partidaCriada = new this.partidaModel(atribuirPartidaDto);

    partidaCriada.categoria = desafioFound.categoria;

    partidaCriada.jogadores = desafioFound.jogadores;

    const resultado = await partidaCriada.save();

    desafioFound.status = DesafioStatus.REALIZADO;

    desafioFound.partida = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioFound })
        .exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: resultado.id }).exex();
      throw new InternalServerErrorException();
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}
