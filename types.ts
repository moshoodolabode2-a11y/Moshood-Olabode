export enum AppView {
  DASHBOARD = 'DASHBOARD',
  UPLOAD_PACK = 'UPLOAD_PACK',
  THUMBNAIL = 'THUMBNAIL',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO',
}

export interface UploadPackData {
  titles: string[];
  description: string;
  tags: string[];
  hashtags: string[];
  pinnedComment: string;
  thumbnailConcepts: string[];
}

export interface ThumbnailGenerationResult {
  imageUrl: string;
  styleAnalysis?: string;
}

export interface VoiceConfig {
  voiceName: string;
  text: string;
}

export interface VideoConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

// Helper for Google AI Studio Veo Key selection
export type AIStudioWindow = Window & {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
};