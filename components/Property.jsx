import Link from "next/link";
import Image from "next/image";
import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { FaBed, FaBath } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import millify from "millify";
import DefaultImage from "../assets/house.jpg";

const Property = ({
  property: {
    coverPhoto,
    price,
    rentFrequency,
    rooms,
    title,
    baths,
    area,
    agency,
    isVerified,
    externalID,
  },
}) => (
  <Link href={`/property/${externalID}`} passHref>
    <Flex
      direction="column"
      w="full"
      h="100%" 
      minH="400px" 
      bgGradient="linear(to-br, gray.900, gray.800)"
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ transform: "scale(1.02)", boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)" }}
      cursor="pointer"
    >
      
      <Box position="relative" h="250px" w="full" overflow="hidden" boxShadow="0 12px 50px rgba(31, 38, 135, 0.7)">
        <Image
          src={coverPhoto ? coverPhoto.url : DefaultImage}
          alt="house"
          fill 
          style={{
            objectFit: "cover", 
            borderRadius: "8px",
          }}
        />
      </Box>

     
      <Box p="5">
        <Flex alignItems="center" justifyContent="space-between" mb="3">
          <Flex alignItems="center">
            <Box color="green.400" mr="2">
              {isVerified && <GoVerified />}
            </Box>
            <Text fontWeight="bold" fontSize="lg" color="white">
              ₦ {millify(price)} {rentFrequency && `/${rentFrequency}`}
            </Text>
          </Flex>
          <Avatar size="sm" src={agency?.logo?.url} />
        </Flex>

        
        <Flex alignItems="center" justifyContent="space-between" w="full" color="blue.400" mb="3">
          <Flex alignItems="center">
            <FaBed /> <Text ml="2">{rooms} Beds</Text>
          </Flex>
          <Flex alignItems="center">
            <FaBath /> <Text ml="2">{baths} Baths</Text>
          </Flex>
          <Flex alignItems="center">
            <BsGridFill /> <Text ml="2">{millify(area)} sqft</Text>
          </Flex>
        </Flex>

        
        <Text fontSize="md" color="whiteAlpha.800" noOfLines={2}>
          {title.length > 50 ? `${title.substring(0, 50)}...` : title}
        </Text>
      </Box>
    </Flex>
  </Link>
);

export default Property;
