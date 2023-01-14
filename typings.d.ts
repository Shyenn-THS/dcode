import { User } from 'next-auth';

export type UserDetails = {
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
};

export type SessionDetails = {
  title: string;
  subtitle?: string;
  mainImage: string;
  description: string;
  startDate: Date;
  startTime: string;
  duration: number;
  attendees?: User[];
  speaker: string;
  categories: string[];
  technologies: string[];
  status: string;
};

type ModalContent = {
  title: string;
  confirmTitle: string;
  action: any;
  description: string;
  possitive?: boolean;
};
