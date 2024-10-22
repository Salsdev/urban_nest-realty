import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Grid, Box, Text, Button, Spinner, Flex } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import Property from "../components/Property";
import { baseUrl, fetchApi } from "../utils/fetchApi";


const Banner = React.memo(
  ({ purpose, title1, title2, desc1, desc2, buttonText, linkName, imageUrl }) => (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems="center"
      m={{ base: "4", md: "6" }}
      p={{ base: "5", md: "7" }}
      // bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(15px)"
      // border="1px solid rgba(255, 255, 255, 0.3)"
      // boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
      borderRadius="2xl"
      overflow="hidden"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      transition="transform 0.4s ease, box-shadow 0.4s ease"
      _hover={{ transform: "scale(1.02)", boxShadow: "0 12px 50px rgba(31, 38, 135, 0.7)" }}
    >
      <Image
        src={imageUrl}
        width={600}
        height={400}
        alt="banner"
        style={{ borderRadius: "20px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
      />
      <Box p="5" textAlign={{ base: "center", md: "left" }}>
        <Text color="white" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
          {purpose}
        </Text>
        <Text fontSize="5xl" fontWeight="extrabold" lineHeight="shorter" mt="3" color="white">
          {title1}
          <br />
          {title2}
        </Text>
        <Text fontSize="lg" color="whiteAlpha.800" mt="4">
          {desc1}
          <br />
          {desc2}
        </Text>
        <Button
          as="a"
          href={linkName}
          size="lg"
          mt="6"
          bgGradient="linear(to-r, teal.500, blue.500)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, blue.500, teal.500)" }}
          px="10"
          py="6"
          borderRadius="full"
          boxShadow="0 5px 20px rgba(56, 178, 172, 0.4)"
        >
          {buttonText}
        </Button>
      </Box>
    </Flex>
  )
);

Banner.displayName = "Banner"; 

export default function Home({ propertiesForRent }) {
  const [propertiesForSale, setPropertiesForSale] = useState([]);
  const [loadingSale, setLoadingSale] = useState(false);

  
  const loadPropertiesForSale = useCallback(
    debounce(async () => {
      if (!loadingSale && propertiesForSale.length === 0) {
        setLoadingSale(true);
        const saleData = await fetchApi(
          `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-sale&hitsPerPage=6`
        );
        setPropertiesForSale(saleData?.hits || []);
        setLoadingSale(false);
      }
    }, 300),
    [loadingSale, propertiesForSale.length]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        loadPropertiesForSale();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadPropertiesForSale]);

  return (
    <Box w="full" bgGradient="linear(to-br, gray.900, gray.800)" pb="12">
      
      <Banner
        purpose="RENT A HOME"
        title1="Rental Homes for"
        title2="Everyone"
        desc1="Explore Apartments, Villas, Homes"
        desc2="and more"
        buttonText="Explore Renting"
        linkName="/search?purpose=for-rent"
        imageUrl="https://bayut-production.s3.eu-central-1.amazonaws.com/image/145426814/33973352624c48628e41f2ec460faba4"
      />

      
      <Box p="6" mt="8" borderRadius="2xl" shadow="2xl">
  <Flex justifyContent="center" mb="5"> 
    <Text
      fontSize="3xl"
      fontWeight="bold"
      textAlign="center" 
      color="whiteAlpha.900"
      bgGradient="linear(to-r, teal.500, blue.500)" 
      bgClip="text" 
      textShadow="0 2px 10px rgba(0, 0, 0, 0.5)" 
    >
      Properties for Rent
    </Text>
  </Flex>
  
  <Grid
    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
    gap={6}
    width="100%"
  >
    {propertiesForRent.map((property) => (
      <Property key={property.id} property={property} />
    ))}
  </Grid>
</Box>


      
      <Banner
        purpose="BUY A HOME"
        title1="Find, Buy & Own Your"
        title2="Dream Home"
        desc1="Explore Apartments, Villas, Homes"
        desc2="and more"
        buttonText="Explore Buying"
        linkName="/search?purpose=for-sale"
        imageUrl="https://bayut-production.s3.eu-central-1.amazonaws.com/image/110993385/6a070e8e1bae4f7d8c1429bc303d2008"
      />

      
      <Box p="6" mt="8" borderRadius="2xl" shadow="2xl">
  <Flex justifyContent="center" mb="5"> 
    <Text
      fontSize="3xl"
      fontWeight="bold"
      textAlign="center" 
      color="whiteAlpha.900"
      bgGradient="linear(to-r, teal.500, blue.500)" 
      bgClip="text" 
      textShadow="0 2px 10px rgba(0, 0, 0, 0.5)"
    >
      Properties for Sale
    </Text>
  </Flex>
  
  {loadingSale ? (
    <Flex justifyContent="center" width="100%">
      <Spinner size="lg" color="teal.400" />
    </Flex>
  ) : (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
      gap={6}
      width="100%"
    >
      {propertiesForSale.map((property) => (
        <Property key={property.id} property={property} />
      ))}
    </Grid>
  )}
</Box>

    </Box>
  );
}


export async function getStaticProps() {
  const propertyForRent = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-rent&hitsPerPage=6`
  );

  return {
    props: {
      propertiesForRent: propertyForRent?.hits || [],
    },
    revalidate: 60,
  };
}
