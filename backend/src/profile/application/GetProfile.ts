import {UserProfileRepository} from '../infra/UserProfileRepository';
import {UserProfileNotFoundError} from '../../profile/domain/UserProfileErrors';

export class GetProfile {
    constructor(private userProfileRepository: UserProfileRepository){}
    async execute(userId: string){
        const profile = await this.userProfileRepository.findByUserId(userId);
        if(!profile){
            throw new UserProfileNotFoundError();
        }
        return profile;
    }
}