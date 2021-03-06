import { getRepository, Raw, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO"

import Appointment from "../entities/Appointment";
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{

    private ormRepository: Repository<Appointment>;

    constructor(){
        this.ormRepository = getRepository(Appointment);
    }

    public async create({ 
        provider_id,
        user_id, 
        date
    }: ICreateAppointmentDTO ): Promise<Appointment>{

        const appointment = this.ormRepository.create({provider_id, user_id, date});

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined>{

        const appointmentWithSameDate = await this.ormRepository.findOne({
            where: { date },
        });    

        return appointmentWithSameDate;
    }
    

    public async findAllInMonthFromProvider({ 
        provider_id, 
        year, 
        month 
    }: IFindAllInMonthFromProviderDTO ): Promise<Appointment[]>{
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find( {
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
                )
            }
        });

        return appointments;

    }

    public async findAllInDayFromProvider({ 
        provider_id, 
        year, 
        month,
        day 
    }: IFindAllInDayFromProviderDTO ): Promise<Appointment[]>{
        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');

        const appointments = await this.ormRepository.find( {
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
                )
            }
        });

        return appointments;

    }

}

export default AppointmentsRepository;