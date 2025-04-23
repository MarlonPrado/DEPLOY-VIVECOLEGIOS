import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import play from '../../../assets/img/videos/play.png';
import { blogData } from '../data/videos';
import { Colxx } from '../../common/CustomBootstrap';
import * as videoTutorialActions from '../../../stores/actions/VideoTutorialActions';
import { ControlBar, CurrentTimeDisplay, ForwardControl, PlaybackRateMenuButton, Player, ReplayControl, TimeDivider, VolumeMenuButton } from 'video-react';
import IntlMessages from '../../../helpers/IntlMessages';
import { urlImages } from '../../../stores/graphql';

const VideoTutorials = (props: any) => {
  const [dataList, setDataList] = useState(null);
  const [dataVideo, setDataVideo] = useState(null);
  const [dataVideoQuality, setDataVideoQuality] = useState("MEDIUM");

  useEffect(() => {
    props.getAllVideoTutorialByRol(props?.loginReducer?.role?.id).then((listData: any) => {
      setDataList(listData);
      if (listData && listData?.length > 0) {
        setDataVideo(listData[0])
      }
    });
  }, []);

  return (
    <>
      <h1>
        Video Tutoriales
      </h1>
      {dataVideo != null && <Row>
        <Colxx lg="8" xl="8" className="mb-0">
          <Player
            playsInline
            poster={dataVideo?.node?.image ? urlImages + dataVideo?.node?.image : play}
            src={`${urlImages}${dataVideoQuality == "LOW" ? dataVideo?.node?.miniumResolutionFileUrl : dataVideoQuality == "MEDIUM" ? dataVideo?.node?.mediumResolutionFileUrl : dataVideo?.node?.maxResolutionFileUrl}`}
          >
            <ControlBar>
              <CurrentTimeDisplay />
              <TimeDivider />
              <VolumeMenuButton />
              <ReplayControl seconds={10} {...{ order: 1.1, }} />
              <ForwardControl seconds={30}  {...{ order: 1.2, }} />
              <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} {...{ order: 7.1, }} />
            </ControlBar>
          </Player>
          <div className="pl-3 pt-2 pr-2 pb-2">
            <Row>
              <Col xs="8">
                <Row>
                  <Col xs="auto">
                    <p className="list-item-heading">{dataVideo?.node?.name}</p>
                  </Col>
                  <Col xs="auto">
                    {dataVideo?.node?.roles?.map((roleItem: any) => {
                      return (<>
                        <span className="mb-1 badge badge-dark badge-pill mr-1">
                          {roleItem?.name}
                        </span></>)
                    })}
                  </Col>
                </Row>
              </Col>
              <Col xs="4" className='text-right'>
                <Button
                  color="info"
                  size="sm"
                  className="top-right-button"
                  onClick={() => {
                    setDataVideoQuality("LOW")
                  }}
                  disabled={dataVideoQuality == "LOW"}
                >
                  <i className="iconsminds-video" />
                  <IntlMessages id="forms.low_quality" />
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  className="top-right-button ml-2"
                  onClick={() => {
                    setDataVideoQuality("MEDIUM")
                  }}
                  disabled={dataVideoQuality == "MEDIUM"}
                >
                  <i className="iconsminds-video" />
                  <IntlMessages id="forms.medium_quality" />
                </Button>
                <Button
                  color="success"
                  size="sm"
                  className="top-right-button ml-2"
                  onClick={() => {
                    setDataVideoQuality("HIGH")
                  }}
                  disabled={dataVideoQuality == "HIGH"}
                >
                  <i className="iconsminds-video" />
                  <IntlMessages id="forms.high_quality" />
                </Button>
              </Col>
            </Row>
            <div className="pr-4">
              <p className="text-muted mb-1 text-small">{dataVideo?.node?.description}</p>
              {/* <span className="mb-1 badge badge-outline-dark badge-pill">
                {dataVideoQuality == "LOW" &&
                  <IntlMessages id="forms.low_quality" />
                }
                {dataVideoQuality == "MEDIUM" &&
                  <IntlMessages id="forms.medium_quality" />
                }
                {dataVideoQuality == "HIGH" &&
                  <IntlMessages id="forms.high_quality" />
                }
              </span> */}
            </div>
          </div>
        </Colxx>
        <Colxx lg="4" xl="4" className="mb-0">
          <Card>
            <CardBody>
              <div className="scroll videotutorial-list-with-thumbs">
                <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                  {dataList?.map((videoTutorialItem: any, index: any) => {
                    return (
                      <div key={index} className="d-flex flex-row mb-3" style={{ cursor: "pointer" }} onClick={() => setDataVideo(videoTutorialItem)}>
                        <img
                          src={dataVideo?.node?.image ? urlImages + dataVideo?.node?.image : play}
                          alt={videoTutorialItem?.node?.title}
                          className="list-thumbnail border-0"
                        />
                        <div className="pl-3 pt-2 pr-2 pb-2">
                          <p className="list-item-heading">{videoTutorialItem?.node?.name}</p>
                          <div className="pr-4">
                            <p className="text-muted mb-1 text-small">{videoTutorialItem?.node?.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </PerfectScrollbar>
              </div>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      }
    </>
  );
};

const mapDispatchToProps = { ...videoTutorialActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};
export default connect(mapStateToProps, mapDispatchToProps)(VideoTutorials);
