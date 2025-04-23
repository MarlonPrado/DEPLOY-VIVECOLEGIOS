import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/Learning/LearningConstants';
import { createNotification } from '../../../helpers/Notification';
import * as learningActions from '../../../stores/actions/LearningActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import LearningCreateEdit from './LearningCreateEdit';

const Learning = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  let [academicPeriod, setAcademicPeriod] = useState([]);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let [params] = useSearchParams();
  const asignatureId = params.get('asignatureId');
  const gradeId = params.get('gradeId');
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const gradeAssignment = params.get('gradeAssignment');

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllLearning(props?.loginReducer?.schoolId, asignatureId ? asignatureId : '', gradeId ? gradeId : '').then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.academicStandard_format = c.node.academicStandard
            ? c.node.academicStandard.standard
            : '';
          return c;
        }),
      );
    });
    props
      .getAcademicPeriodsLearning(
        props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear,
      )
      .then((listData: any) => {
        setAcademicPeriods(listData);
      });
  }, []);

  const getDataTable = async (idAcademicPeriod: any = []) => {
    props.getListAllLearning(props?.loginReducer?.schoolId, asignatureId ? asignatureId : '', gradeId ? gradeId : '', idAcademicPeriod.length > 0 ? idAcademicPeriod : undefined).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.academicStandard_format = c.node.academicStandard
            ? c.node.academicStandard.standard
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
      await props.saveNewLearning(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateLearning(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataLearning(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveLearning(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteLearning(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteLearning(item.id, false).then(
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
      await props.changeActiveLearning(!item.active, item.id, false).then(
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
      case 'goToChildrenLearning':
        goToChildren(`/evidenceLearning?learningId=${item.id}&academicAsignatureCourseId=${academicAsignatureCourseId}&gradeAssignment=${gradeAssignment}`);
        break;
    }
  };

  const filterByPeriod = async (item: any) => {
    if (academicPeriod.find((c: any) => { return (c === item?.node?.id) })) {
      academicPeriod = [];
    } else {
      academicPeriod = [item?.node?.id];
    }
    setAcademicPeriod(academicPeriod);
    setDataTable(null);
    await getDataTable(academicPeriod);
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <>
            <div className='d-flex justify-content-between align-items-center mt-4'>
              <HeaderInfoAcademic asignature grade goTitle={gradeAssignment ? "Regresar a grados" : "Regresar a carga académica"} gradeAssignment={gradeAssignment} academicAsignatureCourseId={academicAsignatureCourseId} />
              <div>
                {academicPeriods ?
                  academicPeriods.map((item: any) => {
                    return (
                      <>
                        <button onClick={() => { return filterByPeriod(item); }} key={item?.node?.id} className={`btn ${academicPeriod.find((c: any) => { return (c === item?.node?.id) }) ? "btn-info" : "btn-outline-info"}`}
                          type="button"
                        >
                          <i className='iconsminds-pen-2'></i>{' '}
                          {item?.node?.name}
                        </button>{' '}
                      </>
                    )
                  })
                  : ''}
              </div>
            </div>
          </>
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
            // header={
            //   <>
            //     <div className='d-flex justify-content-between align-items-center mt-4'>
            //       <HeaderInfoAcademic asignature grade goTitle={gradeAssignment ? "Regresar a grados" : "Regresar a carga académica"} gradeAssignment={gradeAssignment} academicAsignatureCourseId={academicAsignatureCourseId} />
            //       <div>
            //         {academicPeriods ?
            //           academicPeriods.map((item: any) => {
            //             return (
            //               <>
            //                 <button onClick={() => { return filterByPeriod(item); }} key={item?.node?.id} className={`btn ${academicPeriod.find((c: any) => { return (c === item?.node?.id) }) ? "btn-info" : "btn-outline-info"}`}
            //                   type="button"
            //                 >
            //                   <i className='iconsminds-pen-2'></i>{' '}
            //                   {item?.node?.name}
            //                 </button>{' '}
            //               </>
            //             )
            //           })
            //           : ''}
            //       </div>
            //     </div>
            //   </>
            // }
            changeActiveDataAll={changeActiveDataAll}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Evidencias de aprendizaje',
                color: 'secondary',
                icon: 'iconsminds-library',
                action: 'goToChildrenLearning',
              },
            ]}
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
          <LearningCreateEdit
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
const mapDispatchToProps = { ...learningActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Learning);
