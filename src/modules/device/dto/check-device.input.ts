import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CheckDeviceInput {
    @IsNotEmpty()
    @IsString()
    deviceId: string;
}