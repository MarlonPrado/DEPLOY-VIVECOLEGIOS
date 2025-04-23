import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/Asignature/asignatureConstants';
import * as asignatureActions from '../../../stores/actions/Academic/AsignatureActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';

const ValuationReferents = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const areaName = params.get('areaName');

  const [data, setData] = useState(null);

  useEffect(() => {
    const areaId = params.get('id');
    props.getListAllAcademicAsignature(props?.loginReducer?.schoolId, areaId ? areaId : '', props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.generalAsignature_format = c.node.generalAcademicAsignature ? c.node.generalAcademicAsignature.name : '';
        return c;
      }));
    });
  }, []);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const getDataTable = async () => {
    const areaId = params.get('id');
    props.getListAllAcademicAsignature(props?.loginReducer?.schoolId, areaId ? areaId : '', props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.generalAsignature_format = c.node.generalAcademicAsignature ? c.node.generalAcademicAsignature.name : '';
        return c;
      }));
    });
  };


  const goToChildren = async (url: any) => {
    navigate(url);
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenGradeAssignment':
        goToChildren(`/gradeAssignmentReferents?academicAsignatureId=${item.id}&asignatureName=${item?.name}`);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 1,
                label: 'Grados',
                color: 'info',
                icon: 'simple-icon-link',
                action: 'goToChildrenGradeAssignment',
              },
            ]}
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
        </>
      ) : (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      )}
    </>
  );
};
const mapDispatchToProps = { ...asignatureActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValuationReferents);
