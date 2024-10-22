import { useState } from "react";
import { Box, Flex, Spacer, Text, Avatar } from "@chakra-ui/react";
import { FaBed, FaBath } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import millify from "millify";
import ImageScrollbar from "../../components/ImageScrollbar";
import { baseUrl, fetchApi } from "../../utils/fetchApi";

const PropertyDetails = ({
  propertyDetails: {
    price,
    rentFrequency,
    rooms,
    title,
    baths,
    area,
    agency,
    isVerified,
    description,
    type,
    purpose,
    furnishingStatus,
    amenities = [],
    photos,
  },
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Function to handle image changes in the scrollbar
  const handleImageChange = (index) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <Box 
      maxWidth="1000px" 
      margin="auto" 
      p="4" 
      bgGradient="linear(to-br, gray.900, gray.800)" 
      borderRadius="lg" 
      boxShadow="lg"
    >
      {/* Image Scrollbar */}
      {photos && photos.length > 0 ? (
        <ImageScrollbar data={photos} onChange={handleImageChange} />
      ) : (
        <p>No photos available.</p>
      )}

      {/* Property Info */}
      <Box w="full" p="6">
        <Flex paddingTop="2" alignItems="center">
          <Box paddingRight="3" color="green.400">
            {isVerified && <GoVerified />}
          </Box>
          <Text 
            fontWeight="bold" 
            fontSize="lg" 
            color="whiteAlpha.900" 
            textShadow="0 2px 10px rgba(0, 0, 0, 0.5)"
          >
            $ {millify(price)} {rentFrequency && `/${rentFrequency}`}
          </Text>
          <Spacer />
          <Avatar size="sm" src={agency?.logo?.url} />
        </Flex>

        {/* Property Details */}
        <Flex
          alignItems="center"
          p="1"
          justifyContent="space-between"
          w="250px"
          color="blue.400"
          mt="4"
        >
          <Text fontSize="lg">{rooms} <FaBed /></Text>
          <Text fontSize="lg">{baths} <FaBath /></Text>
          <Text fontSize="lg">{millify(area)} sqft <BsGridFill /></Text>
        </Flex>
      </Box>

      {/* Title and Description */}
      <Box marginTop="2">
        <Text 
          fontSize="2xl" 
          fontWeight="bold" 
          mb="2" 
          color="white" 
          textShadow="0 2px 10px rgba(0, 0, 0, 0.5)"
        >
          {title}
        </Text>
        <Text lineHeight="2" color="gray.300">
          {description}
        </Text>
      </Box>

      {/* Additional Property Info */}
      <Flex flexWrap="wrap" textTransform="uppercase" justifyContent="space-between" color="gray.400">
        <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.600" p="3">
          <Text>Type</Text>
          <Text fontWeight="bold" color="whiteAlpha.900">{type}</Text>
        </Flex>
        <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.600" p="3">
          <Text>Purpose</Text>
          <Text fontWeight="bold" color="whiteAlpha.900">{purpose}</Text>
        </Flex>
        {furnishingStatus && (
          <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.600" p="3">
            <Text>Furnishing Status</Text>
            <Text fontWeight="bold" color="blue.400">{furnishingStatus}</Text>
          </Flex>
        )}
      </Flex>

      {/* Facilities / Amenities */}
      <Box>
        {amenities.length > 0 && (
          <Text fontSize="2xl" fontWeight="black" marginTop="5" color="white">
            Facilities:
          </Text>
        )}
        <Flex flexWrap="wrap">
          {amenities.map((item) =>
            item.amenities.map((amenity) => (
              <Text
                key={amenity.text}
                fontWeight="bold"
                color="blue.400"
                fontSize="l"
                p="2"
                bg="gray.700"
                m="1"
                borderRadius="5"
                textShadow="0 2px 10px rgba(0, 0, 0, 0.5)"
              >
                {amenity.text}
              </Text>
            ))
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default PropertyDetails;

// Fetch property details on server-side
export async function getServerSideProps({ params: { id } }) {
  const data = await fetchApi(`${baseUrl}/properties/detail?externalID=${id}`);

  return {
    props: {
      propertyDetails: data,
    },
  };
}
