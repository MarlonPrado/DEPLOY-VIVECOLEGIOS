/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, CardBody, CardTitle, Progress } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import data from '../../../../stores/data/profileStatuses';

const ProfileStatuses = ({ cardClass = 'h-100' }) => {
  return (
    <Card className={`${cardClass} rounded-card`}>
      <CardBody>
        <CardTitle>
          Experiencias de aprendizajes 
        </CardTitle>
        {data.map((s: any, index: any) => {
          return (
            <div key={index} className="mb-4">
              <p className="mb-2">
                {s.title}
                <span className="float-right text-muted">
                  {s.status}/{s.total}
                </span>
              </p>
              <Progress value={(s.status / s.total) * 100} />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
export default ProfileStatuses;
