import {Controller, Get, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {DashboardService} from './dashboard.service';


@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    async getDashboardData(@CurrentUser() user: {sub: string}) {
        return this.dashboardService.getDashboardData(user.sub);
    }
}