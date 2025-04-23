import React, { useEffect, useState } from 'react';
import { Loader } from '../../common/Loader';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx } from '../../common/CustomBootstrap';

const OfficeSchedule = (props: any) => {
  const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    // getUser();
    setLoading(false);
  }, [props?.data]);

  // const getUser = async () => {
  //   props.dataUser(props?.loginReducer?.userId).then((resp: any) => {
  //     setUser(resp.data);
  //   });
  // };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <Colxx xxs="12" className="mb-5">
            <h1 className="mb-4 font-bold">
              <i className="iconsminds-calendar-4 text-primary mr-2"></i>
              <IntlMessages id="layouts.mySchedule" />
            </h1>
            <Card className="card-body rounded-card">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Dia</th>
                    <th className="text-center">Inicio</th>
                    <th className="text-center">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">Lunes</td>
                    <td className="text-center">
                      8:00 am
                    </td>
                    <td className="text-center">
                      10:00 am
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">Martes</td>
                    <td className="text-center">
                      8:00 am
                    </td>
                    <td className="text-center">
                      10:00 am
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Colxx>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(OfficeSchedule);
