import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { NavLink } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap';
import ApplicationMenu from '../AplicationsComponents/ApplicationMenu';

const SurveyDetailApplicationMenu = () => {
  return (
    <ApplicationMenu>
      <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
        <div className="p-4">
          <p className="text-muted text-small">Estado</p>
          <ul className="list-unstyled mb-5">
            <li className="active">
              <NavLink to="#">
                <i className="simple-icon-refresh" />
                 Activas
                <span className="float-right">12</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <i className="simple-icon-check" />
                Completadas
                <span className="float-right">24</span>{' '}
              </NavLink>
            </li>
          </ul>

          <p className="text-muted text-small">Categorias</p>
          <FormGroup className="mb-5">
            <Input type="checkbox" id="developmentCheck" label="Diagnóstica" className="mb-2" />
            <label className='ml-2 mt-1'>Diagnóstica</label><br/>
            <Input type="checkbox" id="workplaceCheck" className="mb-2" label="Formativa" />
            <label className='ml-2 mt-1'>Formativa</label><br/>
            <Input type="checkbox" id="hardwareCheck" className="mb-2" label="Intermedia" />
            <label className='ml-2 mt-1'>Intermedia</label>
          </FormGroup>

          <p className="text-muted text-small">Etiquetas</p>
          <div>
            <NavLink to="#">
              <span className="mb-1 badge badge-outline-primary rounded-pill">INICIAL</span>{' '}
            </NavLink>

            <NavLink to="#">
              <span className="mb-1 badge badge-outline-secondary rounded-pill">MEDIO</span>{' '}
            </NavLink>
            <NavLink to="#">
              <span className="mb-1 badge badge-outline-info rounded-pill">AVANZADO</span>{' '}
            </NavLink>
          </div>
        </div>
      </PerfectScrollbar>
    </ApplicationMenu>
  );
};

export default SurveyDetailApplicationMenu;
