import React, { memo } from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";

const ImageCarousel = ({ data, onChange }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No Property available</div>;
  }

  return (
    <div>
      <Carousel
        showArrows
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        onChange={(index) => onChange(index)}
        renderArrowPrev={(clickHandler, hasPrev) => (
          <Icon
            as={FaArrowAltCircleLeft}
            onClick={clickHandler}
            fontSize="3xl"
            cursor="pointer"
            position="absolute"
            top="50%"
            left="25px"
            zIndex={2}
            display={hasPrev ? "block" : "none"}
          />
        )}
        renderArrowNext={(clickHandler, hasNext) => (
          <Icon
            as={FaArrowAltCircleRight}
            onClick={clickHandler}
            fontSize="3xl"
            cursor="pointer"
            position="absolute"
            top="50%"
            right="25px"
            zIndex={2}
            display={hasNext ? "block" : "none"}
          />
        )}
        infiniteLoop
        autoPlay
        interval={5000}
        transitionTime={700}
      >
        {data.map((item, index) => (
          <div key={index}>
            <Image
              src={item.url}
              alt={`slide ${index + 1}`}
              width={1000}
              height={500}
              quality={70}
              placeholder="blur"
              blurDataURL={item.url + "?w=10&h=10&q=10"}
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default memo(ImageCarousel);
