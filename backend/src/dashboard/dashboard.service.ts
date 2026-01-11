import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}
    async getDashboardData(userId: string) {
        // Placeholder logic for fetching dashboard 
            const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const meals = await this.prisma.meal.findMany({
        where: {
            userId,
            createdAt: {
                gte: today,
            },
        },
    });
    const totalCalories = meals.reduce(
        (sum, meal) => sum + meal.calories, 
        0
    );

        return {
            stats:{
                mealsToday: meals.length,
                caloriesConsumed: totalCalories,
            },
            message: `Dashboard sucessfully fetched`,
        };
    }
}