import React from 'react';
import {getInitialsName} from '../../../../helpers/Utils';

const ChatHeading = ({ name, thumb, lastSeenDate }: any) => {
  return (
    <>
      <div className="d-flex flex-row chat-heading">
        <div className="d-flex">
        <span className="img-thumbnail border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(name)}</span>
        </div>
        <div className=" d-flex min-width-zero">
          <div className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div className="min-width-zero">
              <div>
                <p className="list-item-heading mb-1 truncate ">{name}</p>
              </div>
              <p className="mb-0 text-muted text-small">
                {lastSeenDate === '0' ? '-' : lastSeenDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="separator mb-5" />
    </>
  );
};

export default React.memo(ChatHeading);
