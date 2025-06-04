import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Card, CardBody } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
// import * as videoTutorialActions from '../../../stores/actions/VideoTutorialActions';
import { Colxx } from '../../common/CustomBootstrap';
import VideoUploadModal from './VideoUploadModal';
import VideoCarousel from './VideoCarousel';

// Datos de ejemplo para probar la interfaz
const SAMPLE_VIDEOS = [
  {
    id: '1',
    name: 'Introducción a ViveColegios',
    description: 'Video introductorio sobre cómo usar la plataforma',
    mediumResolutionFileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '2',
    name: 'Tutorial de calificaciones',
    description: 'Cómo gestionar calificaciones en el sistema',
    mediumResolutionFileUrl: 'https://youtu.be/eXcoQb729N4?si=ZcfiFvY6da7MUnRc'
  },
  {
    id: '3',
    name: 'Gestión de estudiantes',
    description: 'Tutorial para administrar perfiles de estudiantes',
    mediumResolutionFileUrl: 'https://youtu.be/pBLfaJpYbeg?si=nySUk1NafGbCtSyY'
  }
];

const CustomVideoTutorials = (props: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoList, setVideoList] = useState(SAMPLE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEOS[0]);
  const [loading, setLoading] = useState(false);

  // Ya no usaremos useEffect con loadVideos por ahora

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Simulación de agregar un video
  const handleAddVideo = (videoData: any) => {
    const newVideo = {
      id: Date.now().toString(),
      name: videoData.name,
      description: videoData.description,
      mediumResolutionFileUrl: videoData.mediumResolutionFileUrl
    };
    
    setVideoList([...videoList, newVideo]);
    return Promise.resolve({ success: true });
  };

  // Extraer el ID de video de YouTube para usarlo en el iframe
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <IntlMessages id="menu.video-library" defaultMessage="Biblioteca de Videos" />
            </h1>
            <Button color="primary" onClick={toggleModal}>
              <i className="iconsminds-add font-weight-bold mr-2" />
              <IntlMessages id="pages.add" defaultMessage="Agregar" />
            </Button>
          </div>
        </Colxx>
      </Row>

      {loading ? (
        <div className="text-center p-5">Cargando...</div>
      ) : (
        <>
          {selectedVideo && (
            <Row>
              <Colxx xxs="12" className="mb-4">
                <Card>
                  <CardBody>
                    <div className="ratio ratio-16x9 mb-3" style={{ height: "400px" }}>
                      <iframe
                        src={getYoutubeEmbedUrl(selectedVideo.mediumResolutionFileUrl)}
                        title={selectedVideo.name}
                        allowFullScreen
                        className="border-0 w-100 h-100"
                      ></iframe>
                    </div>
                    <h3>{selectedVideo.name}</h3>
                    <p className="text-muted">{selectedVideo.description}</p>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          )}

          <Row>
            <Colxx xxs="12">
              <VideoCarousel 
                videos={videoList}
                onSelectVideo={setSelectedVideo}
              />
            </Colxx>
          </Row>
        </>
      )}

      <VideoUploadModal 
        modalOpen={modalOpen} 
        toggleModal={toggleModal} 
        refreshList={() => {}}
        saveNewVideoTutorial={handleAddVideo}
      />
    </>
  );
};

// No conectaremos con acciones reales todavía
const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps)(CustomVideoTutorials);