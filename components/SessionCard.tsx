import classNames from 'classnames';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { BiTimeFive } from 'react-icons/bi';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { SessionDetails } from '../typings';
import StatusBadge from './StatusBadge';

interface ExtendedSessionDetails extends SessionDetails {
  id: string;
}

const SessionCard = ({ session }: { session: ExtendedSessionDetails }) => {
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
      className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900"
    >
      <Image
        role="presentation"
        className="object-cover w-full rounded h-44 dark:bg-gray-500"
        height={400}
        width={1600}
        src={mainImage}
        alt={title}
      />
      <div className="p-6 space-y-2">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
            {title}
          </h3>
          <StatusBadge status={status} />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, idx) => {
            return (
              <div key={idx} className="badge">
                {category}
              </div>
            );
          })}
        </div>
        <div className="flex space-x-4">
          <time className="text-sm flex items-center dark:text-gray-50">
            <BiTimeFive className="mr-2" />
            <span>{startTime}</span>
          </time>

          <span className="text-sm flex items-center dark:text-gray-50">
            <BsFillCalendarDateFill className="mr-2" />
            {moment(startDate).format('MMMM Do YYYY')}
          </span>
        </div>
        <p className="line-clamp-3 dark:text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default SessionCard;
