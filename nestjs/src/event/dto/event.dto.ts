import { Expose, Type } from 'class-transformer';
import { ImageDto } from 'src/image/dto/image.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class EventDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => ImageDto)
  images: ImageDto;

  @Expose()
  @Type(() => UserDto)
  organizer: UserDto;

  @Expose()
  description: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  eventDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
