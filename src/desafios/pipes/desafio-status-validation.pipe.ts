import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DesafioStatus } from '../desafio-status.enum';

export class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitido = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} é um status inválido!`);
    }

    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitido.indexOf(status);

    return idx !== -1;
  }
}
