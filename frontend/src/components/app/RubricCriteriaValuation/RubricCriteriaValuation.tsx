/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Button, Input, Progress } from 'reactstrap';
import Select from 'react-select';
import CountUp from 'react-countup';
import { compare, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as experienceLearningRubricCriteriaValuationActions from '../../../stores/actions/ExperienceLearningRubricCriteriaValuationActions';
import * as experienceLearningRubricValuationActions from '../../../stores/actions/ExperienceLearningRubricValuationActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import IntlMessages from '../../../helpers/IntlMessages';

const ExperienceLearningRubricCriteriaValuationList = (props: any) => {
  const [rubricValuation, setRubricValuation] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [performanceLevelsList, setPerformanceLevelsList] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [total, setTotal] = useState(0);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [valuationsBase, setValuationsBase] = useState([]);
  const [average, setAverage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [performanceSelected, setPerformanceSelected] = useState(null);
  const [assesstmentSelected, setAssesstmentSelected] = useState(null);

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const studentId = params.get('studentId');
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const learningId = params.get('learningId');
  const rubricValuationId = params.get('rubricValuationId');
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
    props
      .dataExperienceLearningRubricValuation(rubricValuationId)
      .then(async (dataRubricValuation: any) => {
        setRubricValuation(dataRubricValuation.data);
      });

    props
      .getListAllExperienceLearningRubricCriteriaValuation(learningId, studentId)
      .then(async (listData: any) => {
        let count = 0;
        listData?.map((d: any) => {
          count += d?.node?.experienceLearningRubricCriteria?.weight;
        })
        setTotal(count);
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
        setValuations([...listData.map((c: any) => { return c?.node }).sort(compare)]);
        setValuationsBase(JSON.parse(JSON.stringify(listData)));
      });

    props
      .getListAllPerformanceLevelAsignatureCourse(academicAsignatureCourseId)
      .then((levels: any) => {
        setPerformanceLevels(levels);
        setPerformanceLevelsList(
          levels.map((c: any) => {
            return { label: c.node.name, value: c.node.id, key: c.node.id };
          }),
        );
        let levelsOrderDesc = levels.sort(comparePerformanceLevelsTopScore)
        setMax(levelsOrderDesc[levelsOrderDesc.length - 1]?.node?.topScore);
        setMin(levelsOrderDesc[0]?.node?.minimumScore);
      });
    setLoading(false);
  }, []);

  const refreshDataTable = async () => {
    await props
      .getListAllExperienceLearningRubricCriteriaValuation(
        learningId,
        studentId,
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
        setValuations([...listData.map((c: any) => { return c?.node }).sort(compare)]);
        setValuationsBase(JSON.parse(JSON.stringify(listData)));
        props
          .dataExperienceLearningRubricValuation(rubricValuationId)
          .then(async (dataRubricValuation: any) => {
            setRubricValuation(dataRubricValuation.data);
          });
      });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any) => {
    const elementIndex = valuationsBase.findIndex((obj) => {
      return obj?.node?.id === item.id;
    });
    if (valuationsBase[elementIndex]?.node?.assessment !== item?.assessment) {
      let obj = {
        assessment: item?.assessment,
        performanceLevelId: item?.performanceLevel?.id
      };
      await props.updateExperienceLearningRubricCriteriaValuation(obj, item.id).then(
        async () => {
          await props.updateExperienceLearningRubricValuationFromCriteria(rubricValuationId, false).then();
          createNotification('success', 'success', '');
          refreshDataTable();
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
  };

  const getPerformanceLevelSelection = (valuation: number, performanceLevel: any) => {
    let perf = null;
    if (valuation > 0) {
      perf = performanceLevels?.find((c: any) => {
        return valuation < c.node.topScore && valuation >= c.node.minimumScore;
      });
      if (perf === undefined) {
        perf = performanceLevels?.find((c: any) => {
          return valuation <= c.node.topScore && valuation > c.node.minimumScore;
        });
      }
    }
    return perf?.node?.name === performanceLevel?.name
  }

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
      return obj.id === valuation.id;
    });
    if (perf) {
      valuations[elementIndex].performanceLevel = perf.node;
    } else {
      valuations[elementIndex].performanceLevel = null;
    }
    valuations[elementIndex].assessment = e.target.value;
    const arr = Object.assign([], valuations);
    setValuations(arr);
  };

  const setAll = async () => {
    setLoading(true);
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
      await props.updateExperienceLearningRubricCriteriaValuation(obj, item.id).then(
        async () => {
          await props.updateExperienceLearningRubricValuationFromCriteria(rubricValuationId, false).then();
        },
        () => {
          createNotification('error', 'error', '');
        },
      );
    }
    createNotification('success', 'success', '');
    setValuations([])
    refreshDataTable();
    setAssesstmentSelected(null);
    setPerformanceSelected(null);
    setLoading(false);
  }

  const saveObservationRubricValuation = async (event: any, item: any) => {
    let obj = {
      observations: event.target.value,
    };
    await props.updateExperienceLearningRubricValuation(obj, rubricValuationId, true).then();
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Valoración de criterios de rúbrica</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic asignature grade course student modality experienceLearnig goTitle="Regresar a experiencias de aprendizaje" studentId={studentId} experienceLearnigId={learningId} academicAsignatureCourseId={academicAsignatureCourseId} />
        <div className='mt-4'>
          <div className="d-flex flex-row justify-content-end">
            <span className="mb-0 text-muted mr-4">
              Nota: <h2 className="text-muted font-bold">{rubricValuation?.assessment?.toFixed(1)}</h2>
            </span>
            <span className="mb-0 text-muted">
              Observación:  <Input type='textarea' onBlur={(event: any) => {
                return saveObservationRubricValuation(event, rubricValuation);
              }} defaultValue={rubricValuation?.observations} rows="2" className="form-control" />
            </span>
          </div>
          <div className="d-flex flex-row mt-2">
            <p className='font-bold text-danger'>{total < 100 ? 'Los criterios no cumplen con el peso de 100%' : ''}</p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-start align-items-center" >
        <div className="d-flex justify-content-start align-items-center mb-3 w-30">
          {
            valuations[0]?.performanceLevel?.type == 'QUANTITATIVE' ?
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
          > ({progress}/{valuations?.length}) {valuations?.length > 0 ? ((progress / valuations?.length) * 100) : 0}%</Progress> */}
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
          {valuations !== null ? (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Criterio</th>
                    <th className="text-center">Peso</th>
                    <th className="text-center">Evidencia de aprendizaje</th>
                    {
                      valuations[0]?.experienceLearningRubricCriteria?.experienceLearningRubricCriteriaPerformanceLevel?.map((v: any) => {
                        return <>
                          <th>
                            <div>{v?.performanceLevel?.name}</div>
                            <div>{`${v?.performanceLevel?.minimumScore} - ${v?.performanceLevel?.topScore}`}</div>
                          </th>
                        </>
                      })
                    }
                    <th className="text-center">Valoración</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((item: any, index: any) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-center">
                              <span>
                                {item?.experienceLearningRubricCriteria?.criteria}
                              </span>
                            </div>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-center">
                              <span>
                                {item?.experienceLearningRubricCriteria?.weight}
                              </span>
                            </div>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-center">
                              <span>
                                {item?.experienceLearningRubricCriteria?.evidenceLearnig?.statement}
                              </span>
                            </div>
                          </td>
                          {
                            item?.experienceLearningRubricCriteria?.experienceLearningRubricCriteriaPerformanceLevel?.map((v: any) => {
                              return <>
                                <td className={(getPerformanceLevelSelection(item?.assessment, v?.performanceLevel)) ? 'bg-warning-light' : ''}>{v?.criteria}</td>
                              </>
                            })
                          }
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
                                        getPerformanceLevel(e, item);
                                      }}
                                      {...item?.assessment}
                                      defaultValue={item?.assessment}
                                      className={item?.assessment ? 'border-green form-control' : 'form-control'}
                                    />
                                }
                              </>) : (
                              <span>{item?.assessment}</span>
                            )}
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
  ...performanceLevelActions,
  ...experienceLearningRubricCriteriaValuationActions,
  ...experienceLearningRubricValuationActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningRubricCriteriaValuationList);
