import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoGateway } from './todo.gateway';
import { TodoEntity } from './entities/todo.entity';
import { TodoRepository } from './repo/todo.repo';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoGateway, TodoService, TodoRepository],
})
export class TodoModule {}
