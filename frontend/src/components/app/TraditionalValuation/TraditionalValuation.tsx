import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Alert, Badge, Button, Input, Progress } from 'reactstrap';

import { compare, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicIndicatorActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as experienceLearningTraditionalValuationlActions from '../../../stores/actions/ExperienceLearningTraditionalValuationActions';
import { urlImages } from '../../../stores/graphql';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ExperienceLearningTraditionalValuationList = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [performanceLevelsList, setPerformanceLevelsList] = useState(null);
  const [performanceSelected, setPerformanceSelected] = useState(null);
  const [assesstmentSelected, setAssesstmentSelected] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [valuationsBase, setValuationsBase] = useState([]);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [performanceLevelType, setPerformanceLevelType] = useState(null);
  const [average, setAverage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [editPermissionTeacher, setEditPermissionTeacher] = useState(false);
  const [experienceLearning, setExperienceLearning] = useState(null);

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const learningId = params.get('learningId');
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  useEffect(() => {
    props.dataExperienceLearning(learningId).then((resp: any) => {
      setExperienceLearning(resp?.data)
    });
    props.dataAcademicAsignatureCourse(academicAsignatureCourseId).then((formData: any) => {
      if (props?.loginReducer?.teacherId == formData?.data?.teacherId) {
        setEditPermissionTeacher(true);
      }
      props.dataCourse(formData?.data?.course?.id).then((course: any) => {
        if (props?.loginReducer?.studentId?.length > 0) {
          let studentsList = course?.data?.students?.filter(
            (itemV: any) => itemV?.id == props?.loginReducer?.studentId,
          );
          setStudents(studentsList);
        } else {
          setStudents(course?.data?.students.sort(compare));
        }
      });
    });

    props.generateExperienceLearningTraditionalValuation(learningId).then((response: any) => {
      props
        .getListAllExperienceLearningTraditionalValuation(learningId)
        .then(async (listData: any) => {
          await props
            .getListAllPerformanceLevelAsignatureCourse(academicAsignatureCourseId)
            .then((levels: any) => {
              setPerformanceLevels(levels);
              let levelsOrderDesc = levels.sort(comparePerformanceLevelsTopScore);
              setMax(levelsOrderDesc[levelsOrderDesc.length - 1]?.node?.topScore);
              setMin(levelsOrderDesc[0]?.node?.minimumScore);
              setPerformanceLevelType(levelsOrderDesc[0]?.node?.type);
              setPerformanceLevelsList(
                levels.map((c: any) => {
                  return { label: c.node.name, value: c.node.id, key: c.node.id };
                }),
              );
              let progress = 0;
              let average = 0;
              if (levelsOrderDesc[0]?.node?.type == 'QUALITATIVE') {
                listData.forEach((element: any) => {
                  if (element?.node?.performanceLevel) {
                    progress++;
                    let performanceLevelIndex =
                      levels.findIndex(
                        (i: any) => i.node.id === element?.node?.performanceLevel?.id,
                      ) + 1;
                    average += performanceLevelIndex;
                  }
                });
              } else {
                listData.forEach((element: any) => {
                  if (element?.node?.assessment) {
                    progress++;
                    average += element?.node?.assessment;
                  }
                });
              }
              setProgress(progress);
              setAverage(average / progress);
              setValuations([...listData.sort(compare)]);
              setValuationsBase(JSON.parse(JSON.stringify(listData)));
            });
        });
    });
    setLoading(false);
  }, []);

  const refreshDataTable = async () => {
    await props
      .dataAcademicAsignatureCourse(academicAsignatureCourseId)
      .then(async (formData: any) => {
        await props.dataCourse(formData?.data?.course?.id).then((course: any) => {
          setStudents(course?.data?.students.sort(compare));
        });
      });
    await props
      .getListAllExperienceLearningTraditionalValuation(learningId)
      .then((listData: any) => {
        let progress = 0;
        let average = 0;
        if (performanceLevelType == 'QUALITATIVE') {
          listData.forEach((element: any) => {
            if (element?.node?.performanceLevel) {
              let performanceLevelIndex =
                performanceLevelsList.findIndex(
                  (i: any) => i.key === element?.node?.performanceLevel?.id,
                ) + 1;
              average += performanceLevelIndex;
              progress++;
            }
          });
        } else {
          listData.forEach((element: any) => {
            if (element?.node?.assessment) {
              progress++;
              average += element?.node?.assessment;
            }
          });
        }
        setProgress(progress);
        setAverage(average / progress);
        setValuations([...listData.sort(compare)]);
        setValuationsBase(JSON.parse(JSON.stringify(listData)));
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
      return perf;
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
    const elementIndex = valuations.findIndex((obj) => {
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

  const saveBlurQuantitative = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if (
      valuationsBase[elementIndex].node.performanceLevel?.id !== item?.node?.performanceLevel?.id ||
      valuationsBase[elementIndex].node.assessment !== item?.node?.assessment
    ) {
      let obj = {
        assessment: item?.node?.assessment,
        performanceLevelId: item?.node?.performanceLevel ? item?.node?.performanceLevel?.id : null,
      };
      if (obj?.assessment != null && obj?.assessment != undefined) {
        await props.updateExperienceLearningTraditionalValuation(obj, item.node.id).then(
          () => {
            createNotification('success', 'success', '');
            refreshDataTable();
          },
          () => {
            createNotification('error', 'error', '');
          },
        );
      } else {
        createNotification('error', 'error', '');
      }
    }
  };

  const saveBlurQualitative = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if (
      valuationsBase[elementIndex].node.performanceLevel?.id !== item?.node?.performanceLevel?.id ||
      valuationsBase[elementIndex].node.assessment !== item?.node?.assessment
    ) {
      let obj = {
        assessment: item?.node?.assessment,
        performanceLevelId: item?.node?.performanceLevel ? item?.node?.performanceLevel?.id : null,
      };
      if (obj?.performanceLevelId != null && obj?.performanceLevelId != undefined) {
        await props.updateExperienceLearningTraditionalValuation(obj, item.node.id).then(
          () => {
            createNotification('success', 'success', '');
            refreshDataTable();
          },
          () => {
            createNotification('error', 'error', '');
          },
        );
      } else {
        createNotification('error', 'error', '');
      }
    }
  };

  const setAllQualitative = async () => {
    setLoading(true);
    let promisesList: any[] = [];
    let perf;
    if (assesstmentSelected) {
      perf = performanceLevels?.find((c: any) => {
        return assesstmentSelected <= c.node.topScore && assesstmentSelected >= c.node.minimumScore;
      });
    }
    let obj = {
      assessment: assesstmentSelected,
      performanceLevelId: performanceSelected ? performanceSelected?.value : perf?.node?.id,
    };
    if (obj?.performanceLevelId != null && obj?.performanceLevelId != undefined) {
      for (const item of valuations) {
        promisesList.push(props.updateExperienceLearningTraditionalValuation(obj, item.node.id));
      }
      await Promise.all(promisesList).then(() => {
        createNotification('success', 'success', '');
        setValuations([]);
        refreshDataTable();
        setAssesstmentSelected(null);
        setPerformanceSelected(null);
        setLoading(false);
      });
    } else {
      createNotification('error', 'error', '');
    }
  };

  const setAllQuantitative = async () => {
    setLoading(true);
    let promisesList: any[] = [];
    let perf;
    if (assesstmentSelected) {
      perf = performanceLevels?.find((c: any) => {
        return assesstmentSelected < c.node.topScore && assesstmentSelected >= c.node.minimumScore;
      });
      if (perf === undefined) {
        perf = performanceLevels?.find((c: any) => {
          return assesstmentSelected <= c.node.topScore && assesstmentSelected > c.node.minimumScore;
        });
      }
    }
    let obj = {
      assessment: assesstmentSelected,
      performanceLevelId: performanceSelected ? performanceSelected?.value : perf?.node?.id,
    };
    if (obj?.assessment != null && obj?.assessment != undefined) {
      for (const item of valuations) {
        promisesList.push(props.updateExperienceLearningTraditionalValuation(obj, item.node.id));
      }
      await Promise.all(promisesList).then(() => {
        createNotification('success', 'success', '');
        setValuations([]);
        refreshDataTable();
        setAssesstmentSelected(null);
        setPerformanceSelected(null);
        setLoading(false);
      });
    } else {
      createNotification('error', 'error', '');
    }
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Valoración tradicional</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <HeaderInfoAcademic
          asignature
          grade
          course
          modality
          experienceLearnig
          goTitle="Regresar a experiencias de aprendizaje"
          experienceLearnigId={learningId}
          academicAsignatureCourseId={academicAsignatureCourseId}
        />
        <>
          {performanceLevelType === 'QUALITATIVE' ? (
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
            </div>
          ) : performanceLevelType === 'QUANTITATIVE' ? (
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
            </div>
          ) : (
            <></>
          )}
        </>
      </div>
      <div className="d-flex justify-content-start align-items-center">
        {!props?.loginReducer?.studentId && (
          <div className="d-flex justify-content-start align-items-center mb-3 w-30">
            {experienceLearning?.academicPeriod && (new Date(experienceLearning?.academicPeriod?.startDate) <= new Date() && new Date(experienceLearning?.academicPeriod?.endDate) >= new Date()) ?
              <>
                {performanceLevelType == 'QUANTITATIVE' ? (
                  <Input
                    type="number"
                    placeholder="Nota..."
                    className="form-control w-30"
                    onInput={(e: any) => {
                      if (e.target.value < min || e.target.value > max) {
                        e.target.value = null;
                      }
                      setAssesstmentSelected(e.target.value);
                    }}
                    step="1"
                    min={min}
                    max={max}
                    disabled={!editPermissionTeacher}
                  />
                ) : (
                  <Select
                    isClearable
                    placeholder="Nota..."
                    className="react-select"
                    classNamePrefix="react-select"
                    options={performanceLevelsList}
                    onChange={(selectedOption: any) => {
                      setPerformanceSelected(selectedOption);
                    }}
                    isDisabled={!editPermissionTeacher}
                  />
                )}
                <Button
                  className="ml-2 btn-outline-info"
                  size="xs"
                  onClick={() => {
                    performanceLevelType === 'QUALITATIVE' ? setAllQualitative() : setAllQuantitative();
                  }}
                  disabled={!editPermissionTeacher}
                >
                  Aplicar a todos
                </Button>
              </> :
              <Alert color="danger">
                Periodo Académico Finalizado
              </Alert>}
          </div>)}
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
      ) : (
        <>
          {valuations !== null && students !== null ? (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Código</th>
                    <th className="text-center">Estudiante</th>
                    <th className="text-center">Valoración</th>
                    <th className="text-center">Nivel de desempeño</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, indexE: any) => {
                    let valuation = valuations?.filter(
                      (itemV: any) => itemV?.node?.studentId == itemStudent?.id,
                    );
                    return (
                      <>
                        <tr key={indexE}>
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
                                      ? itemStudent?.user?.lastName + ' ' + itemStudent?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {itemStudent?.user?.lastName} {itemStudent?.user?.name}
                              </span>
                            </div>
                          </td>
                          {valuation?.map((item: any, index: any) => {
                            return (
                              <>
                                <td className="text-center vertical-middle">
                                  {performanceLevelType === 'QUALITATIVE' ? (
                                    <Select
                                      //isClearable
                                      placeholder={<IntlMessages id="forms.select" />}
                                      className="react-select"
                                      classNamePrefix="react-select"
                                      options={performanceLevelsList}
                                      value={{
                                        label: item?.node?.performanceLevel?.name,
                                        key: item?.node?.performanceLevel?.id,
                                        value: item?.node?.performanceLevel?.id,
                                      }}
                                      onChange={(selectedOption: any) => {
                                        item.node.assessment = undefined;
                                        item.node.performanceLevel = {
                                          id: selectedOption?.key,
                                          name: selectedOption?.label,
                                        };
                                        saveBlurQualitative(item);
                                      }}
                                      isDisabled={!editPermissionTeacher || !(new Date(experienceLearning?.academicPeriod?.startDate) <= new Date() && new Date(experienceLearning?.academicPeriod?.endDate) >= new Date())}
                                    />
                                  ) : performanceLevelType === 'QUANTITATIVE' ? (
                                    <Input
                                      type="number"
                                      onBlur={(event: any) => {
                                        return saveBlurQuantitative(item);
                                      }}
                                      onInput={(e: any) => {
                                        if (e.target.value < min || e.target.value > max) {
                                          e.target.value = null;
                                        }
                                        return getPerformanceLevel(e, item);
                                      }}
                                      {...item?.node?.assessment}
                                      defaultValue={item?.node?.assessment}
                                      className={
                                        item?.node?.assessment
                                          ? 'border-green form-control'
                                          : 'form-control'
                                      }
                                      disabled={!editPermissionTeacher || !(new Date(experienceLearning?.academicPeriod?.startDate) <= new Date() && new Date(experienceLearning?.academicPeriod?.endDate) >= new Date())}
                                      min={min}
                                      max={max}
                                    />
                                  ) : (
                                    ''
                                  )}
                                </td>
                                {valuations[0]?.performanceLevel?.type == 'QUALITATIVE' ? (
                                  ''
                                ) : (
                                  <td className="text-center vertical-middle">
                                    <StyledBadge
                                      color="primary"
                                      className="font-0-8rem"
                                      background={
                                        item?.node?.performanceLevel?.colorHex
                                          ? `${item?.node?.performanceLevel?.colorHex}`
                                          : '#00cafe'
                                      }
                                    >
                                      {item?.node?.performanceLevel?.name}
                                    </StyledBadge>
                                  </td>
                                )}
                              </>
                            );
                          })}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};
const mapDispatchToProps = {
  ...courseActions,
  ...performanceLevelActions,
  ...experienceLearningTraditionalValuationlActions,
  ...academicIndicatorActions,
  ...experienceLearningActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningTraditionalValuationList);
