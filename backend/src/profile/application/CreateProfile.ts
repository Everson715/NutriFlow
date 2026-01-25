import { UserProfileValidator } from "../domain/UserProfileValidator"
import {UserProfileAlreadyExistsError} from "../domain/UserProfileErrors"
import {Sex, ActivityLevel} from "@prisma/client";
import { UserProfileRepository } from "../infra/UserProfileRepository";

export interface CreateProfileInput {
    userId: string;
    age: number;
    heightCm: number;
    weightKg: number
    sex: Sex;
    activityLevel: ActivityLevel;
}

export class CreateProfile {
    constructor(private userProfileRepository: UserProfileRepository){}

    async execute(input: CreateProfileInput){
        const {userId, ...profileData} = input;

        //Verify if profile already exists
        const existingProfile = await this.userProfileRepository.findByUserId(userId);
        if(existingProfile){
            throw new UserProfileAlreadyExistsError();
        }
        //Validate profile data
        UserProfileValidator.validate(profileData);
        //Create profile
        const createdProfile = await this.userProfileRepository.create({userId, ...profileData});
        return createdProfile;
    }
}