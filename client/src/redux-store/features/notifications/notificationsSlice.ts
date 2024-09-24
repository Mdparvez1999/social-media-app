import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string;
  username: string;
  profilePic: string;
}

export interface NotificationState {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sentBy: UserInfo;
  receivedBy: UserInfo;
}

export interface NotificationsState {
  notifications: NotificationState[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationState[]>) => {
      state.notifications = action.payload;
    },
    readNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification.id === action.payload) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
    },
  },
});

export const { setNotifications, readNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
