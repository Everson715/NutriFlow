import {IsInt, isInt, IsNotEmpty, IsString, Min} from 'class-validator';

export class CreateMealDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsInt()
    @Min(0)
    calories: number;
}