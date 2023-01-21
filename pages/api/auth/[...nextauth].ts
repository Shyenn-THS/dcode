import { doc, getDoc, setDoc } from 'firebase/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { UserDetails } from '../../../types/typings';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/firebase';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider.
      const { email, image } = session.user;

      const docRef = doc(db, 'users', email);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as UserDetails;

      if (data) {
        session.user = data;
      } else {
        const newUser = {
          fname: '',
          lname: '',
          email: email,
          image: image,
          profession: '',
          bio: '',
          username: uuidv4(),
          website: '',
          instagram: '',
          linkedin: '',
          twitter: '',
        };

        await setDoc(doc(db, 'users', email), newUser);
        session.user = newUser;
      }

      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export default NextAuth(authOptions);
