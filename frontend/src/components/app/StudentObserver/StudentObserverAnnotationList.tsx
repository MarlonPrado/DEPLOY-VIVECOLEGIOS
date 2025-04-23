import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/StudentObserverAnnotation/StudentObserverAnnotationConstants';
import { createNotification } from '../../../helpers/Notification';
import * as studentObserverAnnotationActions from '../../../stores/actions/StudentObserverAnnotationActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import StudentObserverAnnotationCreateEdit from './StudentObserverAnnotationCreateEdit';

const StudentObserverAnnotationList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
  const gradeId = params.get('gradeId');
  const studentId = params.get('studentId');

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllStudentObserverAnnotation(courseId, studentId).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.academicPeriod_format = c?.node?.academicPeriod ? c?.node?.academicPeriod?.name : '';
        c.node.observerAnnotationType_format = c?.node?.observerAnnotationType ? c?.node?.observerAnnotationType?.name : '';
        return c;
      }))
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllStudentObserverAnnotation(courseId, studentId).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.academicPeriod_format = c?.node?.academicPeriod ? c?.node?.academicPeriod?.name : '';
        c.node.observerAnnotationType_format = c?.node?.observerAnnotationType ? c?.node?.observerAnnotationType?.name : '';
        return c;
      }))
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewStudentObserverAnnotation(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateStudentObserverAnnotation(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataStudentObserverAnnotation(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveStudentObserverAnnotation(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteStudentObserverAnnotation(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteStudentObserverAnnotation(item.id, false).then(
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
      await props.changeActiveStudentObserverAnnotation(!item.active, item.id, false).then(
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
      {dataTable !== null ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <HeaderInfoAcademic grade course modality student goTitle="Regresar a Estudiantes Curso" courseId={courseId} studentId={studentId} />
          </div>
          <div className='mb-2' style={{ textAlign: "right" }}>
          </div>
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
          <StudentObserverAnnotationCreateEdit
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

const mapDispatchToProps = {
  ...studentObserverAnnotationActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentObserverAnnotationList);
