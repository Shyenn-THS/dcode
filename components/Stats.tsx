import { AiOutlineFundProjectionScreen } from 'react-icons/ai';
import React, { FC } from 'react';
import CountUp from 'react-countup';
import { IconBaseProps } from 'react-icons/lib';
import { BsPatchCheck } from 'react-icons/bs';

type Props = {
  ownSessionsNumber: number;
  attendedSessionsNumber: number;
};

const Stats = (props: Props) => {
  const { ownSessionsNumber, attendedSessionsNumber } = props;
  const StatsCard = ({
    name,
    value,
    Icon,
  }: {
    name: string;
    value: number;
    Icon: FC<IconBaseProps>;
  }) => {
    return (
      <div className="flex p-4 space-x-4 rounded-lg md:space-x-6">
        <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 bg-mandys-pink-300">
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex flex-col justify-center align-middle">
          <p className="text-3xl font-semibold text-white leading-none">
            <CountUp end={value} duration={1} />+
          </p>
          <p className="capitalize text-froly-200 whitespace-nowrap">{name}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="">
      <div className="flex items-center space-x-4">
        <StatsCard
          name="Own Sessions"
          value={ownSessionsNumber}
          Icon={AiOutlineFundProjectionScreen}
        />
        <StatsCard
          name="Attended Sessions"
          value={attendedSessionsNumber}
          Icon={BsPatchCheck}
        />
      </div>
    </section>
  );
};

export default Stats;
