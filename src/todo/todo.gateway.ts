import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ITodo, todos, TodoService, TodoStatus } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly todoService: TodoService) {}
  handleDisconnect(client: any) {
    console.log(`${client.id} disconnected`);
  }
  handleConnection(client: any, ...args: any[]) {
    this.server.emit('findAllTodo', todos);
  }

  @SubscribeMessage('createTodo')
  create(@MessageBody() createTodoDto: CreateTodoDto): ITodo {
    const todo = this.todoService.create(createTodoDto);
    this.server.emit('findAllTodo', todos);
    return todo;
  }

  @SubscribeMessage('findAllTodo')
  findAll(): Array<ITodo> {
    return this.todoService.findAll();
  }

  @SubscribeMessage('searchTodo')
  searchTodos(@MessageBody() name: string) {
    this.server.emit('searchTodo', this.todoService.search(name));
  }

  @SubscribeMessage('filterTodo')
  filterTodos(@MessageBody() status?: TodoStatus) {
    this.server.emit('filterTodo', this.todoService.filter(status));
  }

  @SubscribeMessage('findOneTodo')
  findOne(@MessageBody() id: string): ITodo {
    return this.todoService.findOne(id);
  }

  @SubscribeMessage('markInProgress')
  markInProgress(@MessageBody() id: string) {
    console.log(id);
    this.todoService.markInProgress(id);
    this.server.emit('findAllTodo', todos);
  }

  @SubscribeMessage('markAsDone')
  markAsDone(@MessageBody() id: string) {
    console.log(id);
    this.todoService.markAsDone(id);
    this.server.emit('findAllTodo', todos);
  }

  @SubscribeMessage('updateTodo')
  update(@MessageBody() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(updateTodoDto);
  }

  @SubscribeMessage('deleteTodo')
  remove(@MessageBody() id: string) {
    this.todoService.remove(id);
    this.server.emit('findAllTodo', todos);
  }
}
