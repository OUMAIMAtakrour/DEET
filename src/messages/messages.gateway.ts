import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelService } from 'src/channel/channel.service';

@WebSocketGateway({
  cors: {
      origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
      private readonly messagesService: MessagesService,
      private readonly channelService: ChannelService
  ) {}

  async handleConnection(client: Socket) {
      const userId = client.handshake.auth.userId;
      
      if (!userId) {
          client.disconnect();
          return;
      }

      client.data.userId = userId;

      try {
          const userChannels = await this.channelService.findAll(userId);
          userChannels.forEach(channel => {
              client.join(channel._id.toString());
          });
      } catch (error) {
          client.disconnect();
      }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
      @MessageBody() createMessageDto: CreateMessageDto,
      @ConnectedSocket() client: Socket,
  ) {
      try {
          const message = await this.messagesService.create(createMessageDto);
          
          this.server
              .to(createMessageDto.channelId)
              .emit('newMessage', message);

          return { success: true, message };
      } catch (error) {
          return { error: error.message };
      }
  }


  handleDisconnect(client: Socket) {
      client.disconnect();
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() channelId: string
  ) {
      const userId = client.data.userId;
      if (!userId) {
          return { error: 'Unauthorized' };
      }

      try {
          await this.channelService.findOne(channelId, userId);
          client.join(channelId);
          return { success: true };
      } catch (error) {
          return { error: 'Channel access denied' };
      }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() channelId: string
  ) {
      client.leave(channelId);
      return { success: true };
  }

 

  @SubscribeMessage('typing')
  async handleTyping(
      @MessageBody() channelId: string,
      @ConnectedSocket() client: Socket,
  ) {
      const userId = client.data.userId;
      if (!userId) {
          return { error: 'Unauthorized' };
      }

      try {
          const channel = await this.channelService.findOne(channelId, userId);
          
          const user = channel.members.find(member => member[0].toString() === userId);
          
          client.broadcast
              .to(channelId)
              .emit('userTyping', { 
                  userId,
                  username: user?.name || 'User'
              });

          return { success: true };
      } catch (error) {
          return { error: error.message };
      }
  }
}