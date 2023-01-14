import classNames from 'classnames';
import React from 'react';

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <div
      className={classNames(
        'badge',
        status === 'upcoming'
          ? 'badge-success'
          : status === 'started'
          ? 'badge-warning animate-pulse'
          : status === 'ended'
          ? 'badge-error'
          : 'badge-primary'
      )}
    >
      {status.toUpperCase()}
    </div>
  );
};

export default StatusBadge;
