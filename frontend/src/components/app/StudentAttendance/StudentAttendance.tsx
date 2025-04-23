import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Badge, Input, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea } from '../../../helpers/DataTransformations';
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
import * as studentAttendance from '../../../stores/actions/StudentAttendanceActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const StudentAttendance = (props: any) => {
  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
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
  const [averages, setAverages] = useState([]);
  const [averagesFinal, setAveragesFinal] = useState([]);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  const [days, setDays] = useState([]);

  const [listDays, setListDays] = useState([{ code: "MONDAY", label: "Lunes" },
  { code: "TUESDAY", label: "Martes" }, { code: "WEDNESDAY", label: "Miercoles" },
  { code: "THURSDAY", label: "Jueves" }, { code: "FRIDAY", label: "Viernes" }]);


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
        let countDays = totalDays + 1;
        if (today <= endDate && today >= startDate) {
          countDays = calculateDaysTwoDate(startDate, new Date());
        }
        setDateProgress({ startDate, endDate, totalDays, countDays })
        let daysTemp = [];
        for (let i = 0; i < countDays; i++) {
          let date = new Date(period.startDate);
          date.setDate(date.getDate() + i);
          if (date.getDay() > 0 && date.getDay() < 6) {
            daysTemp.push(date);
          }
        }
        setDays(daysTemp);
      }
      getSpreadsheet(period?.id);
    });
  }, []);

  const getSpreadsheet = async (periodId: any) => {
    setLoading(true);
    await props.dataCourse(courseId).then(async (course: any) => {
      if (props?.loginReducer?.studentId?.length > 0) {
        let studentsList = course?.data?.students?.filter((itemV: any) => itemV?.id == props?.loginReducer?.studentId);
        setStudents(studentsList);
      } else {
        setStudents(course?.data?.students.sort(compare));
      }
      let obj: any = [];
      let nts: any = [];
      let avrgs: any = [];
      let avrgsFinal: any = [];
      let levels: any = [];
      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (listData: any) => {
          setAcademicPeriods(listData);
          let promisesList: any[] = [];
          if (periodId) {
            await props
              .getAllStudentAttendance(periodId, academicAsignatureCourseId)
              .then(async (notesFinal: any) => {
                avrgsFinal = avrgsFinal.concat(notesFinal.data.edges);
                setValuations(avrgsFinal);
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        });
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const saveNewStudentAttendance = (day: any, studentId: any) => {
    props.saveNewStudentAttendance({ day, studentId, academicAsignatureCourseId, academicPeriodId: currentAcademicPeriod?.id?.toString() }).then((resp: any) => {
      getSpreadsheet(currentAcademicPeriod?.id?.toString())
    });
  }

  const deleteStudentAttendance = (itemId: any) => {
    props.deleteStudentAttendance(itemId).then((resp: any) => {
      getSpreadsheet(currentAcademicPeriod?.id?.toString())
    });
  }

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Planilla Inasistencia</h1>
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
                        let countDays = totalDays + 1;
                        if (today <= endDate && today >= startDate) {
                          countDays = calculateDaysTwoDate(startDate, new Date());
                        }
                        setDateProgress({ startDate, endDate, totalDays, countDays })
                        let daysTemp = [];
                        for (let i = 0; i < countDays; i++) {
                          let date = new Date(item?.node?.startDate);
                          date.setDate(date.getDate() + i);
                          if (date.getDay() > 0 && date.getDay() < 6) {
                            daysTemp.push(date);
                          }
                        }
                        setDays(daysTemp);
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
                    {days?.map((item: any, index: any) => {
                      return (
                        <>
                          <th
                            className="text-center vertical-middle"
                          >
                            {item?.toLocaleDateString()}
                          </th>
                        </>
                      );
                    })}
                    {/*{listDays?.map((item: any, index: any) => {
                      return (
                        <>
                          <th
                            className="text-center vertical-middle"
                          >
                            {item?.label}
                          </th>
                        </>
                      );
                    })}*/}
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, index: any) => {
                    let studentAttendance = valuations?.filter((itemV: any) => itemV?.node?.studentId == itemStudent?.id.toString());
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
                          {days?.map((item: any, index: any) => {
                            let studentAttendanceDay = studentAttendance?.filter((itemV: any) => new Date(itemV?.node?.day).getTime() == item.getTime());
                            return (
                              <>
                                <td
                                  className="text-center vertical-middle"
                                >
                                  {/* {item?.toLocaleDateString()} */}
                                  <Input
                                    className="itemCheck mb-0 mr-2"
                                    type="checkbox"
                                    id={`check_shuffleQuestions`}
                                    defaultChecked={studentAttendanceDay?.length > 0 ? true : false}
                                    onChange={() => {
                                      //setValue('shuffleQuestions', !data.shuffleQuestions);
                                      if (studentAttendanceDay?.length > 0) {
                                        deleteStudentAttendance(studentAttendanceDay[0]?.node?.id)
                                      } else {
                                        saveNewStudentAttendance(item, itemStudent?.id.toString());
                                      }
                                    }}
                                    label=""
                                    disabled={props?.loginReducer?.studentId?.length > 0}
                                  />
                                </td>
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
  ...studentAttendance
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentAttendance);