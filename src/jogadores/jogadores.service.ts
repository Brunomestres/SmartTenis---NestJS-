import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dto/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogaodorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogaodorDto;

    const jogadorFound = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorFound) {
      throw new BadRequestException('Jogador com ' + email + ' já cadastrado!');
    }

    const jogadorCriado = new this.jogadorModel(criarJogaodorDto);

    return await jogadorCriado.save();
  }
  async atualizarJogador(
    _id: string,
    criarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorFound = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorFound) {
      throw new NotFoundException('Jogador com ' + _id + ' não encontrado!');
    }

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: criarJogadorDto })
      .exec();
  }

  async consultarTodos(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarPorId(_id: string): Promise<Jogador> {
    const jogadorFound = this.jogadorModel.findOne({ _id }).exec();
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado!`);
    }
    return jogadorFound;
  }

  async deletarJogador(_id: string): Promise<void> {
    const jogadorFound = this.jogadorModel.findOne({ _id }).exec();
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado!`);
    }
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
