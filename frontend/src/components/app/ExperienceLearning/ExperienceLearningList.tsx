import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Progress } from 'reactstrap';

import { COLUMN_LIST } from '../../../constants/ExperienceLearning/experienceLearningConstants';
import { calculateDaysTwoDate } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ExperienceLearningCreateEdit from './ExperienceLearningCreateEdit';

const ExperienceLearningList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [academicPeriod, setAcademicPeriod] = useState(null);
  const [role, setRole] = useState(null);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');

  const [data, setData] = useState(null);
  useEffect(() => {
    setRole(props?.loginReducer?.role?.name);
    // props
    //   .getListAllExperienceLearning(props?.loginReducer?.campusId, academicAsignatureCourseId)
    //   .then((listData: any) => {
    //     setDataTable(listData.map((c: any) => {
    //       c.node.academicPeriod_format = c?.node?.academicPeriod ? c?.node?.academicPeriod?.name : '';
    //       return c;
    //     }));
    props
      .getAcademicPeriodsExperienceLearning(
        props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear,
      )
      .then((listData: any) => {
        setAcademicPeriods(listData);
        const date = new Date();
        let filter = false;
        listData.forEach((academicPeriod: any) => {
          const endDate = new Date(academicPeriod.node.endDate)
          const startDate = new Date(academicPeriod.node.startDate)
          if (date <= endDate && date >= startDate) {
            filterByPeriod(academicPeriod);
            filter = true;
          }
        });
        if (!filter) {
          filterByPeriod(null)
        }
      });
    // })
  }, []);

  const getDataTable = async (idAcademicPeriod: any = null) => {
    if (props?.loginReducer?.campusId?.length > 0) {
      props
        .getListAllExperienceLearning(
          props?.loginReducer?.campusId,
          academicAsignatureCourseId,
          idAcademicPeriod ? idAcademicPeriod : undefined,
          "NORMAL"
        )
        .then((listData: any) => {
          setDataTable(listData.map((c: any) => {
            c.node.academicPeriod_format = c?.node?.academicPeriod ? c?.node?.academicPeriod?.name : '';
            return c;
          }))
        });
    } else {
      props
        .getAllExperienceLearningWhitoutCampusId(
          academicAsignatureCourseId,
          idAcademicPeriod ? idAcademicPeriod : undefined,
          "NORMAL"
        )
        .then((listData: any) => {
          setDataTable(listData.map((c: any) => {
            c.node.academicPeriod_format = c?.node?.academicPeriod ? c?.node?.academicPeriod?.name : '';
            return c;
          }))
        });
    }
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewExperienceLearning(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateExperienceLearning(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataExperienceLearning(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveExperienceLearning(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteExperienceLearning(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteExperienceLearning(item.id, false).then(
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
      await props.changeActiveExperienceLearning(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const filterByPeriod = async (item: any) => {
    setAcademicPeriod(item?.node?.id === academicPeriod?.node?.id ? null : item);
    if (item && item?.node?.id !== academicPeriod?.node?.id) {
      const today = new Date();
      const startDate = new Date(item?.node?.startDate);
      const endDate = new Date(item?.node?.endDate);
      const totalDays = calculateDaysTwoDate(startDate, endDate);
      let countDays = totalDays;
      if (today < endDate && today > startDate) {
        countDays = calculateDaysTwoDate(startDate, new Date());
      }
      setDateProgress({ startDate, endDate, totalDays, countDays })
    } else {
      setDateProgress({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
    }
    setDataTable(null);
    await getDataTable(item?.node?.id);
  };

  const goTo = async (url: string) => {
    navigate(url);
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'TRADITIONALVALUATION':
        goToChildren(
          `/traditionalValuation?learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`,
        );
        break;
      case 'SELFAPPRAISAL':
        goToChildren(
          `/selfValuation?learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`,
        );
        break;
      case 'VALUATIONRUBRIC':
        if (btn.type === 'CRITERIA') {
          goToChildren(
            `/rubricCriteria?learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`,
          );
        } else {
          goToChildren(
            `/rubricValuation?learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`,
          );
        }
        break;
      case 'COEVALUATION':
        goToChildren(
          role !== 'ESTUDIANTE'
            ? `/coEvaluation?courseId=${item?.academicAsignatureCourse?.courseId}&learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`
            : `/coEvaluationStudents?courseId=${item?.academicAsignatureCourse?.courseId}&learningId=${item?.id}&academicAsignatureCourseId=${item?.academicAsignatureCourseId}`,
        );
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
          <div className="d-flex justify-content-between mt-0 align-items-center">
            <HeaderInfoAcademic
              asignature
              grade
              goTitle="Regresar a asignación académica"
              academicAsignatureCourseId={academicAsignatureCourseId}
            />
            <div >
              <div className="d-flex justify-content-start align-items-center" >
                {academicPeriods
                  ? academicPeriods?.map((item: any) => {
                    return (
                      <>
                        <button
                          onClick={() => {
                            return filterByPeriod(item);
                          }}
                          key={item?.node?.id}
                          className={`ml-1 btn ${academicPeriod?.node?.id === item?.node?.id
                            ? 'btn-info'
                            : 'btn-outline-info'
                            }`}
                          type="button"
                        >
                          <i className="iconsminds-pen-2"></i> {item?.node?.name}
                        </button>{' '}
                      </>
                    );
                  })
                  : ''}
              </div>
              {dateProgress.startDate != null ?
                <>
                  <div className="d-flex justify-content-start align-items-center mt-2 w-100">
                    <div className="text-center">
                      Progreso: {' '}
                    </div>
                    <Progress
                      className="ml-2"
                      bar
                      color="primary"
                      value={dateProgress.countDays > 0 ? ((dateProgress.countDays / dateProgress.totalDays) * 100) : 0}
                    > ({dateProgress.countDays}/{dateProgress.totalDays}) {dateProgress.countDays > 0 ? ((dateProgress.countDays / dateProgress.totalDays) * 100).toFixed(0) : 0}%</Progress>
                  </div>
                  <div className="d-flex justify-content-start align-items-center mt-2 w-100">
                    <div className="text-center w-50">
                      Fecha Inicio: {' ' + moment(dateProgress.startDate).format("YYYY-MM-DD")}
                    </div>
                    <div className="text-center w-50">
                      Fecha Fin: {' ' + moment(dateProgress.endDate).format("YYYY-MM-DD")}
                    </div>
                  </div>
                </>
                : ""}
            </div>
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
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Coevaluación',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'COEVALUATION',
              },
              {
                id: 1,
                label: 'Autoevaluación',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'SELFAPPRAISAL',
              },
              {
                id: 2,
                label: 'Valoración tradicional',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'TRADITIONALVALUATION',
              },
              {
                id: 3,
                label: 'Rúbrica de valoración',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'VALUATIONRUBRIC',
                type: 'RUBRIC',
              },
              {
                id: 4,
                label: 'Criterios de rúbrica',
                color: 'warning',
                icon: 'iconsminds-pen-2',
                action: 'VALUATIONRUBRIC',
                type: 'CRITERIA',
              },
              {
                id: 5,
                label: 'Prueba en Línea',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'ONLINETEST',
              },
            ]}
            withChildren={true}
            filterChildren={'experienceType'}
            refreshDataTable={refreshDataTable}
          />
          <ExperienceLearningCreateEdit
            experienceLearningType={"NORMAL"}
            data={data}
            isLg={true}
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
const mapDispatchToProps = { ...experienceLearningActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceLearningList);
