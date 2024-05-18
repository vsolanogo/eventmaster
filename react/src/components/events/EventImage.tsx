import React from "react";
import { Image } from "../../models/UserModels";
import Slider from "react-slick";

type EventImagesProps = {
  images: Image[];
};

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

export const EventImages: React.FC<EventImagesProps> = ({ images }) => {
  if (images.length <= 0) return null;

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div
          key={image.id}
          className="flex justify-center items-center h-40 p-4"
        >
          <img
            src={
              image.link.startsWith("https://")
                ? image.link
                : `http://localhost:3000${image.link}`
            }
            className="h-full w-auto object-cover rounded shadow-lg m-auto"
          />
        </div>
      ))}
    </Slider>
  );
};
