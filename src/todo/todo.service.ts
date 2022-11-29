import { TodoEntity } from './entities/todo.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';

export interface ITodo {
  id: number;
  name: string;
  status: TodoStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export enum TodoStatus {
  ALL = '',
  PENDING = 'pending',
  PROGRESS = 'progress',
  DONE = 'done',
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create({
      name: createTodoDto.name,
      start_date: createTodoDto.start_date,
      end_date: createTodoDto.end_date,
    });
    await this.todoRepository.save(todo);
    return todo;
  }

  async findAll(
    page?: number,
    size?: number,
    status?: TodoStatus,
    name?: string,
  ): Promise<{ page: number; size: number; data: Array<ITodo> }> {
    try {
      let todos: Array<ITodo>;
      const builder = this.todoRepository.createQueryBuilder('todo_entity');
      if (status) {
        builder.skip(page).take(size).where('todo_entity.status = :status', {
          status: status,
        });
        todos = await builder.getMany();
      } else if (name) {
        builder
          .skip(page)
          .take(size)
          .where('LOWER(todo_entity.name) LIKE LOWER(:name)', {
            name: `%${name}%`,
          });
        todos = await builder.getMany();
        console.log(todos);
      } else {
        builder.skip(page).take(size);
        todos = await builder.getMany();
      }
      return {
        page: page ?? 0,
        size: size ?? 20,
        data: todos,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<ITodo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException();
    return todo;
  }

  async filter(status?: TodoStatus) {
    return await this.todoRepository.find({ where: { status } });
  }

  async updateStatus(id: number, status: TodoStatus) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (todo) {
      todo.status = status;
      await this.todoRepository.save(todo);
    }
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (todo) {
      (todo.status = TodoStatus.DONE), await this.todoRepository.remove(todo);
    }
  }
}
