import { GetServerSideProps } from 'next';
import React from 'react';
import { SessionDetails } from '../../types/typings';
import { collection, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase';
import SessionCard from '../../components/SessionCard';
import OngoingSessionsCard from '../../components/OngoingSessionsCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface ExtendedSessionDetails extends SessionDetails {
  id: string;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

type Props = {
  endedSessions: ExtendedSessionDetails[];
  upcomingSessions: ExtendedSessionDetails[];
  ongoingSessions: ExtendedSessionDetails[];
};

const SessionIndex = (props: Props) => {
  const { endedSessions, upcomingSessions, ongoingSessions } = props;

  return (
    <main className="dark:bg-gray-1000 dark:text-gray-100">
      <section className="container max-w-6xl p-6 py-20 mx-auto space-y-6 sm:space-y-12">
        <Carousel responsive={responsive}>
          {ongoingSessions.map((ongoingSession) => {
            return (
              <OngoingSessionsCard
                session={ongoingSession}
                key={ongoingSession.id}
              />
            );
          })}
        </Carousel>
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingSessions.map((session) => {
            return <SessionCard session={session} key={session.id} />;
          })}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400"
          >
            Load more...
          </button>
        </div>
      </section>

      <section className="container max-w-6xl p-6 pb-20 mx-auto space-y-6 sm:space-y-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Ended Sessions</h2>
          <p className="font-serif text-sm dark:text-gray-400">
            Sessions that recently ended.
          </p>
        </div>
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {endedSessions.map((session) => {
            return <SessionCard session={session} key={session.id} />;
          })}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400"
          >
            Load more...
          </button>
        </div>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from external API

  try {
    const q = query(
      collection(db, 'sessions')
      // where('startDate', '<=', Date.now())
    );
    let upcomingSessions: SessionDetails[] = [];
    let endedSessions: SessionDetails[] = [];
    let ongoingSessions: SessionDetails[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      // doc.data() is never undefined for query doc snapshots
      const data = {
        ...document.data(),
        id: document.id,
      } as ExtendedSessionDetails;

      const splitTime = data.startTime.split(':');
      const hours = splitTime[0];
      const mins = splitTime[1];
      const sessionEndDateTime = new Date(data.startDate);
      sessionEndDateTime.setHours(parseInt(hours) + 5);
      sessionEndDateTime.setMinutes(parseInt(mins));
      sessionEndDateTime.setSeconds(0);
      sessionEndDateTime.setMilliseconds(0);

      const currDateTime = new Date();

      if (currDateTime > sessionEndDateTime && data.status !== 'ended') {
        const sessionRef = doc(db, 'sessions', data.id);
        await updateDoc(sessionRef, {
          status: 'ended',
        });

        data.status = 'ended';
      }

      switch (data.status) {
        case 'upcoming':
          upcomingSessions.push(data);
          break;
        case 'delayed':
          upcomingSessions.push(data);
          break;
        case 'started':
          ongoingSessions.push(data);
          break;
        case 'ended':
          endedSessions.push(data);
          break;

        default:
          break;
      }
    });

    // Pass data to the page via props
    return { props: { upcomingSessions, endedSessions, ongoingSessions } };
  } catch (error) {
    console.error(error);
    return { props: { error: error } };
  }
};

export default SessionIndex;
