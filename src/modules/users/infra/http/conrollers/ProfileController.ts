import { Request, Response } from 'express';
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {

    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const showProfileService = container.resolve(ShowProfileService);
    
        const user = await showProfileService.execute({
            user_id,
        });
    
        delete user.password;
        
        return response.json(user);
    }

    public async update( request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, old_password } = request.body;

        const updateProfileService = container.resolve(UpdateProfileService);
    
        const user = await updateProfileService.execute({
            user_id,
            name,
            email,
            password,
            old_password
        });
        
        return response.json(classToClass(user));
    }
}