import classNames from 'classnames';
import React, { useContext } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MdError } from 'react-icons/md';
import { UIContext } from '../contexts/UIContext';

type Props = {};

const ConfirmationModal = (props: Props) => {
  const { state, dispatch } = useContext(UIContext);
  const { openModal, modalContent } = state;
  const { title, confirmTitle, action, description, possitive } = modalContent!;

  const performActionAndClose = () => {
    action();
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return openModal ? (
    <div className="">
      <div className="h-screen w-screen bg-black opacity-80 fixed top-0 left-0 z-40" />
      <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 z-50 top-40 mb-4 mx-4">
        <div className="md:flex items-center">
          <div
            className={classNames(
              'rounded-full border flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto',
              possitive ? 'border-green-700' : 'border-red-700'
            )}
          >
            <i
              className={classNames(
                'text-3xl',
                possitive ? 'text-green-800' : 'text-red-800'
              )}
            >
              {possitive ? <AiFillCheckCircle /> : <MdError />}
            </i>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <p className="font-bold dark:text-gray-1000">{title}</p>
            <p className="text-sm text-gray-800 mt-1">{description}</p>
          </div>
        </div>
        <div className="text-center space-x-4 md:text-right mt-4 md:flex md:justify-end">
          <button
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            className={classNames(
              'btn text-gray-100',
              possitive ? 'bg-red-900' : 'bg-green-900'
            )}
          >
            Cancel
          </button>
          <button
            onClick={performActionAndClose}
            className={classNames(
              'btn text-gray-100',
              possitive ? 'bg-green-900' : 'bg-red-900'
            )}
          >
            {confirmTitle}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmationModal;
