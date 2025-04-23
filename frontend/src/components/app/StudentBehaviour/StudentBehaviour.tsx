import moment from 'moment';
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { Badge, Button, Input, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicAsignatureCouseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as componentEvaluativeActions from '../../../stores/actions/ComponentEvaluativeActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import * as experienceLearningSelfActions from '../../../stores/actions/ExperienceLearningSelfAssessmentValuationActions';
import * as experienceLearningTraditionalActions from '../../../stores/actions/ExperienceLearningTraditionalValuationActions';
import * as studentBehaviourActions from '../../../stores/actions/StudentBehaviourActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const StudentBehaviour = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [performanceLevelsList, setPerformanceLevelsList] = useState(null);
  const [performanceLevelType, setPerformanceLevelType] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);
  const [asignatures, setAsignatures] = useState(null);
  const [areas, setAreas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormEnabled, setIsFormEnabled] = useState(true);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });
  const [valuations, setValuations] = useState(null);
  const [notes, setNotes] = useState([]);
  const [average, setAverage] = useState(null);
  const [averages, setAverages] = useState([]);
  const [averagesFinal, setAveragesFinal] = useState([]);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  const [assesstmentSelected, setAssesstmentSelected] = useState(null);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [performanceSelected, setPerformanceSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const [valuationsBase, setValuationsBase] = useState([]);

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [data, setData] = useState(null);
  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return (submenus = submenus.concat(c.menuItemsLogin));
    });
    let cm = submenus.find((c: any) => {
      return currentUrl.includes(c?.module?.url);
    });
    // if (cm && cm.readAction) {
    //   setCurrentMenu(cm);
    // } else {
    //   history(`/home`);
    //   createNotification('warning', 'notPermissions', '');
    // }
    props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
      await setCurrentAcademicPeriod(period);
      if (period) {
        const today = new Date();
        const startDate = new Date(period.startDate);
        const endDate = new Date(period?.endDate);
        const totalDays = calculateDaysTwoDate(startDate, endDate);
        let countDays = totalDays;
        if (today < endDate && today > startDate) {
          countDays = calculateDaysTwoDate(startDate, new Date());
        }
        setDateProgress({ startDate, endDate, totalDays, countDays })
      }
      getSpreadsheet(period?.id);
    });
  }, []);

  const getSpreadsheet = async (periodId: any) => {
    setLoading(true);
    await props.dataCourse(courseId).then(async (course: any) => {
      setStudents(course?.data?.students.sort(compare));
      let obj: any = [];
      let nts: any = [];
      let avrgs: any = [];
      let avrgsFinal: any = [];
      let levels: any = [];

      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (academicPeriods: any) => {
          setAcademicPeriods(academicPeriods);
          let promisesList: any[] = [];
          if (periodId) {
            await props.createPeriodStudentBehaviour(periodId, courseId).then(async (listData: any) => {
              await props
                .getAllStudentBehaviour(periodId, courseId)
                .then(async (notesFinal: any) => {
                  await props
                    .getListAllPerformanceLevelCourseFinal(courseId)
                    .then((dataLevels: any) => {
                      setPerformanceLevels(dataLevels);
                      let levelsOrderDesc = levels.sort(comparePerformanceLevelsTopScore);
                      setMax(levelsOrderDesc[levelsOrderDesc.length - 1]?.node?.topScore);
                      setMin(levelsOrderDesc[0]?.node?.minimumScore);
                      levels = dataLevels;
                      setPerformanceLevelType(dataLevels[0]?.node?.type);
                      setPerformanceLevelsList(
                        levels.map((c: any) => {
                          return { label: c.node.name, value: c.node.id, key: c.node.id };
                        }),
                      );
                      avrgsFinal = avrgsFinal.concat(notesFinal.data.edges);
                      setValuations(avrgsFinal);
                      setLoading(false);
                      let progress = 0;
                      let average = 0;
                      if (levelsOrderDesc[0]?.node?.type == "QUALITATIVE") {
                        avrgsFinal.forEach((element: any) => {
                          if (element?.node?.performanceLevel) {
                            progress++;
                            let performanceLevelIndex = levels.findIndex((i: any) => i.node.id === element?.node?.performanceLevel?.id) + 1;
                            average += performanceLevelIndex;
                          }
                        });
                      } else {
                        avrgsFinal.forEach((element: any) => {
                          if (element?.node?.assessment) {
                            progress++;
                            average += element?.node?.assessment;
                          }
                        });
                      }
                      setProgress(progress);
                      setAverage(average / progress);
                      setValuations([...avrgsFinal.sort(compare)]);
                      setValuationsBase(JSON.parse(JSON.stringify(avrgsFinal)));
                    });
                });
            });

          } else {
            setLoading(false);
          }
        });
    });
  };

  const getPerformanceLevelAverage = (average: any) => {
    let perf = null;
    if (average) {
      if (average > 0) {
        perf = performanceLevels?.find((c: any) => {
          return average < c.node.topScore && average >= c.node.minimumScore;
        });
        if (perf === undefined) {
          perf = performanceLevels?.find((c: any) => {
            return average <= c.node.topScore && average > c.node.minimumScore;
          });
        }
      }
      return perf
    }
  }

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if ((valuationsBase[elementIndex].node.performanceLevel?.id !== item?.node?.performanceLevel?.id) || (valuationsBase[elementIndex].node.assessment !== item?.node?.assessment)) {
      let obj = {
        assessment: item?.node?.assessment,
        performanceLevelId: item?.node?.performanceLevel ? item?.node?.performanceLevel?.id : null
      };
      await props.updateStudentBehaviour(obj, item.node.id).then(
        () => {
          createNotification('success', 'success', '');
          getSpreadsheet(currentAcademicPeriod?.id?.toString());
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
  };

  const saveBlurObservation = async (item: any, event: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if ((valuationsBase[elementIndex].node.observation !== event.target.value)) {
      let obj = {
        observation: event.target.value,
      };
      if (obj?.observation?.length == 0) {
        obj.observation = null;
      }
      await props.updateStudentBehaviourObservation(obj, item.node.id).then(
        () => {
          createNotification('success', 'success', '');
          getSpreadsheet(currentAcademicPeriod?.id?.toString());
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
  };

  const getPerformanceLevel = async (e: any, valuation: any) => {
    let perf = null;
    if (e.target.value.length > 0) {
      perf = performanceLevels?.find((c: any) => {
        return e.target.value < c.node.topScore && e.target.value >= c.node.minimumScore;
      });
      if (perf === undefined) {
        perf = performanceLevels?.find((c: any) => {
          return e.target.value <= c.node.topScore && e.target.value > c.node.minimumScore;
        });
      }
    }
    const elementIndex = valuations.findIndex((obj: any) => {
      return obj.node.id === valuation.node.id;
    });
    if (perf) {
      valuations[elementIndex].node.performanceLevel = perf.node;
    } else {
      valuations[elementIndex].node.performanceLevel = null;
    }
    valuations[elementIndex].node.assessment = e.target.value;
    const arr = Object.assign([], valuations);
    setValuations(arr);
  };


  const setAll = async () => {
    setLoading(true);
    let promisesList: any[] = [];
    let perf;
    if (assesstmentSelected) {
      perf = performanceLevels?.find((c: any) => {
        return assesstmentSelected <= c.node.topScore && assesstmentSelected >= c.node.minimumScore;
      });
    }
    let obj = {
      assessment: assesstmentSelected || 0,
      performanceLevelId: performanceSelected ? performanceSelected?.value : perf?.node?.id
    };
    for (const item of valuations) {
      promisesList.push(props.updateStudentBehaviour(obj, item.node.id))
    }
    await Promise.all(promisesList).then(() => {
      createNotification('success', 'success', '');
      setValuations([])
      getSpreadsheet(currentAcademicPeriod?.id?.toString());
      setAssesstmentSelected(null);
      setPerformanceSelected(null);
      setLoading(false);
    });
  }

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Comportamiento Escolar</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality goTitle="Regresar a Asignacion Academica" courseId={courseId} />
        <div>
          <div className="d-flex justify-content-start align-items-center" >
            {academicPeriods
              ? academicPeriods.map((item: any) => {
                return (
                  <>
                    <button
                      onClick={() => {
                        setCurrentAcademicPeriod(item?.node);
                        const today = new Date();
                        const startDate = new Date(item?.node?.startDate);
                        const endDate = new Date(item?.node?.endDate);
                        const totalDays = calculateDaysTwoDate(startDate, endDate);
                        let countDays = totalDays;
                        if (today < endDate && today > startDate) {
                          countDays = calculateDaysTwoDate(startDate, new Date());
                        }
                        setDateProgress({ startDate, endDate, totalDays, countDays })
                        return getSpreadsheet(item?.node?.id);
                      }}
                      key={item?.node?.id}
                      className={`ml-1 btn ${currentAcademicPeriod?.id === item?.node?.id
                        ? 'btn-info'
                        : 'btn-outline-info'
                        }`}
                      type="button"
                    >
                      <i className="iconsminds-pen-2"></i> {item?.node?.name}
                    </button>{'  '}
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
        <>
          {performanceLevelType === "QUALITATIVE" ?
            <div className="w-15">
              <table className="table table-striped mb-0">
                <tbody>
                  <tr>
                    <td>
                      <strong>Nivel de desempeño</strong>
                    </td>
                  </tr>
                  {performanceLevels?.map((e: any) => {
                    return (
                      <tr>
                        <td> {`${e?.node?.name}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div> : performanceLevelType === "QUANTITATIVE" ?
              <div className="w-30">
                <table className="table table-striped mb-0">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Nivel de desempeño</strong>
                      </td>
                      <td>
                        <strong>Minimo</strong>
                      </td>
                      <td>
                        <strong>Maximo</strong>
                      </td>
                    </tr>
                    {performanceLevels?.map((e: any) => {
                      return (
                        <tr>
                          <td> {`${e?.node?.name}`}</td>
                          <td> {`${e?.node?.minimumScore}`} </td>
                          <td> {`${e?.node?.topScore}`} </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> : <></>}
        </>
      </div>
      <div className="d-flex justify-content-start align-items-center" >
        <div className="d-flex justify-content-start align-items-center mb-3 w-30">
          {
            performanceLevelType == 'QUANTITATIVE' ?
              <Input
                type="number"
                placeholder='Nota...'
                className="form-control w-30"
                onInput={(e: any) => {
                  if (e.target.value < min || e.target.value > max) {
                    e.target.value = null;
                  }
                  setAssesstmentSelected(e.target.value);
                }}
                step="0.1"
              />
              :
              <Select
                isClearable
                placeholder='Nota...'
                className="react-select"
                classNamePrefix="react-select"
                options={performanceLevelsList}
                onChange={(selectedOption: any) => {
                  setPerformanceSelected(selectedOption);
                }}
              />}
          <Button
            className="ml-2 btn-outline-info"
            size="xs"
            onClick={() => {
              setAll();
            }}
          >
            Aplicar a todos
          </Button>

        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-40">
          {/* <div className="text-center mr-1">
            Valoración Promedio:
          </div>
          {performanceLevelType == 'QUANTITATIVE' ?
            <>
              <CountUp
                start={0}
                preserveValue={true}
                end={valuations?.length > 0 ? average : 0}
                decimals={1}
                decimal={","}
                className="font-weight-bold"
              />
              <StyledBadge color="primary" className="font-0-8rem ml-2" background={getPerformanceLevelAverage(average)?.node?.colorHex ? `${getPerformanceLevelAverage(average)?.node?.colorHex}` : "#00cafe"}>
                {getPerformanceLevelAverage(average) ? getPerformanceLevelAverage(average)?.node.name : ""}
              </StyledBadge>
            </> :
            <>
              <StyledBadge color="primary" className="font-0-8rem ml-2" background={average > 0 ? `${performanceLevels[Math.trunc(average) - 1]?.node?.colorHex}` : "#00cafe"}>
                {average > 0 ? performanceLevels[Math.trunc(average) - 1]?.node.name : ""}
              </StyledBadge>
            </>
          } */}
        </div>
        <div className="d-flex justify-content-start align-items-center mb-3 w-30">
          {/* <div className="text-center mr-1">
            Progreso de Valoración:
          </div>
          <Progress
            bar
            color="primary"
            value={valuations?.length > 0 ? ((progress / valuations?.length) * 100) : 0}
          > ({progress}/{valuations?.length}) {valuations?.length > 0 ? ((progress / valuations?.length) * 100).toFixed(2) : 0}%</Progress> */}
        </div>
      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : valuations != null ? (
        <>
          {students !== null ? (
            <div style={{ overflow: "scroll" }}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Código
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Estudiante
                    </th>
                    <th className="text-center">Valoración</th>
                    <th className="text-center">Observaciones</th>
                    <th className="text-center">Nivel de desempeño</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, index: any) => {
                    let studentBehaviour = valuations?.filter((itemV: any) => itemV?.node?.studentId == itemStudent?.id.toString());
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{itemStudent?.code}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-start">
                              {itemStudent?.user?.urlPhoto ? (
                                <ThumbnailImage
                                  rounded
                                  src={itemStudent?.user?.urlPhoto}
                                  alt="profile"
                                  className="xsmall mr-3"
                                />
                              ) : (
                                <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                  {getInitialsName(
                                    itemStudent?.user
                                      ? itemStudent?.user?.lastName +
                                      ' ' +
                                      itemStudent?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {itemStudent?.user?.lastName} {itemStudent?.user?.name}
                              </span>
                            </div>
                          </td>
                          {studentBehaviour?.map((item: any, index: any) => {
                            return (
                              <>
                                <td className="text-center vertical-middle">
                                  {
                                    performanceLevelType === "QUALITATIVE" ?
                                      <Select
                                        //isClearable
                                        placeholder={<IntlMessages id="forms.select" />}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={performanceLevelsList}
                                        value={{ label: item?.node?.performanceLevel?.name, key: item?.node?.performanceLevel?.id, value: item?.node?.performanceLevel?.id }}
                                        onChange={(selectedOption: any) => {
                                          item.node.assessment = undefined;
                                          item.node.performanceLevel = { id: selectedOption?.key, name: selectedOption?.label }
                                          saveBlur(item);
                                        }}
                                      /> : performanceLevelType === "QUANTITATIVE" ?
                                        <Input
                                          type="number"
                                          onBlur={(event: any) => {
                                            return saveBlur(item);
                                          }}
                                          onInput={(e: any) => {
                                            if (e.target.value < min || e.target.value > max) {
                                              e.target.value = null;
                                            }
                                            return getPerformanceLevel(e, item);
                                          }}
                                          {...item?.node?.assessment}
                                          defaultValue={item?.node?.assessment}
                                          className={item?.node?.assessment ? 'border-green form-control' : 'form-control'}
                                        /> : ""
                                  }
                                </td>
                                <td>
                                  <Input
                                    type="textarea"
                                    rows="2"
                                    onBlur={(event: any) => {
                                      return saveBlurObservation(item, event);
                                    }}
                                    {...item?.node?.observation}
                                    defaultValue={item?.node?.observation}
                                    className={item?.node?.observation ? 'border-green form-control' : 'form-control'}
                                  />
                                </td>
                                {
                                  valuations[0]?.performanceLevel?.type == 'QUALITATIVE' ?
                                    '' :
                                    <td className="text-center vertical-middle">
                                      <StyledBadge color="primary" className="font-0-8rem" background={item?.node?.performanceLevel?.colorHex ? `${item?.node?.performanceLevel?.colorHex}` : "#00cafe"} >
                                        {item?.node?.performanceLevel?.name}
                                      </StyledBadge>
                                    </td>
                                }
                              </>
                            );
                          })}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

const mapDispatchToProps = {
  ...experienceLearningActions,
  ...courseActions,
  ...componentEvaluativeActions,
  ...academicPeriodActions,
  ...valuationsActions,
  ...experienceLearningSelfActions,
  ...experienceLearningCoEvaluationActions,
  ...experienceLearningTraditionalActions,
  ...performanceLevelActions,
  ...academicAsignatureCouseActions,
  ...studentBehaviourActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentBehaviour);