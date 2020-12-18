import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriasController } from './categorias.controller';
import { CategoriaSchema } from './categorias.schema';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [
    MongooseModule.forFeature([ { name:'Categoria', schema: CategoriaSchema }]),
    JogadoresModule
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService]
})
export class CategoriasModule {}
