import { adminRoot } from './defaultValues';
// import { UserRole } from "helpers/authHelper"

const data = [
  {
    id: 'admin',
    icon: 'iconsminds-optimization',
    label: 'menu.admin',
    to: `${adminRoot}/admin`,
    newWindow: false,
    subs: [
      {
        icon: 'iconsminds-male-2',
        label: 'menu.users',
        to: `/users`,
      },
      {
        icon: 'iconsminds-network',
        label: 'menu.roles',
        to: `/roles`,
      },
      {
        icon: 'iconsminds-check',
        label: 'menu.menus',
        to: `/menus`,
      },
      {
        icon: 'iconsminds-check',
        label: 'menu.submenus',
        to: `/submenus`,
      },
      {
        icon: 'iconsminds-cursor-click-2',
        label: 'menu.modules',
        to: `/modules`,
      },
      {
        icon: 'iconsminds-business-man-woman',
        label: 'menu.genders',
        to: `/genders`,
      },
      {
        icon: 'iconsminds-id-card',
        label: 'menu.documentTypes',
        to: `/documentTypes`,
      },
      {
        icon: 'iconsminds-location-2',
        label: 'menu.municipality',
        to: `/municipality`,
      },
     
    ],
  },
  {
    id: 'general',
    icon: 'iconsminds-notepad',
    label: 'menu.general',
    to: `${adminRoot}/general`,
    newWindow: false,
    subs: [
      {
        icon: 'iconsminds-books',
        label: 'menu.area',
        to: `/general/areas`,
      },
      {
        icon: 'iconsminds-book',
        label: 'menu.asignature',
        to: `/general/asignatures`,
      },
      {
        icon: 'iconsminds-bookmark',
        label: 'menu.cycleAcademic',
        to: `/general/cycles`,
      },
      {
        icon: 'iconsminds-idea-2',
        label: 'menu.standardAcademic',
        to: `/general/standardAcademic`,
      },
      {
        icon: 'iconsminds-diploma-2',
        label: 'menu.performanceLevel',
        to: `/general/performanceLevel`,
      },     
      {
        icon: 'iconsminds-medal',
        label: 'menu.grade',
        to: `/general/grades`,
      },     
    ],
  },
  {
    id: 'academic',
    icon: 'iconsminds-notepad',
    label: 'menu.academic',
    to: `${adminRoot}/academic`,
    newWindow: false,
    subs: [
      {
        icon: 'iconsminds-books',
        label: 'menu.area',
        to: `/areas`,
      },
      {
        icon: 'iconsminds-book',
        label: 'menu.asignature',
        to: `/asignatures`,
      },      
      {
        icon: 'iconsminds-idea-2',
        label: 'menu.standardAcademic',
        to: `/standardAcademic`,
      },
      {
        icon: 'iconsminds-diploma-2',
        label: 'menu.performanceLevel',
        to: `/performanceLevel`,
      },     
      {
        icon: 'iconsminds-medal',
        label: 'menu.grade',
        to: `/grades`,
      },     
      {
        icon: 'iconsminds-dashboard',
        label: 'menu.educationLevel',
        to: `/educationLevel`,
      },     
      {
        icon: 'iconsminds-brain',
        label: 'menu.evaluativeComponent',
        to: `/evaluativeComponent`,
      },     
      {
        icon: 'iconsminds-cloud-sun',
        label: 'menu.modality',
        to: `/modality`,
      },     
      {
        icon: 'iconsminds-letter-close',
        label: 'menu.speciality',
        to: `/speciality`,
      },     
      {
        icon: 'iconsminds-calendar-4',
        label: 'menu.schoolYear',
        to: `/schoolYear`,
      },     
      {
        icon: 'iconsminds-calendar-1',
        label: 'menu.periodAcademic',
        to: `/periodAcademic`,
      },     
      {
        icon: 'iconsminds-line-chart-1',
        label: 'menu.indicatorAcademic',
        to: `/indicatorAcademic`,
      },     
      {
        icon: 'iconsminds-line-chart-1',
        label: 'forms.gradeAssignment',
        to: `/gradeAssignment`,
      },     
    ],
  },
  {
    id: 'person',
    icon: 'iconsminds-student-hat',
    label: 'menu.staff',
    to: `${adminRoot}/person`,
    newWindow: false,
    subs: [
      {
        icon: 'iconsminds-student-male-female',
        label: 'menu.students',
        to: `/students`,
      },
      {
        icon: 'iconsminds-business-man-woman',
        label: 'menu.administratorsSchool',
        to: `/administratorsSchool`,
      },     
      {
        icon: 'iconsminds-network',
        label: 'menu.administratorsCampus',
        to: `/administratorsCampus`,
      },     
      {
        icon: 'iconsminds-network',
        label: 'menu.coordinatorsCampus',
        to: `/coordinatorsCampus`,
      },     
    ],
  },
  {
    id: 'school',
    icon: 'iconsminds-the-white-house',
    label: 'menu.institutions',
    to: `${adminRoot}/school`,
    newWindow: false,
    subs: [
      {
        icon: 'iconsminds-post-office',
        label: 'menu.school',
        to: `/schools`,
      },
      {
        icon: 'iconsminds-edit-map',
        label: 'menu.campus',
        to: `/campus`,
      },     
    ],
  },

];
export default data;
