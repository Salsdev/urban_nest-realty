import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon, Spinner, Grid } from "@chakra-ui/react";
import { BsFilter } from "react-icons/bs";
import dynamic from "next/dynamic";
import Property from "../components/Property";
import noresult from "../assets/noresult.svg";
import { fetchApi, baseUrl } from "../utils/fetchApi";

// Dynamically load the SearchFilters component
const SearchFilters = dynamic(() => import("../components/SearchFilters"), {
  ssr: false,
});

const Search = ({ initialProperties, totalCount }) => {
  const [searchFilters, setSearchFilters] = useState(false);
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const observer = useRef();
  const debounceRef = useRef(null);

  
  const loadMoreProperties = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

  
    const data = await fetchApi(
      `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=${
        router.query.purpose || "for-rent"
      }&hitsPerPage=10&page=${nextPage}&fields=title,price,coverPhoto,rentFrequency`
    );

    setProperties((prevProperties) => [
      ...prevProperties,
      ...(data?.hits || []),
    ]);
    setPage(nextPage);

    if (data?.hits?.length === 0 || properties.length >= totalCount) {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore, properties.length, router.query.purpose]);

  
  const lastPropertyElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProperties();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreProperties]
  );

  
  useEffect(() => {
    const fetchFilteredProperties = async () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        const data = await fetchApi(
          `${baseUrl}/properties/list?locationExternalIDs=5002&purpose=${
            router.query.purpose || "for-rent"
          }&hitsPerPage=10&page=1&fields=title,price,coverPhoto,rentFrequency`
        );
        setProperties(data?.hits || []);
        setPage(1);
        setHasMore(true);
        setLoading(false);
      }, 300);
    };

    fetchFilteredProperties();
  }, [router.query.purpose]); 

  return (
    <Box>
      
      <Flex
        cursor="pointer"
        bgGradient="linear(to-br, gray.900, gray.800)"
        borderBottom="1px"
        borderColor="gray.700"
        p="4"
        fontWeight="bold"
        fontSize="lg"
        justifyContent="center"
        alignItems="center"
        onClick={() => setSearchFilters((prevFilters) => !prevFilters)}
      >
        <Text color="whiteAlpha.900">Search Property By Filter</Text>
        <Icon pl="2" w="7" as={BsFilter} color="teal.400" />
      </Flex>

      
      {searchFilters && <SearchFilters />}

      
      <Text fontSize="3xl" fontWeight="bold" p="4" color="whiteAlpha.900" textAlign="center">
        Properties {router.query.purpose === "for-sale" ? "for Sale" : "for Rent"}
      </Text>

      
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6} 
        padding={4}
        width="100%"
      >
        {properties.map((property, index) => {
          if (properties.length === index + 1) {
            return (
              <Box ref={lastPropertyElementRef} key={property.id}>
                <Property property={property} />
              </Box>
            );
          } else {
            return <Property property={property} key={property.id} />;
          }
        })}
      </Grid>

      
      {loading && (
        <Flex justifyContent="center" mt="4">
          <Spinner size="lg" color="teal.400" />
        </Flex>
      )}

      
      {properties.length === 0 && !loading && (
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          mt="5"
          mb="5"
        >
          <Image alt="no result" src={noresult} />
          <Text fontSize="2xl" mt="3" color="whiteAlpha.900">
            No Results Found.
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  const purpose = query.purpose || "for-rent";
  const rentFrequency = query.rentFrequency || "yearly";
  const minPrice = query.minPrice || "0";
  const maxPrice = query.maxPrice || "1000000";
  const roomsMin = query.roomsMin || "0";
  const bathsMin = query.bathsMin || "0";
  const sort = query.sort || "price-desc";
  const areaMax = query.areaMax || "35000";
  const locationExternalIDs = query.locationExternalIDs || "5002";
  const categoryExternalID = query.categoryExternalID || "4";
  const hitsPerPage = 10; 
  const page = 1; 

  
  const data = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}&hitsPerPage=${hitsPerPage}&page=${page}&fields=title,price,coverPhoto,rentFrequency`
  );

  return {
    props: {
      initialProperties: data?.hits || [],
      totalCount: data?.totalCount || 0, 
    },
  };
}
