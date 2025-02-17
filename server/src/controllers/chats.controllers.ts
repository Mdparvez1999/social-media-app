import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UserUtils } from "../utils/user.utils";
import { Users } from "../entities/user.entity";
import { AppDataSource } from "../config/DB_Connection";
import { Conversations } from "../entities/conversationEntity";
import { AppError } from "../utils/AppError";
import { sendMessage } from "../validation/chats.validation";
import { Message } from "../entities/message.entity";
import { checkIsOnline, io } from "../server";

export class ChatsController {
  private get conversationRepository() {
    return AppDataSource.getRepository(Conversations);
  }

  private get MessageRepository() {
    return AppDataSource.getRepository(Message);
  }

  public sendMessage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const senderId: string = res.locals.user.id;

      const senderUser: Users = await UserUtils.findUserById(senderId);

      const recieverId: string = req.params.recieverId;

      const recieverUser: Users = await UserUtils.findUserById(recieverId);

      const { error, value } = sendMessage.validate(req.body);

      if (error) return next(error);

      const { message } = value;

      let conversation = await this.conversationRepository
        .createQueryBuilder("conversations")
        .leftJoinAndSelect("conversations.participants", "participants")
        .leftJoinAndSelect("conversations.messages", "messages")
        .where(
          'conversations.id IN (SELECT c.id FROM conversations c LEFT JOIN users_conversations_conversations uc ON c.id = uc."conversationsId" WHERE uc."usersId" IN (:...ids) GROUP BY c.id HAVING COUNT(uc."usersId") = 2)',
          { ids: [senderId, recieverId] }
        )
        .getOne();

      let isNewConversation = false;

      if (!conversation) {
        conversation = new Conversations();

        conversation.participants = [senderUser, recieverUser];
        conversation.messages = [];

        await this.conversationRepository.save(conversation);

        isNewConversation = true;
      }

      const newMessage = new Message();

      newMessage.message = message;
      newMessage.sender = senderUser;
      newMessage.reciever = recieverUser;

      newMessage.conversation = conversation;

      await this.MessageRepository.save(newMessage);

      conversation?.messages?.push(newMessage);

      await this.conversationRepository.save(conversation);

      const responseData: any = {
        message: {
          id: newMessage.id,
          message: newMessage.message,
          sender: {
            id: newMessage.sender.id,
            userName: newMessage.sender.userName,
            profilepic: newMessage.sender.profilePic,
          },
          reciever: {
            id: newMessage.reciever.id,
            userName: newMessage.reciever.userName,
            profilepic: newMessage.reciever.profilePic,
          },
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
        },
      };

      if (isNewConversation) {
        responseData.conversation = {
          id: conversation.id,
          isGroup: conversation.isGroup,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          participant: conversation.participants
            .map((participant) => ({
              id: participant.id,
              userName: participant.userName,
              profilePic: participant.profilePic,
            }))
            .find((participant) => participant.id !== senderId),
        };
      }

      // socket io implementation
      const recieverSocketId: string = checkIsOnline(recieverId);

      if (recieverSocketId) {
        io.to(recieverSocketId).emit("newMessage", responseData);
      }

      res.status(200).json({
        success: true,
        data: responseData,
      });
    }
  );

  public createConversation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const senderId: string = res.locals.user.id;
      const recieverId: string = req.params.recieverId;

      const senderUser: Users = await UserUtils.findUserById(senderId);

      const recieverUser: Users = await UserUtils.findUserById(recieverId);

      const conversation = new Conversations();

      conversation.participants = [senderUser, recieverUser];
      conversation.messages = [];

      await this.conversationRepository.save(conversation);

      if (!conversation) {
        return next(new AppError("Conversation not created", 400));
      }

      const participant = conversation.participants
        .map((participant) => ({
          id: participant.id,
          userName: participant.userName,
          fullName: participant.fullName,
          profilePic: participant.profilePic,
        }))
        .find((participant) => participant.id === recieverId);

      const responseData = {
        conversation: {
          id: conversation.id,
          isGroup: conversation.isGroup,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          participant: participant,
        },
      };

      res.status(200).json({
        success: true,
        message: "Conversation created successfully",
        data: responseData,
      });
    }
  );

  public getAllConversations = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUserId: string = res.locals.user.id;

      const currentUser: Users = await UserUtils.findUserById(currentUserId);

      const conversations = await this.conversationRepository
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.participants", "participants")
        .innerJoin(
          "conversation.participants",
          "currentUser",
          "currentUser.id = :id",
          { id: currentUser.id }
        )
        .orderBy("conversation.updatedAt", "DESC")
        .getMany();

      const serializedConversations = conversations.map((conversation) => {
        const participants = conversation.participants.filter((participant) => {
          return participant.id !== currentUserId;
        });

        const singleParticipant = participants[0];

        return {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          isGroup: conversation.isGroup,
          participant: singleParticipant
            ? {
                id: singleParticipant.id,
                userName: singleParticipant.userName,
                fullName: singleParticipant.fullName,
                profilePic: singleParticipant.profilePic,
              }
            : null,
        };
      });

      res.status(200).json({
        success: true,
        message:
          conversations.length > 0
            ? "Conversations found"
            : "No conversations found",
        data: serializedConversations || [],
      });
    }
  );

  public getSingleConversation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUserId: string = res.locals.user.id;

      const currentUser: Users = await UserUtils.findUserById(currentUserId);

      const conversationId: string = req.params.conversationId;

      const conversation = await this.conversationRepository
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.participants", "participants")
        .innerJoin(
          "conversation.participants",
          "currentUser",
          "currentUser.id = :id",
          { id: currentUser.id }
        )
        .where("conversation.id = :conversationId", { conversationId })
        .getOne();

      if (!conversation) {
        return next(new AppError("Conversation not found", 404));
      }

      const participants = conversation.participants.filter((participant) => {
        return participant.id !== currentUserId;
      });

      const singleParticipant = participants[0];

      const serializedConversation = {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        isGroup: conversation.isGroup,
        participant: singleParticipant
          ? {
              id: singleParticipant.id,
              userName: singleParticipant.userName,
              fullName: singleParticipant.fullName,
              profilePic: singleParticipant.profilePic,
            }
          : null,
      };

      res.status(200).json({
        success: true,
        message: "Conversation found",
        data: serializedConversation,
      });
    }
  );

  public getAllMessages = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUserId: string = res.locals.user.id;

      const currentUser: Users = await UserUtils.findUserById(currentUserId);

      const conversationId: string = req.params.conversationId;

      const conversation = await this.conversationRepository
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.participants", "participants")
        .leftJoinAndSelect("conversation.messages", "messages")
        .leftJoinAndSelect("messages.sender", "sender")
        .leftJoinAndSelect("messages.reciever", "reciever")
        .where("conversation.id = :conversationId", { conversationId })
        .getOne();

      if (!conversation) {
        return next(new AppError("Conversation not found", 404));
      }

      const messages = conversation.messages;

      const serializedMessages = messages.map((message) => ({
        id: message.id,
        message: message.message,
        sender: {
          id: message.sender.id,
          userName: message.sender.userName,
          profilePic: message.sender.profilePic,
        },
        reciever: {
          id: message.reciever.id,
          userName: message.reciever.userName,
          profilePic: message.reciever.profilePic,
        },
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }));

      res.status(200).json({
        success: true,
        message: "Messages found",
        data: serializedMessages,
      });
    }
  );

  public deleteMessage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  public editMessage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  public deleteConversation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  public editConversation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );
}
