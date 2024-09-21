import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParticipantsState {
  id: string;
  userName: string;
  fullName: string;
  profilePic: string;
}

export interface ConversationsState {
  id: string;
  isGroup: boolean;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  participants: ParticipantsState;
}

interface EachMessageState {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    userName: string;
    profilePic: string;
  };
  reciever: {
    id: string;
    userName: string;
    profilePic: string;
  };
}

export interface MessageSliceState {
  conversations: ConversationsState[];
  selectedConversation: ConversationsState | null;
  messages: EachMessageState[];
}

const initialState: MessageSliceState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ConversationsState[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<ConversationsState>) => {
      state.conversations.push(action.payload);
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<ConversationsState | null>
    ) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<EachMessageState[]>) => {
      state.messages = action.payload;
    },
    clearConversation: (state) => {
      state.selectedConversation = null;
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setMessages,
  clearConversation,
} = messageSlice.actions;

export default messageSlice.reducer;
