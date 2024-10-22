import React, { memo } from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Icon, Box } from "@chakra-ui/react";

const ImageCarousel = ({ data, onChange }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No Property available</div>;
  }

  return (
    <Box position="relative" overflow="hidden" borderRadius="lg" boxShadow="xl">
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
            left="20px"
            transform="translateY(-50%)"
            zIndex={2}
            color="whiteAlpha.900"
            bgGradient="linear(to-br, teal.500, blue.500)"
            borderRadius="full"
            boxShadow="0 0 15px teal"
            _hover={{ boxShadow: "0 0 25px blue", transform: "scale(1.2)" }}
            transition="all 0.3s ease"
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
            right="20px"
            transform="translateY(-50%)"
            zIndex={2}
            color="whiteAlpha.900"
            bgGradient="linear(to-br, teal.500, blue.500)"
            borderRadius="full"
            boxShadow="0 0 15px teal"
            _hover={{ boxShadow: "0 0 25px blue", transform: "scale(1.2)" }}
            transition="all 0.3s ease"
            display={hasNext ? "block" : "none"}
          />
        )}
        infiniteLoop
        autoPlay
        interval={5000}
        transitionTime={700}
        stopOnHover
      >
        {data.map((item, index) => (
          <Box key={index} position="relative" maxHeight="400px" overflow="hidden">
            <Image
              src={item.url}
              alt={`slide ${index + 1}`}
              width={1000}
              height={400}
              quality={70}
              placeholder="blur"
              blurDataURL={item.url + "?w=10&h=10&q=10"}
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
              style={{
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.5s ease, filter 0.5s ease",
                filter: "brightness(0.9)",
                maxHeight: "400px", 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "brightness(0.9)";
              }}
            />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default memo(ImageCarousel);
