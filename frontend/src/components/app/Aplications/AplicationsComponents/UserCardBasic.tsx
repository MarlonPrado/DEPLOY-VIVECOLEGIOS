import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardBody, CardSubtitle, CardText } from 'reactstrap';
import { getInitialsName } from '../../../../helpers/Utils';
import ThumbnailImage from '../AplicationsComponents/ThumbnailImage';

const UserCardBasic = (props: any) => {

  useEffect(() => {
  }, [props.itemSelected]);

  return (
    <Card className="d-flex flex-row mb-4 w-340" onClick={() => {
      props.setItem(props.data.key);
    }}>
      <span className="d-flex">
        {/* <ThumbnailImage rounded small src={data.thumb} alt="profile" className="m-4" /> */}
        <span className="img-thumbnail border-0 span-initials m-4 rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(props.data.name)}</span>
      </span>
      <div className=" d-flex flex-grow-1 min-width-zero">
        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
          <div className="min-width-zero">
            <CardSubtitle className="truncate mb-1">{props.data.name}</CardSubtitle>
            <CardText className="text-muted text-small mb-2">{props.data.status}</CardText>
          </div>
        </CardBody>
      </div>
      <div className="p-2">
        <p className="lead font-bold text-info">0{props.data.key}</p>
      </div>
      {props.itemSelected === props.data.key ? (
        <>
          <span className="line-right"></span>
          <span className="line-left"></span>
        </>
      ) : (
        ''
      )}
    </Card>
  );
};

export default React.memo(UserCardBasic);
