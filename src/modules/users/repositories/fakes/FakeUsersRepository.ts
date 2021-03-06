import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO"

import User from "@modules/users/infra/typeorm/entities/User";
import { uuid } from 'uuidv4';
import IFindProviderDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository{

    private users: User[] = []

    public async findAllProviders({ but }: IFindProviderDTO): Promise<User[]> {
        
        let users = this.users;

        if(but){
            users = this.users.filter(user => user.id != but);
        }

        return users;
    }

    public async findById(id: string): Promise<User | undefined>{

        const user = this.users.find(user => user.id == id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined>{
        
        const user = this.users.find(user => user.email == email);

        return user;
    }

    public async create(userData: ICreateUserDTO ): Promise<User>{

        const user = new User();

        Object.assign(user, {id: uuid(), }, userData);

        this.users.push(user);

        return user;
    }


    public async save(user: User ): Promise<User>{

        const index = this.users.findIndex(findUser => findUser.id == user.id);

        this.users[index] = user;

        return user;
    }

}

export default FakeUsersRepository;