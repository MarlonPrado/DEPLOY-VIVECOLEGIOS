/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Badge, Progress, Tooltip } from 'reactstrap';
import CountUp from 'react-countup';
import { compare, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationActions';
import * as experienceLearningCoEvaluationValuationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ExperienceLearningCoEvaluationList = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [valuationsAssessment, setValuationsAssessment] = useState([]);
  const [experienceLearnig, setExperienceLearning] = useState(null);
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
    props.dataExperienceLearning(learningId).then((resp: any) => {
      setExperienceLearning(resp?.data)
    });
    // props.dataCourse(courseId).then((course: any) => {

    // });
    props.generateExperienceLearningCoEvaluation(learningId).then((response: any) => {
      props
        .generateExperienceLearningCoEvaluationValuation(learningId)
        .then((responseValuation: any) => {
          // OBTIENE EL TOTAL DE LA VALORACIÓN FINAL
          props
            .getListAllExperienceLearningCoEvaluationValuation(learningId)
            .then(async (listDataValuation: any) => {
              setStudents(listDataValuation.map((e: any) => {
                return e?.node?.student
              })?.sort(compare));
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
              setValuationsAssessment(listDataValuation);
            });
          // OBTIENE CADA UNA DE LAS VALORACIONES
          props.getListAllExperienceLearningCoEvaluation(learningId).then(async (listData: any) => {
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
    });
    setLoading(false);
  }, []);

  const goTo = async () => {
    navigate(-1);
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Coevaluación</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <HeaderInfoAcademic asignature grade course modality experienceLearnig goTitle="Regresar a experiencias de aprendizaje" academicAsignatureCourseId={academicAsignatureCourseId} />
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
          > ({progress}/{valuations?.length}) {valuations?.length > 0 ? ((progress / valuations?.length) * 100).toFixed(2) : 0}%</Progress>*/}
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
                    {students.map((item: any, index: any) => {
                      return (
                        <>
                          <th className="text-center">{item?.code}</th>
                        </>
                      );
                    })}
                    <th className="text-center">Valoración</th>
                    <th className="text-center">Nivel de desempeño</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((item: any, index: any) => {
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
                          {students.map((item2: any, index2: any) => {
                            return (
                              <>
                                <td className="text-center vertical-middle">
                                  <span id="tooltip_observation">
                                    {valuations.find(
                                      (c: any) =>
                                        c?.node?.studentId === item?.id && c?.node?.coEvaluatorId === item2?.id,
                                    )?.node?.assessment || '--'}</span>
                                  {/* {
                                      !valuations.find(
                                        (c: any) =>
                                          c?.studentId === item?.id && c?.coEvaluatorId === item2?.id,
                                      )?.observations ?  */}
                                  {/* : '' */}
                                  {/* } */}
                                </td>
                              </>
                            );
                          })}
                          <td className="text-center vertical-middle">
                            {valuationsAssessment.find((c: any) => c?.node?.studentId === item?.id)
                              ?.node?.assessment || '--'}
                          </td>
                          <td className="text-center vertical-middle">
                            <Badge color="primary" className="font-0-8rem">
                              {valuationsAssessment.find(
                                (c: any) => c?.node?.studentId === item?.id,
                              )?.node?.performanceLevel?.name || '--'}
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
  ...experienceLearningActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceLearningCoEvaluationList);
