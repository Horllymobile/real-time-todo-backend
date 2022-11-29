import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoStatus } from './todo.service';

export interface AnalyticsByStatus {
  label: string;
  number: number;
}

@Injectable()
export class TodoAnalyticsService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async analyticsByStatus(payload: {
    start_date: string;
    end_date: string;
  }): Promise<AnalyticsByStatus[]> {
    let pending: [TodoEntity[], number];
    let done: [TodoEntity[], number];
    let progress: [TodoEntity[], number];

    if (payload?.start_date && payload?.end_date) {
      pending = await this.todoRepository.findAndCount({
        where: {
          status: TodoStatus.PENDING,
          start_date: payload.start_date,
          end_date: payload.end_date,
        },
      });
      done = await this.todoRepository.findAndCount({
        where: {
          status: TodoStatus.DONE,
          start_date: payload.start_date,
          end_date: payload.end_date,
        },
      });

      progress = await this.todoRepository.findAndCount({
        where: {
          status: TodoStatus.PROGRESS,
          start_date: payload.start_date,
          end_date: payload.end_date,
        },
      });
    } else {
      pending = await this.todoRepository.findAndCount({
        where: { status: TodoStatus.PENDING },
      });
      done = await this.todoRepository.findAndCount({
        where: { status: TodoStatus.DONE },
      });

      progress = await this.todoRepository.findAndCount({
        where: { status: TodoStatus.PROGRESS },
      });
    }

    return [
      {
        label: TodoStatus.PENDING,
        number: pending[1],
      },
      {
        label: TodoStatus.DONE,
        number: done[1],
      },
      {
        label: TodoStatus.PROGRESS,
        number: progress[1],
      },
    ];
  }
}
