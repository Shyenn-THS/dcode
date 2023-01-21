import React from 'react';
import { UserDetails, SessionDetails } from '../../types/typings';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import db from '../../lib/firebase';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTime } from 'react-timer-hook';
import { useSession } from 'next-auth/react';
import Stats from '../../components/Stats';
import SessionCard from '../../components/SessionCard';
import { SocialIcon } from 'react-social-icons';

interface ExtendedSessionDetails extends SessionDetails {
  id: string;
}

type Props = {
  ownSessions: ExtendedSessionDetails[];
  userData: UserDetails;
  attendedSessions: ExtendedSessionDetails[];
};

const UserPage = (props: Props) => {
  const { ownSessions, userData, attendedSessions } = props;

  const {
    fname,
    lname,
    image,
    instagram,
    twitter,
    linkedin,
    username,
    bio,
    profession,
    website,
  } = userData;

  return (
    <main className="dark:bg-gray-1000 py-20 w-full space-y-8">
      <div className="p-6 sm:p-12 max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100 space-y-10">
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
            <Image
              src={image}
              alt={fname + ' ' + lname}
              className="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700 object-cover"
              width={1080}
              height={1080}
            />
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {fname + ' ' + lname}
              </h4>
              <h5 className="text-md font-medium text-center md:text-left">
                {profession}
              </h5>
              <p className="dark:text-gray-600 text-sm">{bio}</p>
            </div>
          </div>
          <Stats
            ownSessionsNumber={ownSessions.length}
            attendedSessionsNumber={attendedSessions.length}
          />
        </div>
        <div className="flex space-x-2 w-fit mx-auto">
          <SocialIcon bgColor="#909090" fgColor="#101010" url={instagram} />
          <SocialIcon bgColor="#909090" fgColor="#101010" url={twitter} />
          <SocialIcon bgColor="#909090" fgColor="#101010" url={linkedin} />
        </div>
      </div>

      <div className="dark:bg-gray-800 max-w-7xl mx-auto p-6 sm:p-12 ">
        <h1 className="text-3xl font-medium py-4 text-gray-50 text-center">
          Own Sessions
        </h1>
        <div className="dark:text-gray-100 grid grid-cols-3 gap-4 py-4 w-full">
          {ownSessions.map((ownSession) => {
            return <SessionCard session={ownSession} key={ownSession.id} />;
          })}
        </div>
      </div>

      <div className="dark:bg-gray-800 max-w-7xl mx-auto p-6 sm:p-12 ">
        <h1 className="text-3xl font-medium py-4 text-gray-50 text-center">
          Attended Sessions
        </h1>
        <div className="dark:text-gray-100 grid grid-cols-3 gap-4 py-4 w-full">
          {attendedSessions.map((attendedSession) => {
            return (
              <SessionCard session={attendedSession} key={attendedSession.id} />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data from external API
  try {
    let userData: UserDetails | undefined = undefined;
    const userQuery = query(
      collection(db, 'users'),
      where('username', '==', params!.username as string)
    );
    const userSnap = await getDocs(userQuery);
    userSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userData = doc.data() as UserDetails;
    });

    let attendedSessions = [] as ExtendedSessionDetails[];
    const attendedSessionsQuery = query(
      collection(db, 'sessions'),
      where('attendees', 'array-contains', params!.username as string)
    );
    const attendedSessionsSnap = await getDocs(attendedSessionsQuery);
    attendedSessionsSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      attendedSessions.push({
        ...doc.data(),
        id: doc.id,
      } as ExtendedSessionDetails);
    });

    // Own Sessions
    let ownSessions = [] as ExtendedSessionDetails[];
    const q = query(
      collection(db, 'sessions'),
      where('speaker', '==', userData!.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ownSessions.push({ ...doc.data(), id: doc.id } as ExtendedSessionDetails);
    });

    // Pass data to the page via props
    return { props: { ownSessions, userData, attendedSessions } };
  } catch (error: any) {
    console.error(error.message);
    return { props: { ...error } };
  }
};

export default UserPage;
