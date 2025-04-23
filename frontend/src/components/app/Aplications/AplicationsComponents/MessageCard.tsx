import React from 'react';
import { Card, CardBody } from 'reactstrap';
import {getInitialsName} from '../../../../helpers/Utils';

const MessageCard = ({ sender, item, currentUserid }: any) => {
  return (
    <>
      <Card
        className={`d-inline-block mb-3 float-${
          item.sender !== currentUserid ? 'left' : 'right'
        }`}
      >
        <div className="position-absolute  pt-1 pr-2 r-0">
          <span className="text-extra-small text-muted">{item.time}</span>
        </div>
        <CardBody>
          <div className="d-flex flex-row pb-1">
          <span className="img-thumbnail border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(sender.name)}</span>
            <div className=" d-flex flex-grow-1 min-width-zero">
              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                <div className="min-width-zero">
                  <p className="mb-0 truncate list-item-heading">
                    {sender.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-text-left">
            <p className="mb-0 text-semi-muted">{item.text}</p>
          </div>
        </CardBody>
      </Card>
      <div className="clearfix" />
    </>
  );
};

export default React.memo(MessageCard);
