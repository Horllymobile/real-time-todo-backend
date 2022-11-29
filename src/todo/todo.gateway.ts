import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ITodo, TodoService, TodoStatus } from './todo.service';
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
  async handleConnection(client: any, ...args: any[]) {
    this.server.emit('findAllTodo', await this.todoService.findAll());
  }

  @SubscribeMessage('createTodo')
  async create(@MessageBody() createTodoDto: CreateTodoDto): Promise<ITodo> {
    const todo = await this.todoService.create(createTodoDto);
    this.server.emit('findAllTodo', await this.todoService.findAll());
    return todo;
  }

  @SubscribeMessage('getAllTodos')
  async getAllTodos(@MessageBody() payload: { page?: number; size?: number }) {
    this.server.emit(
      'findAllTodo',
      await this.todoService.findAll(payload.page, payload.size),
    );
  }

  @SubscribeMessage('findAllTodo')
  async findAll(): Promise<{ page: number; size: number; data: Array<ITodo> }> {
    return await this.todoService.findAll();
  }

  @SubscribeMessage('searchTodo')
  async searchTodos(@MessageBody() name: string) {
    this.server.emit(
      'searchTodo',
      await this.todoService.findAll(0, 20, null, name),
    );
  }

  @SubscribeMessage('filterTodo')
  async filterTodos(@MessageBody() status?: TodoStatus) {
    this.server.emit(
      'filterTodo',
      await this.todoService.findAll(0, 20, status),
    );
  }

  @SubscribeMessage('findOneTodo')
  async findOne(@MessageBody() id: number) {
    this.server.emit('findOneTodo', await this.todoService.findOne(id));
  }

  @SubscribeMessage('markInProgress')
  async markInProgress(
    @MessageBody() payload: { id: number; status: TodoStatus },
  ) {
    await this.todoService.updateStatus(payload.id, payload.status);
    this.server.emit('findAllTodo', await this.todoService.findAll(0, 20));
  }

  @SubscribeMessage('markAsDone')
  async markAsDone(@MessageBody() payload: { id: number; status: TodoStatus }) {
    await this.todoService.updateStatus(payload.id, payload.status);
    this.server.emit('findAllTodo', await this.todoService.findAll(0, 20));
  }

  @SubscribeMessage('deleteTodo')
  async remove(@MessageBody() id: number) {
    await this.todoService.remove(id);
    this.server.emit('findAllTodo', await this.todoService.findAll());
  }
}
