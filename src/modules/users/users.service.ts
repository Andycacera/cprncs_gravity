import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonDbService } from '../../common/json-db/json-db.service';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const COLLECTION = 'users';

@Injectable()
export class UsersService {
  constructor(private readonly jsonDb: JsonDbService) {}

  private async getAll(): Promise<User[]> {
    return this.jsonDb.readCollection<User>(COLLECTION);
  }

  private async saveAll(users: User[]): Promise<void> {
    await this.jsonDb.writeCollection<User>(COLLECTION, users);
  }

  private generateId(users: User[]): number {
    if (users.length === 0) return 1;
    return Math.max(...users.map((u) => u.id)) + 1;
  }

  async findAll(): Promise<User[]> {
    return this.getAll();
  }

  async findOne(id: number): Promise<User> {
    const users = await this.getAll();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const users = await this.getAll();
    const newUser: User = {
      id: this.generateId(users),
      ...dto,
    };
    users.push(newUser);
    await this.saveAll(users);
    return newUser;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const users = await this.getAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updated: User = { ...users[index], ...dto };
    users[index] = updated;
    await this.saveAll(users);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const users = await this.getAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    users.splice(index, 1);
    await this.saveAll(users);
  }
}
