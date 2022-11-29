import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoGateway } from './todo.gateway';
import { TodoEntity } from './entities/todo.entity';
import { TodoRepository } from './repo/todo.repo';
import { TodoAnalyticsService } from './todo-analytics.service';
import { TodoAnalyticsGateway } from './todo-analytics.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [
    TodoGateway,
    TodoAnalyticsGateway,
    TodoService,
    TodoRepository,
    TodoAnalyticsService,
  ],
})
export class TodoModule {}
