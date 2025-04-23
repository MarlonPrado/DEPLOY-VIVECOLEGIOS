import React from 'react';
import { NavLink } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ProfileImg from '../../../../assets/img/profiles/l-1.jpg';
import { getInitialsName } from '../../../../helpers/Utils';

const CommentWithLikes = ({ intl, className, data }: any) => {
  const getLikeLabel = (likeCount: any) => {
    if (likeCount === 1) {
      return 'like';
    }
    return 'likes';
  };

  return (
    <div
      className={`d-flex flex-row mb-3 border-bottom justify-content-between ${className}`}
    >
      <NavLink to="#">
      <span className="img-thumbnail border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">{getInitialsName(data?.createdByUser ? (data?.createdByUser?.name + ' '+ data?.createdByUser?.lastName) : 'N N')}</span>
      </NavLink>
      <div className="pl-3 flex-grow-1">
        <NavLink to="#">
          <p className="font-weight-medium">{data?.createdByUser?.name} {data?.createdByUser?.lastName}</p>
        </NavLink>
        <p className="text-muted mb-3 text-small">{data?.comment}</p>
      </div>
      <div className="comment-likes">
        <span className="post-icon">
          <NavLink to="#">
            <span>
              {data.rate > 0
                ? `${data.rate} ${getLikeLabel(data.rate)}`
                : ''}
            </span>
            <i className="simple-icon-heart ml-2" />
          </NavLink>
        </span>
      </div>
    </div>
  );
};

export default injectIntl(CommentWithLikes);
