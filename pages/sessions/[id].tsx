import React, { useContext, useEffect, useState } from 'react';
import { UserDetails, SessionDetails, ModalContent } from '../../types/typings';
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import db from '../../lib/firebase';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTime } from 'react-timer-hook';
import { SocialIcon } from 'react-social-icons';
import { AiFillEdit } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { UIContext } from '../../contexts/UIContext';
import { useRouter } from 'next/router';
import { BsFillBellFill } from 'react-icons/bs';
import { RiShareForward2Line } from 'react-icons/ri';
import classNames from 'classnames';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import moment from 'moment';

type Props = {
  data: SessionDetails;
  userData: UserDetails;
};

const SessionPage = (props: Props) => {
  const { data, userData, startDateTime } = props;
  const { data: session } = useSession();
  const { dispatch } = useContext(UIContext);
  const router = useRouter();
  const sessionId: string = router.query.id as string;

  const {
    title,
    mainImage,
    description,
    startDate,
    startTime,
    duration,
    categories,
    technologies,
    speaker,
    status,
  } = data;

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

  const handleDeleteSession = async () => {
    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
      toast.success('Session deleted successfully.');
      router.push('/sessions');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleStartSession = async () => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'started',
    });

    dispatch({
      type: 'CLOSE_MODAL',
    });
    router.push(`/room/${sessionId}`);
  };

  const deleteModalContent: ModalContent = {
    title: 'Delete your Session',
    description:
      'All the attendese will be notified and my affect your rating on platform. This action cannot be undone.',
    action: handleDeleteSession,
    confirmTitle: 'Delete Session',
  };

  const startSessionModalContent: ModalContent = {
    title: 'Start your Session',
    description:
      'All the attendese will be notified and session will be started.',
    action: handleStartSession,
    confirmTitle: 'Start Session',
    possitive: true,
  };

  const handleJoin = async () => {
    try {
      const userRef = doc(db, 'sessions', sessionId);
      await updateDoc(userRef, {
        attendees: arrayUnion(session?.user.username),
      });
    } catch (error: any) {
      console.error(error);
    }
    router.push(`/room/${sessionId}`);
  };

  return (
    <main className="grid relative py-20 grid-cols-10 dark:bg-gray-1000 dark:text-gray-100">
      <section className="col-span-7 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-500 h-screen overflow-y-auto px-10">
        <div className="">
          <div className="flex flex-col overflow-hidden rounded">
            <div className="relative">
              <div className="absolute top-4 right-6">
                <StatusBadge status={status} />
              </div>
              <Image
                src={mainImage}
                height={400}
                width={1600}
                alt={title}
                className="w-full h-60 sm:h-96 dark:bg-gray-500"
              />
            </div>
            <div className="p-6 pb-12 m-4 mx-auto z-10 shadow-xl -mt-16 space-y-6 sm:px-10 sm:mx-12 lg:rounded-md dark:bg-gray-900">
              <div className="space-y-2">
                <h1 className="inline-block text-2xl font-semibold sm:text-3xl">
                  {title}
                </h1>
                <div className="flex flex-wrap space-x-2">
                  {categories.map((category, idx) => {
                    return (
                      <div key={idx} className="badge">
                        #{category}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs dark:text-gray-400">
                  By{' '}
                  <Link
                    rel="noopener noreferrer"
                    href={`/profile/${username}`}
                    className="text-xs text-gray-50 font-medium hover:underline"
                  >
                    {fname + ' ' + lname}
                  </Link>
                </p>
              </div>
              <div className="dark:text-gray-500">
                <p>{description}</p>
              </div>

              <div className="space-y-3">
                <h3 className="dark:text-gray-100 dark:font-medium">
                  Technologies:
                </h3>
                <div className="dark:text-gray-500 flex gap-2 flex-wrap">
                  {technologies.map((technology, idx) => {
                    return (
                      <div key={idx} className="badge">
                        {technology}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {userData ? (
        <aside className="col-span-3 space-y-6 px-10 h-screen">
          <div className="flex flex-col max-w-lg relative p-6 space-y-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-900 dark:text-gray-100">
            {session?.user.email === speaker ? (
              <Link href={`/account-settings`}>
                <AiFillEdit className="text-xl cursor-pointer absolute z-10 top-6 right-6" />
              </Link>
            ) : null}
            <div className="flex space-x-4">
              <Image
                alt={fname + ' ' + lname}
                src={image}
                width={1080}
                height={1080}
                className="object-cover w-12 h-12 rounded-full shadow dark:bg-gray-500"
              />
              <div className="flex flex-col space-y-1">
                <Link
                  rel="noopener noreferrer"
                  href={`/profile/${username}`}
                  className="text-sm font-semibold"
                >
                  {fname + ' ' + lname}
                </Link>
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={website}
                  className="text-xs dark:text-gray-400"
                >
                  {website}
                </Link>
              </div>
            </div>
            <div>
              <h2 className="mb-1 text-xl font-semibold">{profession}</h2>
              <p className="text-sm dark:text-gray-400">{bio}</p>
            </div>

            <div className="flex space-x-2">
              <SocialIcon bgColor="#909090" fgColor="#101010" url={instagram} />
              <SocialIcon bgColor="#909090" fgColor="#101010" url={twitter} />
              <SocialIcon bgColor="#909090" fgColor="#101010" url={linkedin} />
            </div>
          </div>

          <div className="flex flex-col max-w-lg p-6 space-y-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-900 dark:text-gray-100">
            <div className="flex flex-col text-gray-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-semibold text-gray-200">
                  {status === 'upcoming'
                    ? 'Starts In:'
                    : status === 'started'
                    ? 'Started:'
                    : status === 'ended'
                    ? 'Ended:'
                    : 'Delayed by:'}
                </span>
                <span>{moment(startDateTime, 'YYYYMMDD').fromNow()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-semibold text-gray-200">
                  Expected Duration:
                </span>
                <span>{duration} Hrs</span>
              </div>
            </div>

            {session?.user.email === speaker ? (
              <div className="">
                {status === 'upcoming' ? (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'OPEN_MODAL',
                        payload: deleteModalContent,
                      })
                    }
                    className="btn bg-red-1000 w-full"
                  >
                    Delete Session
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      status === 'started'
                        ? router.push(`/room/${sessionId}`)
                        : dispatch({
                            type: 'OPEN_MODAL',
                            payload: startSessionModalContent,
                          })
                    }
                    className="btn bg-green-1000 w-full"
                  >
                    {status !== 'started' ? 'Start Session' : 'Rejoin Session'}
                  </button>
                )}
              </div>
            ) : (
              <div className="">
                {data.status === 'upcoming' ? (
                  <button className="btn bg-green-1000 space-x-2 w-full">
                    <span>Notify Me</span> <BsFillBellFill />
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="btn bg-green-1000 space-x-2 w-full"
                  >
                    <span>Join Session</span> <RiShareForward2Line />
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      ) : (
        <div className="">Loading</div>
      )}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data from external API
  try {
    const sessionRef = doc(db, 'sessions', params?.id! as string);
    const sessionSnap = await getDoc(sessionRef);
    const data = sessionSnap.data() as SessionDetails;

    const splitTime = data.startTime.split(':');
    const hours = splitTime[0];
    const mins = splitTime[1];
    const temp = new Date(data.startDate);
    temp.setHours(parseInt(hours));
    temp.setMinutes(parseInt(mins));
    temp.setSeconds(0);
    temp.setMilliseconds(0);

    if (new Date() > temp && data.status === 'upcoming') {
      await updateDoc(sessionRef, {
        status: 'delayed',
      });
    }

    const userRef = doc(db, 'users', data.speaker);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as UserDetails;
    // Pass data to the page via props
    return { props: { data, userData, startDateTime: temp.toISOString() } };
  } catch (error: any) {
    console.error(error.message);
    return { props: { ...error } };
  }
};

export default SessionPage;
