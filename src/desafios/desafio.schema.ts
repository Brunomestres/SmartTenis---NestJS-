import * as mongoose from 'mongoose';

export const DesafioSchema = new mongoose.Schema(
  {
    dataHora: { type: Date },
    status: { type: String },
    dataHoraSolicitacao: { type: Date },
    dataHoraResposta: { type: Date },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' },
    categoria: { type: String },
    jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
    partida: { type: mongoose.Schema.Types.ObjectId, ref: 'PArtida' },
  },
  { timestamps: true, collection: 'desafios' },
);
