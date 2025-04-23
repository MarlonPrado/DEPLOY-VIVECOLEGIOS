import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/GradeAssignment/gradeAssignmentConstants';
import { createNotification } from '../../../helpers/Notification';
import * as academicIndicatorActions from '../../../stores/actions/GradeAssignmentActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import GradeAssignmentCreateEdit from './GradeAssignmentCreateEdit';
import { useLocation } from 'react-router';
import { permissionsMenu } from '../../../helpers/DataTransformations';

const GradeAssignmentList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let [params] = useSearchParams();
  const academicGradeId = params.get('academicGradeId');
  const gradeName = params.get('gradeName');

  const [data, setData] = useState(null);
  const location = useLocation();

  const getDataTable = useCallback(async () => {
    let permissions = permissionsMenu(props?.loginReducer, location.pathname);
    props.getListAllGradeAssignment(props?.loginReducer?.schoolId, academicGradeId, permissions.fullAccess).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.asignature_format = c.node.academicAsignature
            ? c.node.academicAsignature.name
            : '';
          c.node.area_format = c.node.academicAsignature?.academicArea
            ? c.node.academicAsignature?.academicArea?.name
            : '';
          return c;
        }),
      );
    });
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
      await props.saveNewGradeAssignment(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateGradeAssignment(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataGradeAssignment(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveGradeAssignment(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteGradeAssignment(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteUser(item.id, false).then(
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
      await props.changeActiveUser(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <HeaderInfoAcademic generic={{ title: 'Grado', value: gradeName }} goTitle="Regresar a grados" />
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
            refreshDataTable={refreshDataTable}
          />
          <GradeAssignmentCreateEdit
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
const mapDispatchToProps = { ...academicIndicatorActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeAssignmentList);
