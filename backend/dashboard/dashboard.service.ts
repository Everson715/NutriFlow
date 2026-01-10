import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
    async getDashboardData(userId: string) {
        // Placeholder logic for fetching dashboard data
        return {
            stats:{
                mealsToday: 3,
                caloriesConsumed: 1850,
            },
            message: `Dashboard sucessfully fetched`,
        };
    }
}