import { UserDetails } from '@/types/typings';

export interface IMessage {
  content: string;
  author?: UserDetails;
  timestamp: number;
}
