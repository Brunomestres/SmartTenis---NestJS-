import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarJogadorDto {
  
  @IsNotEmpty()
  readonly phoneNumber: string;
  
  
  @IsEmail()
  readonly email: string;
  
  
  @IsNotEmpty()
  readonly name:string;
  
  
}