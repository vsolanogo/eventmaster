import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../event/event.entity';
import { validate } from 'class-validator';
import { Participant } from './participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
    eventId: string,
  ): Promise<Participant> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const newParticipant = new Participant();
    newParticipant.email = createParticipantDto.email;
    newParticipant.dateOfBirth = createParticipantDto.dateOfBirth;
    newParticipant.fullName = createParticipantDto.fullName;
    newParticipant.sourceOfEventDiscovery =
      createParticipantDto.sourceOfEventDiscovery;
    newParticipant.dateOfBirth = new Date(createParticipantDto.dateOfBirth);
    newParticipant.event = event;

    const errors = await validate(newParticipant);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    } else {
      return this.participantRepository.save(newParticipant);
    }
  }

  async getAllByEventId(eventId: string): Promise<Participant[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.participantRepository.find({
      where: { event: { id: eventId } },
    });
  }
}
