/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Badge, Input } from 'reactstrap';
import { compare } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationActions';
import * as experienceLearningCoEvaluationValuationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ExperienceLearningCoEvaluationStudentsList = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [valuationsAssessment, setValuationsAssessment] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
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
    props.dataCourse(courseId).then((course: any) => {
      setStudents(course?.data?.students.sort(compare));
    });
    props.generateExperienceLearningCoEvaluation(learningId).then((response: any) => {
      props
        .generateExperienceLearningCoEvaluationValuation(learningId)
        .then((responseValuation: any) => {
          props
            .getListAllExperienceLearningCoEvaluationValuation(learningId)
            .then(async (listDataValuation: any) => {
              let valuationsArr: any = [];
              await props
                .getListAllPerformanceLevelAsignatureCourse(academicAsignatureCourseId)
                .then((levels: any) => {
                  setPerformanceLevels(levels);
                  // set valuations list and get the performance level for each one
                  valuationsArr = listDataValuation.map((l: any) => {
                    const perf = levels?.find((c: any) => {
                      return (
                        l?.node.assessment &&
                        l?.node?.assessment <= c.node.topScore &&
                        l?.node?.assessment >= c.node.minimumScore
                      );
                    });
                    l.node.performance = perf?.node?.name;
                    return l;
                  });
                });
              setValuationsAssessment(valuationsArr);
            });
          props.getListAllExperienceLearningCoEvaluation(learningId).then(async (listData: any) => {
            let valuationsArr: any = [];
            // get performance levels
            await props
              .getListAllPerformanceLevel(props?.loginReducer?.schoolId)
              .then((levels: any) => {
                setPerformanceLevels(levels);
                // set valuations list and get the performance level for each one
                valuationsArr = listData.map((l: any) => {
                  const perf = levels?.find((c: any) => {
                    return (
                      l?.node.assessment &&
                      l?.node?.assessment <= c.node.topScore &&
                      l?.node?.assessment >= c.node.minimumScore
                    );
                  });
                  l.node.performance = perf?.node?.name;
                  return l.node;
                });
              });
            setValuations(valuationsArr);
          });
        });
    });
    setLoading(false);
  }, []);

  const getPerformanceLevel = async (e: any, valuation: any) => {
    const perf = performanceLevels?.find((c: any) => {
      return e.target.value <= c.node.topScore && e.target.value >= c.node.minimumScore;
    });
    const elementIndex = valuations.findIndex((obj) => {
      return obj.id === valuation?.id;
    });
    valuations[elementIndex].performance = perf?.node?.name;
    valuations[elementIndex].assessment = e.target.value;
    const arr = Object.assign([], valuations);
    setValuations(arr);
  };

  const saveNote = async (event: any, note: any) => {
    if (event.key === 'Enter') {
      let obj = {
        assessment: event.target.value,
      };
      props.updateExperienceLearningCoEvaluation(obj, note?.id, true).then((resp: any) => { });
    }
  };

  const saveObservations = async (event: any, note: any) => {
    if (event.key === 'Enter') {
      let obj2 = {
        observations: event.target.value,
      };
      props.updateExperienceLearningCoEvaluation(obj2, note?.id, true).then((resp: any) => { });
    }
  };

  const goTo = async () => {
    navigate(-1);
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Coevaluación</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic asignature grade course modality experienceLearnig goTitle="Regresar a experiencias de aprendizaje" experienceLearnigId={learningId} academicAsignatureCourseId={academicAsignatureCourseId} />
        <div className="mt-4 w-60">
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td
                  className="w-20"
                  rowSpan={
                    valuations[0]?.experienceLearning?.experienceLearningPerformanceLevel?.length +
                    1
                  }
                >
                  <strong>Criterio:</strong> {valuations[0]?.experienceLearning?.criteria}
                </td>
              </tr>
              {valuations[0]?.experienceLearning?.experienceLearningPerformanceLevel.map(
                (e: any) => {
                  return (
                    <>
                      <tr>
                        <td>
                          <strong>Nivel de desempeño:</strong> {e?.performanceLevel?.name}
                        </td>
                        <td>
                          <strong>Criterio:</strong> {e?.criteria}
                        </td>
                      </tr>
                    </>
                  );
                },
              )}
            </tbody>
          </table>
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
          {students !== null ? (
            <>
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
                  {students.map((item: any, index: any) => {
                    let note = valuations.find(
                      (c: any) =>
                        c?.studentId === item?.id &&
                        c?.coEvaluatorId === props?.loginReducer?.entityId,
                    );
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{item?.code}</span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-start">
                              {item?.user?.urlPhoto ? (
                                <ThumbnailImage
                                  rounded
                                  small
                                  src={item?.user?.urlPhoto}
                                  alt="profile"
                                  className="xsmall mr-3"
                                />
                              ) : (
                                <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                  {getInitialsName(
                                    item?.user
                                      ? item?.user?.lastName +
                                      ' ' +
                                      item?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {item?.user?.lastName} {item?.user?.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-center vertical-middle">
                            <Input
                              disabled={item?.id === props?.loginReducer?.entityId}
                              type="number"
                              onInput={(e) => {
                                return getPerformanceLevel(e, note);
                              }}
                              onKeyPress={(event: any) => {
                                return saveNote(event, note);
                              }}
                              defaultValue={note?.assessment}
                              className="form-control"
                            />
                          </td>
                          <td className="text-center vertical-middle">
                            <Input
                              disabled={item?.id === props?.loginReducer?.entityId}
                              type="textarea"
                              rows="2"
                              onKeyPress={(event: any) => {
                                return saveObservations(event, note);
                              }}
                              defaultValue={note?.observations}
                              className="form-control"
                            />
                          </td>
                          <td className="text-center vertical-middle">
                            <Badge color="primary" className="font-0-8rem">
                              {note?.performance || '--'}
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
  ...experienceLearningCoEvaluationActions,
  ...experienceLearningCoEvaluationValuationActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningCoEvaluationStudentsList);
