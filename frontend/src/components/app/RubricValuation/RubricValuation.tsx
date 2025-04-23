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
import * as experienceLearningRubricValuationActions from '../../../stores/actions/ExperienceLearningRubricValuationActions';
import { urlImages } from '../../../stores/graphql';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ExperienceLearningSelfAssessmentValuationList = (props: any) => {
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [criteriaPerformances, setCriteriaPerformances] = useState([]);

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
    props.generateExperienceLearningRubricValuationStudents(learningId).then((response: any) => {
      props
        .getListAllExperienceLearningRubricValuation(
          learningId,
        )
        .then(async (listData: any) => {
          let valuationsArr: any = [];
          // get performance levels
          await props
            .getListAllPerformanceLevel(props?.loginReducer?.schoolId)
            .then((levels: any) => {
              setPerformanceLevels(levels);
              // set valuations list and get the performance level for each one
              valuationsArr = listData.map((l: any) => {
                l.node.code = l.node.student.code;
                return l.node;
              });
            });
          setValuations(valuationsArr.sort(compare));
        });
    });
    setLoading(false);
  }, []);

  const goTo = async () => {
    navigate(-1);
  };
  const goToChildren = async (url: string) => {
    navigate(url);
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Rúbrica de valoración</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic asignature grade course experienceLearnig goTitle="Regresar a experiencias de aprendizaje" experienceLearnigId={learningId} academicAsignatureCourseId={academicAsignatureCourseId} />
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
                    <th className="text-center">Valorar rúbrica</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((item: any, index: any) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{item?.student?.code}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <div className="d-flex align-items-center justify-content-start">
                              {item?.student?.user?.profilePhoto ? (
                                <ThumbnailImage
                                  rounded
                                  src={urlImages + item?.node?.student?.user?.profilePhoto}
                                  alt="profile"
                                  className="xsmall mr-3"
                                />
                              ) : (
                                <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                  {getInitialsName(
                                    item?.student?.user
                                      ? item?.student?.user?.lastName +
                                      ' ' +
                                      item?.student?.user?.name
                                      : 'N N',
                                  )}
                                </span>
                              )}
                              <span>
                                {item?.student?.user?.lastName} {item?.student?.user?.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-center vertical-middle">
                            <span>{item?.assessment?.toFixed(2)}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <span>{item?.observations}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <Badge color="primary" className="font-0-8rem">
                              {item?.performanceLevel?.name}
                            </Badge>
                          </td>
                          <td className="text-center vertical-middle">
                            <button className="btn btn-orange mb-3 btn-xs" type="button"
                              onClick={() => {
                                goToChildren(
                                  `/rubricCriteriaValuation?rubricValuationId=${item?.id}&studentId=${item?.student?.id}&learningId=${learningId}&academicAsignatureCourseId=${academicAsignatureCourseId}`,
                                )
                              }}>
                              Valorar criterios
                            </button>
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
  ...experienceLearningRubricValuationActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExperienceLearningSelfAssessmentValuationList);
