export interface Chat {
    id: number;
    participants: number[];
    patient;
    patient_name: string;
    title: string;
    history: History;
    preview: Preview;
    display_data: {
        full_name: '',
        full_photo: ''
    };
}

export interface History {
    count_of_unread_messages: number;
    last_message_time: string;
    top_urgency: number;
}
export interface HistoryForSockets {
    count_of_unread_messages: number;
    top_urgency: number;
    id: number;
}

export interface Preview {
    last_message: string;
    last_message_time: any;
    total_messages_count: number;
    unread_messages_count: number;
}

export class ChatMessage {
    id: number;
    chat: number;
    subject: string;
    text: string;
    display_data: ChatMessageRecipient;
    flagged: boolean;
    flagged_custom: boolean;
    reply_for: any;
    seen: boolean;
    sender: number;
    urgency: number;
    attachment: any;
    direction: 'sender'; // for icon
    created_at: string;

    constructor(data = null) {
        if (data) {
            this.id = data.id || void 0;
            this.chat = data.chat || void 0;
            this.subject = data.subject || void 0;
            this.text = data.text || void 0;
            this.display_data = data.display_data || void 0;
            this.flagged = data.flagged || void 0;
            this.flagged_custom = data.flagged_custom || void 0;
            this.reply_for = data.reply_for || void 0;
            this.seen = data.seen || void 0;
            this.sender = data.sender || void 0;
            this.urgency = data.urgency || void 0;
            this.attachment = data.attachment || void 0;
            this.direction = data.direction || void 0;
            this.created_at = data.created_at || void 0;
        }
    }
}

export class ChatMessageRecipient {
    full_name: 'TestName1 TestLast';
    full_photo: '/media/uploads/doctor/18/11/49f9c36bf20446b086d022159133da94.png';
}
