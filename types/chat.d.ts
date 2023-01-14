import { UserDetails } from '@/typings';

export interface IMessage {
  content: string;
  author?: UserDetails;
  timestamp: number;
}
