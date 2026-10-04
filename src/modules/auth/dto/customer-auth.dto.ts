import { IsString, Matches, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsString()
  @Matches(/^\d{9}$/, { message: 'رقم الهاتف يجب أن يتكون من 9 أرقام' })
  phone: string;

  @IsString()
  @MinLength(4, { message: 'كلمة السر يجب أن تكون 4 أحرف أو أرقام على الأقل' })
  password: string;
}

export class CustomerRegisterDto extends CustomerLoginDto {
  @IsString()
  @MinLength(2, { message: 'يرجى إدخال الاسم' })
  name: string;
}
