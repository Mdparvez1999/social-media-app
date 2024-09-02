import { asyncHandler } from "../utils/asyncHandler.js";
import { UserUtils } from "../utils/user.utils.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Conversations } from "../entities/conversationEntity.js";
import { AppError } from "../utils/AppError.js";
import { sendMessage } from "../validation/chats.validation.js";
import { Message } from "../entities/message.entity.js";
import { checkIsOnline, io } from "../server.js";
export class ChatsController {
    get conversationRepository() {
        return AppDataSource.getRepository(Conversations);
    }
    get MessageRepository() {
        return AppDataSource.getRepository(Message);
    }
    sendMessage = asyncHandler(async (req, res, next) => {
        const senderId = res.locals.user.id;
        const senderUser = await UserUtils.findUserById(senderId);
        const recieverId = req.params.recieverId;
        const recieverUser = await UserUtils.findUserById(recieverId);
        const { error, value } = sendMessage.validate(req.body);
        if (error)
            return next(error);
        const { message } = value;
        let conversation = await this.conversationRepository
            .createQueryBuilder("conversations")
            .leftJoinAndSelect("conversations.participants", "participants")
            .leftJoinAndSelect("conversations.messages", "messages")
            .where('conversations.id IN (SELECT c.id FROM conversations c LEFT JOIN users_conversations_conversations uc ON c.id = uc."conversationsId" WHERE uc."usersId" IN (:...ids) GROUP BY c.id HAVING COUNT(uc."usersId") = 2)', { ids: [senderId, recieverId] })
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
        const responseData = {
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
                participants: conversation.participants
                    .map((participant) => ({
                    id: participant.id,
                    userName: participant.userName,
                    profilePic: participant.profilePic,
                }))
                    .filter((participant) => participant.id !== senderId),
            };
        }
        // socket io implementation
        const recieverSocketId = checkIsOnline(recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", responseData);
        }
        res.status(200).json({
            success: true,
            data: responseData,
        });
    });
    getAllConversations = asyncHandler(async (req, res, next) => {
        const currentUserId = res.locals.user.id;
        const currentUser = await UserUtils.findUserById(currentUserId);
        const conversations = await this.conversationRepository
            .createQueryBuilder("conversation")
            .leftJoinAndSelect("conversation.participants", "participants")
            .innerJoin("conversation.participants", "currentUser", "currentUser.id = :id", { id: currentUser.id })
            .orderBy("conversation.updatedAt", "DESC")
            .getMany();
        if (!conversations || conversations.length === 0) {
            return next(new AppError("No conversations found", 404));
        }
        const serializedConversations = conversations.map((conversation) => ({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            isGroup: conversation.isGroup,
            participants: conversation.participants
                .map((participant) => ({
                id: participant.id,
                userName: participant.userName,
                fullName: participant.fullName,
                profilePic: participant.profilePic,
            }))
                .filter((participant) => participant.id !== currentUserId),
        }));
        res.status(200).json({
            success: true,
            message: "Conversations found",
            data: serializedConversations,
        });
    });
    getAllMessages = asyncHandler(async (req, res, next) => {
        const currentUserId = res.locals.user.id;
        const currentUser = await UserUtils.findUserById(currentUserId);
        const conversationId = req.params.conversationId;
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
        if (!messages || messages.length === 0) {
            return next(new AppError("No messages found", 404));
        }
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
    });
    deleteMessage = asyncHandler(async (req, res, next) => { });
    editMessage = asyncHandler(async (req, res, next) => { });
    deleteConversation = asyncHandler(async (req, res, next) => { });
    editConversation = asyncHandler(async (req, res, next) => { });
}
