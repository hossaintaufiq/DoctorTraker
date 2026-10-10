import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "Admin" | "Doctor" | "Patient" | "Staff";
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["Admin", "Doctor", "Patient", "Staff"],
      default: "Doctor",
    },
    text: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    isSelf: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
