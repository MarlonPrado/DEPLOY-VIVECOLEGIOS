import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/AcademicDay/academicDayConstants';
import { createNotification } from '../../../helpers/Notification';
import * as academicDayActions from '../../../stores/actions/AcademicDayActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';
import AcademicDayCreateEdit from './AcademicDayCreateEdit';
import { useLocation } from 'react-router';
import { permissionsMenu } from '../../../helpers/DataTransformations';

const AcademicDayList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  const location = useLocation();

  const getDataTable = useCallback(async () => {
    let permissions = permissionsMenu(props?.loginReducer, location.pathname);
    if (props?.loginReducer?.studentId?.length > 0) {
      props.getListAllAcademicDayCampus(props?.loginReducer?.campusId, props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear, permissions.fullAccess).then((listData: any) => {
        setDataTable(listData.map((c: any) => {
          c.node.campus_format = c.node.campus ? c.node.campus.name : '';
          return c;
        }));
      });
    } else {
      props.getListAllAcademicDay(props?.loginReducer?.campusId, props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear, permissions.fullAccess).then((listData: any) => {
        setDataTable(listData.map((c: any) => {
          c.node.campus_format = c.node.campus ? c.node.campus.name : '';
          return c;
        }));
      });
    }
  }, [])

  useEffect(() => {
    getDataTable()
      .catch(console.error);;
  }, [getDataTable]);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewAcademicDay(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateAcademicDay(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataAcademicDay(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveAcademicDay(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteAcademicDay(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteAcademicDay(item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const changeActiveDataAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.changeActiveAcademicDay(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildren':
        goToChildren(`/academicHour?academicDayId=${item.id}&academicDayName=${item.name}`);
        break;
    }
  };

  const goToChildren = async (url: string) => {
    navigate(url);
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
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            viewEditData={viewEditData}
            deleteData={deleteData}
            changeActiveData={changeActiveData}
            deleteAll={deleteAll}
            changeActiveDataAll={changeActiveDataAll}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Horas académicas',
                color: 'secondary',
                icon: 'iconsminds-time-backup',
                action: 'goToChildren',
              },
            ]}
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
          <AcademicDayCreateEdit
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
              refreshDataTable();
              return setModalOpen(!modalOpen);
            }}
            onSubmit={onSubmit}
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
const mapDispatchToProps = { ...academicDayActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicDayList);
