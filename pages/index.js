import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flex, Box, Text, Button, Spinner } from "@chakra-ui/react";
import debounce from "lodash.debounce";

import Property from "../components/Property";
import { baseUrl, fetchApi } from "../utils/fetchApi";

// Memoized Banner Component with display name
const Banner = React.memo(
  ({
    purpose,
    title1,
    title2,
    desc1,
    desc2,
    buttonText,
    linkName,
    imageUrl,
  }) => (
    <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="10">
      <Image
        src={imageUrl}
        width={500}
        height={300}
        alt="banner"
        loading="lazy"
      />
      <Box p="5">
        <Text color="gray.500" fontSize="sm" fontWeight="medium">
          {purpose}
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          {title1}
          <br />
          {title2}
        </Text>
        <Text fontSize="lg" paddingTop="3" paddingBottom="3" color="gray.700">
          {desc1}
          <br />
          {desc2}
        </Text>
        <Button fontSize="xl">
          <Link href={linkName}>{buttonText}</Link>
        </Button>
      </Box>
    </Flex>
  )
);
Banner.displayName = "Banner"; // Set display name for memoized component

export default function Home({ propertiesForRent }) {
  const [propertiesForSale, setPropertiesForSale] = useState([]);
  const [loadingSale, setLoadingSale] = useState(false);

  // Function to fetch properties for sale, debounced to prevent multiple requests
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

  // Scroll event listener to load properties for sale when user scrolls
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
    <Box>
      
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

      <Flex flexWrap="wrap">
        {propertiesForRent.map((property) => (
          <Property property={property} key={property.id} />
        ))}
      </Flex>

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

      <Flex flexWrap="wrap">
        {loadingSale && (
          <Flex justifyContent="center" width="100%">
            <Spinner size="lg" />
          </Flex>
        )}

        {propertiesForSale.map((property) => (
          <Property property={property} key={property.id} />
        ))}
      </Flex>
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
