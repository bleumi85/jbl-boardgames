import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly userName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}
