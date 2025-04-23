import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { downloadExcel, DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { Badge, Button, Input, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea, compareOrderAcademicAreaAsc, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicAreaCoursePeriodValuationActions from '../../../stores/actions/AcademicAreaCoursePeriodValuationActions';
import * as academicAsignatureCouseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicAsignatureCoursePeriodValuationActions from '../../../stores/actions/AcademicAsignatureCoursePeriodValuationActions';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as componentEvaluativeActions from '../../../stores/actions/ComponentEvaluativeActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import * as experienceLearningSelfActions from '../../../stores/actions/ExperienceLearningSelfAssessmentValuationActions';
import * as experienceLearningTraditionalActions from '../../../stores/actions/ExperienceLearningTraditionalValuationActions';
import * as gradeAssignmentActions from '../../../stores/actions/GradeAssignmentActions';
import * as schoolConfiguarionActions from '../../../stores/actions/SchoolConfigurationActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ReportHourlyIntensityGrade = (props: any) => {

  const [asignatures, setAsignatures] = useState(null);
  const [asignaturesCourse, setAsignaturesCourse] = useState(null);
  const [areas, setAreas] = useState(null);
  const [courses, setCourses] = useState(null);
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
  let [valuations, setValuations] = useState(null);
  let [valuationsArea, setValuationsArea] = useState(null);
  const tableRef = useRef();
  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const academicGradeId = params.get('academicGradeId');
  const gradeName = params.get('gradeName');

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
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }
    getSpreadsheet();
  }, []);

  const getSpreadsheet = async () => {
    setLoading(true);
    await props.getListAllGradeAssignment(props?.loginReducer?.schoolId, academicGradeId).then((gradeAssignments: any) => {
      let areasAux: any[] = []
      let asigantauresAux: any[] = []
      for (let asignature of gradeAssignments) {
        if (asignature?.node?.academicAsignature?.academicArea) {
          asigantauresAux.push(asignature);
          areasAux.push(asignature?.node?.academicAsignature?.academicArea);
        }
      }
      const ids = areasAux.map(o => o?.id)
      const count: any = {};
      ids.forEach(element => {
        count[element] = (count[element] || 0) + 1;
      });
      let filtered = areasAux.filter(({ id }, index) => !ids.includes(id, index + 1))
      for (let filter of filtered) {
        filter.count = count[filter?.id];
      }
      filtered = filtered.sort(compareOrderAcademicAreaAsc);
      setAsignatures(asigantauresAux)
      setAreas(filtered);
    });
    await props.getListAllCourse(props?.loginReducer?.campusId, academicGradeId ? academicGradeId : '', props?.loginReducer?.schoolId).then(async (courses: any) => {
      setCourses(courses);
      if (courses?.length > 0) {
        let asignaturesCourses: any = {};
        for (let course of courses) {
          await props
            .getListAllAcademicAsignatureCourseByCourse(null, course?.node?.id?.toString())
            .then(async (asignaturesList: any) => {
              asignaturesCourses[course?.node?.id?.toString()] = asignaturesList;
            });
        }
        setAsignaturesCourse(asignaturesCourses)
        setLoading(false)
      } else {
        setLoading(false)
      }
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any, value: any) => {
    courses?.map(async (itemCourse: any, index: any) => {
      let asignatures = asignaturesCourse[itemCourse?.node?.id];
      for (let asignature of asignatures) {
        if (asignature.node?.academicAsignatureId == item?.academicAsignatureId) {
          if (value.length > 0) {
            let data: any = {}
            data.hourlyIntensity = value;
            await props.updateAcademicAsignatureCourseHourltIntensity(data, asignature.node?.id?.toString(),).then(() => {
              getSpreadsheet();
            });
          }
        }
      }
    })
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Intensidad Horaria Grado</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic generic={{ title: 'Grado', value: gradeName }} goTitle="Regresar a grados" />
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>
      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (areas?.length > 0 && courses?.length > 0) ? (
        <>
          {(areas?.length > 0 && courses?.length > 0) ? (
            <div style={{ overflow: "scroll", height: "70vh" }}>
              <table className="table table-bordered" ref={tableRef}>
                <thead>
                  <tr>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Area
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Asignatura
                    </th>
                    {courses?.map((itemCourse: any, index: any) => {
                      return (
                        <th rowSpan={1} className="text-center vertical-middle">
                          Intensidad Horaria - ({itemCourse?.node?.name})
                        </th>
                      )
                    })}
                    <th rowSpan={1} className="text-center vertical-middle">
                      Ajustar Intensidad Horaria a:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {areas?.map((item: any, index: any) => {
                    let asignaturesArea = asignatures?.filter((itemV: any) => itemV?.node?.academicAsignature?.academicAreaId == item?.id);
                    let countAsignatures = 0;
                    return (
                      <>
                        {asignaturesArea?.map((itemAsignature: any, indexe: any) => {
                          countAsignatures++;
                          return (
                            <>
                              <tr>
                                {countAsignatures == 1 ? <td className="text-center vertical-middle" rowSpan={asignaturesArea?.length}>
                                  {item?.name}
                                </td> : <></>}
                                {itemAsignature?.node?.academicAsignature?.academicAreaId === item?.id ?
                                  <td className="text-center vertical-middle">
                                    {itemAsignature?.node?.academicAsignature?.name}
                                  </td>
                                  : <td></td>}
                                {courses?.map((itemCourse: any, index: any) => {
                                  let asignatures = asignaturesCourse[itemCourse?.node?.id];
                                  let count = 0;
                                  let countAux = 0;
                                  for (let asignature of asignatures) {
                                    count++;
                                    if (asignature.node?.academicAsignatureId == itemAsignature?.node?.academicAsignatureId) {
                                      countAux++;
                                      return (
                                        <td rowSpan={1} className="text-center vertical-middle">
                                          {asignature?.node?.hourlyIntensity}
                                        </td>
                                      )
                                    }
                                  }
                                  if (count == asignatures?.length && countAux == 0) {
                                    return (
                                      <td rowSpan={1} className="text-center vertical-middle">
                                        -
                                      </td>
                                    )
                                  }

                                })}
                                <td>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    onInput={(e: any) => {
                                      // if (e.target.value < min || e.target.value > max) {
                                      //   e.target.value = null;
                                      // }
                                      saveBlur(itemAsignature?.node, e.target.value);
                                    }}
                                    step="1"
                                  />
                                </td>
                              </tr>
                            </>
                          );
                        })}
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
  ...schoolConfiguarionActions,
  ...academicAreaCoursePeriodValuationActions,
  ...academicAsignatureCoursePeriodValuationActions,
  ...gradeAssignmentActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportHourlyIntensityGrade);
