import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export interface ITodo {
  id?: string;
  title: string;
  status: TodoStatus;
}

export enum TodoStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  DONE = 'done',
}

export const todos: Array<ITodo> = [
  {
    id: '1',
    title: 'New Task',
    status: TodoStatus.PENDING,
  },
  {
    id: '2',
    title: 'In Progress Task',
    status: TodoStatus.PROGRESS,
  },
  {
    id: '3',
    title: 'Done Task',
    status: TodoStatus.DONE,
  },
];

@Injectable()
export class TodoService {
  create(createTodoDto: CreateTodoDto): ITodo {
    let todo = todos.find((todo) => todo.title === createTodoDto.title);
    if (todo) throw new ConflictException();
    todo = {
      id: `${new Date()}${todos.length + 1}`,
      title: createTodoDto.title,
      status: TodoStatus.PENDING,
    };
    todos.push(todo);
    return todo;
  }

  findAll(): Array<ITodo> {
    return todos;
  }

  search(name: string) {
    const searchTodo = todos;
    return searchTodo.filter((todo) =>
      todo.title.toLowerCase().includes(name.toLowerCase()),
    );
  }

  filter(status?: TodoStatus) {
    if (status) {
      const filter = todos;
      return filter.filter((todo) => todo.status === status);
    }
    return todos;
  }

  findOne(id: string): ITodo {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) throw new ConflictException();
    return todo;
  }

  markInProgress(id: string) {
    const pos = todos.findIndex((todo) => todo.id === id);
    console.log(pos);
    if (pos > -1) {
      todos[pos].status = TodoStatus.PROGRESS;
    }
  }

  markAsDone(id: string) {
    const pos = todos.findIndex((todo) => todo.id === id);
    console.log(pos);
    if (pos > -1) {
      todos[pos].status = TodoStatus.DONE;
    }
  }

  update(updateTodoDto: UpdateTodoDto) {
    return `This action updates a todo`;
  }

  remove(id: string) {
    const pos = todos.findIndex((value) => value.id === id);
    if (pos > -1) {
      todos.splice(pos, 1);
    }
  }
}
