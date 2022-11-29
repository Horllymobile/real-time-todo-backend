import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TodoAnalyticsService } from './todo-analytics.service';

@WebSocketGateway()
export class TodoAnalyticsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly todoAnalyticsService: TodoAnalyticsService) {}

  handleDisconnect(client: any) {
    console.log(`${client.id} disconnected`);
  }
  async handleConnection(client: any, ...args: any[]) {
    console.log(`${client.id} disconnected`);
  }
  @SubscribeMessage('analyticsByStatus')
  async getByStatus(
    @MessageBody() payload: { start_date: string; end_date: string },
  ) {
    this.server.emit(
      'getAnalyticsByStatus',
      await this.todoAnalyticsService.analyticsByStatus(payload),
    );
  }
}
