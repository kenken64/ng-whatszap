export interface ChatMessage {
    message_type: number;
    message: string;
    message_date: Date;
    from: string;
    imageUrl: string;
    audioUrl: string;
    videoUrl: string;
  }