import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizaCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {


  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService
    ){}

  async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria>
  {
    const { categoria } = criarCategoriaDto;

    const categoriaFound = await this.categoriaModel.findOne({ categoria }).exec();

    if(categoriaFound)
    {
      throw new BadRequestException(`Categoria ${ categoria } já cadastrada`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);

    return await categoriaCriada.save();
  }


  async consultar(): Promise<Array<Categoria>>
  {

    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarPorId(categoria: string): Promise<Categoria>
  {
    const categoriaFound = await this.categoriaModel.findOne({ categoria }).exec();
    
    if(!categoriaFound)
    {
      throw new BadRequestException(`Categoria ${ categoria } não econtrada`);
    }

    return categoriaFound;
  }

  async atualizarCategoria(categoria:string, atualizarCategoriaDto: AtualizaCategoriaDto):Promise<void>
  {
    const categoriaFound = await this.categoriaModel.findOne({ categoria }).exec();

    if(!categoriaFound)
    {
      throw new BadRequestException(`Categoria ${ categoria } não econtrada`);
    }

    await this.categoriaModel.findOneAndUpdate({ categoria }, {$set:atualizarCategoriaDto}).exec()

  }

  async atribuirCategoriaJogador(params :string[]): Promise<void>
  {
    const categoria = params['categoria'];
    const jogador = params['jogador'];

    const categoriaFound = await this.categoriaModel.findOne({ categoria }).exec();
    
    const jogadorNaCategoria = await this.categoriaModel.find({ categoria })
    .where('jogadores').in(jogador).exec();



    await this.jogadoresService.consultarPorId(jogador);

    if(!categoriaFound)
    {
      throw new BadRequestException(`Categoria ${ categoria } não econtrada`);
    }
    if(jogadorNaCategoria.length > 0)
    {
      throw new BadRequestException(`Jogador ${ categoria } já está na categoria!`);
    }




    categoriaFound.jogadores.push(jogador);

    await this.categoriaModel.findOneAndUpdate({ categoria }, {$set: categoriaFound }).exec()
  } 
}
