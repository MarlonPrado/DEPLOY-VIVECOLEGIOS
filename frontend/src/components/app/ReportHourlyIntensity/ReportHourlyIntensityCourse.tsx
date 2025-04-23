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
import * as schoolConfiguarionActions from '../../../stores/actions/SchoolConfigurationActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const ReportHourlyIntensityCourse = (props: any) => {

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
  let [valuations, setValuations] = useState(null);
  let [valuationsArea, setValuationsArea] = useState(null);
  let [notes, setNotes] = useState([]);
  let [averages, setAverages] = useState([]);
  let [averagesFinal, setAveragesFinal] = useState([]);
  let [countDownload, setcountDownload] = useState(0);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  let [countDigits, setCountDigits] = useState(2);
  const tableRef = useRef();
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);

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
    getSpreadsheet();
  }, []);

  const getSpreadsheet = async () => {
    setLoading(true);
    await props.dataCourse(courseId).then(async (course: any) => {
      let nts: any = [];
      let ntsArea: any = [];
      let promisesListAsignatures: any[] = [];
      let promisesListAreas: any[] = [];
      if (courseId) {
        await props
          .getListAllAcademicAsignatureCourseByCourse(null, courseId)
          .then(async (asignaturesList: any) => {
            setAsignatures(asignaturesList)
            let areasAux: any[] = []
            for (let asignature of asignaturesList) {
              if (asignature?.node?.academicAsignature?.academicArea) {
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
            setAreas(filtered);
          });
        await Promise.all(promisesListAreas).then(() => {
          setValuationsArea(ntsArea);
        });
        await Promise.all(promisesListAsignatures).then(() => {
          setValuations(nts);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any, value: any) => {
    if (value.length > 0) {
      let data: any = {}
      data.hourlyIntensity = value;
      await props.updateAcademicAsignatureCourseHourltIntensity(data, item?.id?.toString(),).then(() => {
        getSpreadsheet();
      });
    }
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Intensidad Horaria Curso</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality goTitle="Regresar a Cursos" courseId={courseId} />
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>
      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : areas?.length > 0 ? (
        <>
          {areas?.length > 0 ? (
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
                    <th rowSpan={1} className="text-center vertical-middle">
                      Intensidad Horaria
                    </th>
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
                                {itemAsignature?.node?.hourlyIntensity ?
                                  <td className="text-center vertical-middle">
                                    {itemAsignature?.node?.hourlyIntensity}
                                  </td>
                                  : <td></td>}
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
  ...academicAsignatureCoursePeriodValuationActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportHourlyIntensityCourse);
