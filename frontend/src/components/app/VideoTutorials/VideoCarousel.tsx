import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Carousel } from 'reactstrap';
import { urlImages } from '../../../stores/graphql';

// Definir interfaces
interface Video {
  id?: string;
  name: string;
  description?: string;
  mediumResolutionFileUrl?: string;
  thumbnailUrl?: string;
}

interface VideoCarouselProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, onSelectVideo }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getYouTubeThumbnail = (url: string): string => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `${urlImages}/public/img/no-image-available.jpg`;
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>Mi colección de videos</CardTitle>
        
        {videos?.length > 0 ? (
          <div className="row">
            {videos.map((video, index) => (
              <div key={`video_${index}`} className="col-md-3 mb-4">
                <div 
                  className="card cursor-pointer h-100" 
                  onClick={() => onSelectVideo(video)}
                >
                  <div className="card-img position-relative">
                    <img 
                      src={video.mediumResolutionFileUrl ? getYouTubeThumbnail(video.mediumResolutionFileUrl) : `${urlImages}/public/img/no-image-available.jpg`}
                      alt={video.name}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="video-play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25">
                      <i className="simple-icon-control-play text-white" style={{ fontSize: "2rem" }}></i>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title text-truncate">{video.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">No hay videos disponibles</div>
        )}
      </CardBody>
    </Card>
  );
};

export default VideoCarousel;