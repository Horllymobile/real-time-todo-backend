import { TodoEntity } from './../entities/todo.entity';
import { Repository } from 'typeorm';

export class TodoRepository extends Repository<TodoEntity> {}
