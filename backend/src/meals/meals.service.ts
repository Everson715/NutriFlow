import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CreateMealDto} from "./dto/create-meal.dto";

@Injectable()
export class MealsService {
    constructor( private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateMealDto) {
        const meal = await this.prisma.meal.create({
            data:{
                name: dto.name,
                calories: dto.calories,
                userId: userId,
            },
        });
    }
    async findToday(userId: string) {
        const today = new Date();
        today.setHours(0,0,0,0);

        return this.prisma.meal.findMany({
            where: {
                userId,
                createdAt: {
                    gte: today,
                },
            },
        });
    }
}