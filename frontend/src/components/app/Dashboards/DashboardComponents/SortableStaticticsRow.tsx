import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Row } from 'reactstrap';

import { Colxx } from '../../../../components/common/CustomBootstrap';
import RadialProgressCard from './RadialProgressCard';

const SortableStaticticsRow = ({ messages }: any) => {
  const [state, setState] = useState([
    {
      key: 1,
      title: 'Experiencias de arpendizaje completadas',
      percent: 64,
    },
    {
      key: 2,
      title: 'Deberes basicos de aprendizaje aprobados',
      percent: 75,
    },
    {
      key: 3,
      title: 'Experiencias de arpendizaje pendientes',
      percent: 32,
    },
    {
      key: 4,
      title: 'Avance del periodo academico',
      percent: 45,
    },
  ]);

  return (
    // OJOOOOO REVISAR
    // <ReactSortable
    //   list={state}
    //   setList={setState}
    //   options={{ handle: '.handle' }}
    //   className="row"
    // >
    <>
     <Row>
      {state.map((x) => {
        return (          
          <Colxx xl="3" lg="6" className="mb-4" key={x.key}>
            <RadialProgressCard
              title={x.title}
              percent={x.percent}
              isSortable
            />
          </Colxx>
        );
      })}
      </Row>
      </>
    // </ReactSortable>
  );
};
export default SortableStaticticsRow;
