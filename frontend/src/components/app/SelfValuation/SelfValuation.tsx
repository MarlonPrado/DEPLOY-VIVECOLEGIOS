/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import CountUp from 'react-countup';
import { Badge, Input, Progress } from 'reactstrap';
import { compare, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningSelfAssessmentValuationActions from '../../../stores/actions/ExperienceLearningSelfAssessmentValuationActions';
import { urlImages } from '../../../stores/graphql';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ExperienceLearningSelfAssessmentValuationList = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [criteriaPerformances, setCriteriaPerformances] = useState([]);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [valuationsBase, setValuationsBase] = useState([]);
  const [average, setAverage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [performanceLevelsList, setPerformanceLevelsList] = useState(null);

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const learningId = params.get('learningId');
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const [loading, setLoading] = useState(true);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });

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
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }
    props.generateExperienceLearningSelfAssessmentValuation(learningId).then((response: any) => {
      props
        .getListAllExperienceLearningSelfAssessmentValuation(
          learningId,
          cm?.createAction ? props?.loginReducer?.entityId : undefined,
        )
        .then(async (listData: any) => {
          // get performance levels
          await props
            .getListAllPerformanceLevelAsignatureCourse(academicAsignatureCourseId)
            .then((levels: any) => {
              setPerformanceLevels(levels);
              let levelsOrderDesc = levels.sort(comparePerformanceLevelsTopScore);
              setMax(levelsOrderDesc[levelsOrderDesc.length - 1]?.node?.topScore);
              setMin(levelsOrderDesc[0]?.node?.minimumScore);
              setPerformanceLevelsList(
                levels.map((c: any) => {
                  return { label: c.node.name, value: c.node.id, key: c.node.id };
                }),
              );
            });
          let progress = 0;
          let average = 0;
          listData.forEach((element: any) => {
            if (element?.node?.assessment) {
              progress++;
              average += element?.node?.assessment;
            }
          });
          setProgress(progress);
          setAverage(average / listData.length);
          setValuations([...listData.sort(compare)]);
          setValuationsBase(JSON.parse(JSON.stringify(listData)));
        });
    });
    setLoading(false);
  }, []);

  const refreshDataTable = async () => {
    setValuations(null);
    props
      .getListAllExperienceLearningSelfAssessmentValuation(
        learningId,
        currentMenu?.createAction ? props?.loginReducer?.entityId : undefined,
      )
      .then(async (listData: any) => {
        let progress = 0;
        let average = 0;
        listData.forEach((element: any) => {
          if (element?.node?.assessment) {
            progress++;
            average += element?.node?.assessment;
          }
        });
        setProgress(progress);
        setAverage(average / listData.length);
        setValuations([...listData.sort(compare)]);
        setValuationsBase(JSON.parse(JSON.stringify(listData)));
      });
  };

  const getPerformanceLevel = async (e: any, valuation: any) => {
    let perf = performanceLevels?.find((c: any) => {
      return e.target.value < c.node.topScore && e.target.value >= c.node.minimumScore;
    });
    if (perf === undefined) {
      perf = performanceLevels?.find((c: any) => {
        return e.target.value <= c.node.topScore && e.target.value > c.node.minimumScore;
      });
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

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if (valuationsBase[elementIndex].node.assessment != item?.node?.assessment) {
      let obj = {
        assessment: item?.node?.assessment,
        observations: item?.node?.observations,
        performanceLevelId: item?.node?.performanceLevel?.id
      };
      await props.updateExperienceLearningSelfAssessmentValuation(obj, item.node.id).then(
        () => {
          createNotification('success', 'success', '');
          refreshDataTable();
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
  };

  const saveBlurObservations = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj.node.id === item.node.id;
    });
    if (valuationsBase[elementIndex].node.observations != item?.node?.observations) {
      let obj = {
        assessment: item?.node?.assessment,
        observations: item?.node?.observations,
        performanceLevelId: item?.node?.performanceLevel?.id
      };
      await props.updateExperienceLearningSelfAssessmentValuation(obj, item.node.id).then(
        () => {
          createNotification('success', 'success', '');
          refreshDataTable();
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Autoevaluación</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <HeaderInfoAcademic asignature grade course modality experienceLearnig goTitle="Regresar a experiencias de aprendizaje" experienceLearnigId={learningId} academicAsignatureCourseId={academicAsignatureCourseId} />
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
      </div>
      {!currentMenu?.updateAction ?
        <div className="d-flex justify-content-between align-items-center" >
          <div className="d-flex justify-content-center align-items-center mb-3 w-40">
            {/* <div className="text-center mr-1">
              Valoración Promedio:
            </div>
            <CountUp
              start={0}
              preserveValue={true}
              end={valuations?.length > 0 ? average : 0}
              decimals={1}
              decimal={","}
            /> */}

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
        </div> : ''}

      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          {valuations !== null ? (
            <>
              {criteriaPerformances.map((item: any, index: any) => {
                return (
                  <div key={index} className="form-group">
                    <span>{item?.performanceLevel?.name}</span>
                    <span>{item?.criteria}</span>
                  </div>
                );
              })}
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Código</th>
                    <th className="text-center">Estudiante</th>
                    <th className="text-center">Valoración</th>
                    <th className="text-center">Observación</th>
                    <th className="text-center">Nivel de desempeño</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((item: any, index: any) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{item?.node?.student?.code}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-start">
                              {item?.node?.student?.user?.profilePhoto ? (
                                <ThumbnailImage
                                  rounded
                                  src={urlImages + item?.node?.student?.user?.profilePhoto}
                                  alt="profile"
                                  className="xsmall mr-3"
                                />
                              ) : (
                                <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                  {getInitialsName(
                                    item?.node?.student
                                      ? item?.node?.student?.user?.lastName +
                                      ' ' +
                                      item?.node?.student?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {item?.node?.student?.user?.lastName} {item?.node?.student?.user?.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-center vertical-middle">
                            {currentMenu?.updateAction ? (
                              <>
                                {
                                  valuations[0]?.performanceLevel?.type == 'QUALITATIVE' ?
                                    <Select
                                      isClearable
                                      placeholder={<IntlMessages id="forms.select" />}
                                      className="react-select"
                                      classNamePrefix="react-select"
                                      options={performanceLevelsList}
                                      value={{ label: item?.performanceLevel?.name, key: item?.performanceLevel?.id, value: item?.performanceLevel?.id }}
                                      onChange={(selectedOption: any) => {
                                        item.assessment = 0;
                                        saveBlur(item);
                                      }}
                                    /> :
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
                                    />
                                }
                              </>
                            ) : (
                              <span>{item?.node?.assessment}</span>
                            )}
                          </td>
                          <td className="text-center vertical-middle">
                            {currentMenu?.updateAction ? (
                              <Input
                                type="textarea"
                                rows="2"
                                onBlur={(event: any) => {
                                  return saveBlurObservations(item);
                                }}
                                onInput={(e: any) => {
                                  item.node.observations = e.target.value;
                                }}
                                {...item?.node?.observations}
                                defaultValue={item?.node?.observations}
                                className={item?.node?.observations ? 'border-green form-control' : 'form-control'}
                              />
                            ) : (
                              <span>{item?.node?.observations}</span>
                            )}
                          </td>
                          <td className="text-center vertical-middle">
                            <Badge color="primary" className="font-0-8rem">
                              {item?.node?.performanceLevel?.name}
                            </Badge>
                          </td>
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
  ...experienceLearningSelfAssessmentValuationActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningSelfAssessmentValuationList);
