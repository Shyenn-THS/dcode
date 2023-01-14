import classNames from 'classnames';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SessionDetails } from '../typings';
import StatusBadge from './StatusBadge';

interface ExtendedSessionDetails extends SessionDetails {
  id: string;
}

const OngoingSessionsCard = ({
  session,
}: {
  session: ExtendedSessionDetails;
}) => {
  const {
    title,
    mainImage,
    id,
    description,
    startDate,
    startTime,
    duration,
    categories,
    technologies,
    status,
  } = session;
  return (
    <Link
      rel="noopener noreferrer"
      href={`/sessions/${id}`}
      className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900"
    >
      <Image
        height={400}
        width={1600}
        src={mainImage}
        alt={title}
        className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
      />
      <div className="p-6 space-y-2 lg:col-span-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
            {title}
          </h3>
          <StatusBadge status={status} />
        </div>
        <span className="text-xs dark:text-gray-400">
          {moment(startDate).format('MMMM Do YYYY')}
        </span>
        <p>{description}</p>
        <div className="flex flex-wrap space-x-2">
          {categories.map((category, idx) => {
            return (
              <div key={idx} className="badge">
                {category}
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

export default OngoingSessionsCard;
