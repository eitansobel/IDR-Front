import { Chat, ChatMessage } from 'src/app/models/chat';

export enum MessageDialogType {
    New = 0,
    Reply = 1,
    Forward = 2
}

export class MessageDialogData {
    public headerText: string;
    public messageType: MessageDialogType;
    public chat: Chat;
    public message: ChatMessage;
    constructor(headerText: string, messageType: MessageDialogType, chat: any = null, message: any = null) {
        this.headerText = headerText || 'New Message';
        this.messageType = messageType || MessageDialogType.New;
        this.chat = chat;
        this.message = message || void 0;
    }
}

export class MessageDialogResult {
    public chat: number;
    public subject: string;
    public text: string;
    public participants: number[];
    public provider: number;
    public patient: number;
    public flagged: boolean;
    public reply_for: number;
    public messageType: MessageDialogType;

    constructor(data = null) {
    }
}
