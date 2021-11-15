import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository"; 
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from "./AuthenticateUserService";

import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;



describe('AuthenticateUser', () => {

    beforeEach(()=>{

        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
             fakeHashProvider
        );

        createUserService = new CreateUserService(
            fakeUsersRepository, 
            fakeHashProvider
        );

    });
    
    it('should be able to authenticate', async () => {
        
        const user = await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        const response = await authenticateUserService.execute({
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);

    });

    it('should not be able to authenticate a non existing user', async () => {
        
        expect(authenticateUserService.execute({
            email: 'tester@test.com.br',
            password: 'teste123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
    
        await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        }); 

        await expect(authenticateUserService.execute({
            email: 'tester@test.com.br',
            password: 'senhaerrada'
        })).rejects.toBeInstanceOf(AppError);

    });

})