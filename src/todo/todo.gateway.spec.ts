import { TodoEntity } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoRepository } from './repo/todo.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoGateway } from './todo.gateway';
import { TodoService } from './todo.service';

describe('TodoGateway', () => {
  let gateway: TodoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [TodoGateway, TodoService],
    }).compile();

    gateway = module.get<TodoGateway>(TodoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
