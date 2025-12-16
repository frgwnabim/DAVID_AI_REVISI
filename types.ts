export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface HealthCheckResult {
  temperatureEstimate: string;
  symptoms: string[];
  advice: string;
}

export type ViewMode = 'chat' | 'stats' | 'education';

export interface CovidDataPoint {
  date: string;
  cases: number;
  type: 'historical' | 'prediction';
}

export interface EducationTopic {
  id: string;
  title: string;
  icon: any;
  summary: string;
  details: string;
}