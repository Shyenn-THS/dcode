export interface IRoomParams {
  roomId: string;
  peerId: string;
}

export interface UserDetails {
  fname: string;
  lname: string;
  email: string;
  image: string;
  profession: string;
  bio: string;
  username: string;
  website: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

export interface IMessage {
  content: string;
  author?: UserDetails;
  timestamp: number;
}
