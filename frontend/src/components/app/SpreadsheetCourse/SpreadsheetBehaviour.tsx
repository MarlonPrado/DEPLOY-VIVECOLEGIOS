import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { downloadExcel, DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Badge, Progress } from 'reactstrap';

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
import * as schoolConfiguarionActions from '../../../stores/actions/SchoolConfigurationActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import * as averageAcademicPeriodStudentActions from '../../../stores/actions/AverageAcademicPeriodStudentActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const SpreadsheetBehaviour = (props: any) => {

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
  let [valuations, setValuations] = useState(null);
  let [valuationsArea, setValuationsArea] = useState(null);
  let [notes, setNotes] = useState([]);
  let [averages, setAverages] = useState([]);
  let [averagesFinal, setAveragesFinal] = useState([]);
  let [countDownload, setcountDownload] = useState(0);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  let [countDigits, setCountDigits] = useState(2);
  const tableRef = useRef();

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');

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
    props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
      await props.getListAllSchoolConfiguration(props?.loginReducer?.schoolId).then(async (schoolConfigurations: any) => {
        for (let schoolConfiguration of schoolConfigurations) {
          if (schoolConfiguration?.node?.code == "COUNT_DIGITS_AVERAGE_STUDENT") {
            setCountDigits(schoolConfiguration?.node?.valueNumber);
          }
        }
      });
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
      let ntsArea: any = [];
      let avrgs: any = [];
      let avrgsFinal: any = [];
      let levels: any = [];
      await props
        .getListAllPerformanceLevelCourse(courseId)
        .then((dataLevels: any) => {
          setPerformanceLevels(dataLevels);
          levels = dataLevels;
          setPerformanceLevelType(dataLevels[0]?.node?.type);
        });
      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (listData: any) => {
          setAcademicPeriods(listData);
          let promisesListAsignatures: any[] = [];
          let promisesListAreas: any[] = [];
          if (periodId) {
            await props
              .getAllAcademicBehaviourPeriodValuation(periodId, courseId)
              .then(async (notesFinal: any) => {
                ntsArea = notesFinal.data.edges;
              })
            setValuationsArea(ntsArea);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const download = async () => {
    if (countDownload != 0) {
      onDownload();
    }
    setcountDownload(countDownload + 1)
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Planilla General',
    sheet: 'Planilla General'
  })

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Planilla Comportamiento</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality goTitle="Regresar a cursos" courseId={courseId} />
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

          {/* <div className='d-flex mt-3 justify-content-end'>
                <button
                  className="btn btn-green mr-2"
                  type="button"
                  onClick={() => {
                    return setIsFormEnabled(!isFormEnabled);
                  }}
                >
                  <i className="iconsminds-file-edit"></i> Habilitar edición
                </button>
                <button className="btn btn-orange" type="button">
                  <i className="iconsminds-delete-file"></i> Cerrar periodo
                </button>
              </div> */}
        </div>
        <div className="d-flex justify-content-start align-items-center flex-column" >
          <button
            onClick={download}
            key={"download"}
            className={`ml-1 btn btn-info mb-2`}
            type="button"
          >
            <i className="iconsminds-download"></i> {"Descargar XLS"}
          </button>
        </div>
        {/* <button onClick={download}> Export excel </button> */}
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>

      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : valuationsArea != null ? (
        <>
          {students !== null ? (
            <div style={{ overflow: "scroll", height: "70vh" }}>
              <table className="table table-bordered" ref={tableRef}>
                <thead>
                  <tr>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Código
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Estudiante
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Valoración
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Nivel de desempeño
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Observación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, index: any) => {
                    let valuationArea = valuationsArea?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id);
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
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{valuationArea[0]?.node?.assessment?.toFixed(countDigits)}</span>
                          </td>
                          <td className="text-center vertical-middle">
                            <StyledBadge color="primary" className="font-0-8rem ${}" background={valuationArea[0]?.node?.performanceLevel?.colorHex ? `${valuationArea[0]?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                              {valuationArea[0]?.node?.performanceLevel?.abbreviation ? valuationArea[0]?.node?.performanceLevel?.abbreviation : valuationArea[0]?.node?.performanceLevel?.name}
                            </StyledBadge>
                          </td>
                          <td className="text-center vertical-middle">
                            <span className="font-bold">{valuationArea[0]?.node?.observation}</span>
                          </td>
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
  ...schoolConfiguarionActions,
  ...averageAcademicPeriodStudentActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetBehaviour);
