import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/BasicLearningDuties/BasicLearningDutiesConstants';
import { createNotification } from '../../../helpers/Notification';
import * as generalBasicLearningRightActions from '../../../stores/actions/BasicLearningDutiesActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import GeneralBasicLearningRightCreateEdit from './BasicLearningDutiesCreateEdit';

const GeneralBasicLearningRightList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const asignatureId = params.get('asignatureId');
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const gradeId = params.get('gradeId');
  const gradeAssignment = params.get('gradeAssignment');

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllGeneralBasicLearningRight(asignatureId, gradeId).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.grade_format = c.node.generalAcademicGrade ? c.node.generalAcademicGrade.name : '';
          c.node.asignature_format = c.node.generalAcademicAsignature
            ? c.node.generalAcademicAsignature.name
            : '';
          return c;
        }),
      );
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllGeneralBasicLearningRight(asignatureId, gradeId).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.grade_format = c.node.generalAcademicGrade ? c.node.generalAcademicGrade.name : '';
          c.node.asignature_format = c.node.generalAcademicAsignature
            ? c.node.generalAcademicAsignature.name
            : '';
          return c;
        }),
      );
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewGeneralBasicLearningRight(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateGeneralBasicLearningRight(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataGeneralBasicLearningRight(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveGeneralBasicLearningRight(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteGeneralBasicLearningRight(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteGeneralBasicLearningRight(item.id, false).then(
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
      await props.changeActiveGeneralBasicLearningRight(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const goTo = async (url: string) => {
    navigate(url);
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <HeaderInfoAcademic asignatureGeneral grade goTitle={gradeAssignment ? "Regresar a grados" : "Regresar a carga académica"} gradeAssignment={gradeAssignment} academicAsignatureCourseId={academicAsignatureCourseId} />
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
            // header={
            //   <>
            //     <HeaderInfoAcademic asignatureGeneral grade goTitle={gradeAssignment ? "Regresar a grados" : "Regresar a carga académica"} gradeAssignment={gradeAssignment} academicAsignatureCourseId={academicAsignatureCourseId} />
            //   </>
            // }
            refreshDataTable={refreshDataTable}
          />
          <GeneralBasicLearningRightCreateEdit
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
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
const mapDispatchToProps = { ...generalBasicLearningRightActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralBasicLearningRightList);
