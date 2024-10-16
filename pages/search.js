import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon, Spinner } from "@chakra-ui/react";
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

  // Function to load more properties as the user scrolls
  const loadMoreProperties = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    // Fetch next set of properties
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

  // Observer to load more properties when the last one is in view
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

  // Re-fetch properties if the search filters (query) change with debounce for performance
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
      }, 300); // Debounce for 300ms
    };

    fetchFilteredProperties();
  }, [router.query.purpose]); // Re-run when purpose changes

  return (
    <Box>
      <Flex
        cursor="pointer"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
        p="2"
        fontWeight="black"
        fontSize="lg"
        justifyContent="center"
        alignItems="center"
        onClick={() => setSearchFilters((prevFilters) => !prevFilters)}
      >
        <Text>Search Property By Filter</Text>
        <Icon paddingleft="2" w="7" as={BsFilter} />
      </Flex>

      {searchFilters && <SearchFilters />}

      <Text fontSize="2xl" p="4" fontWeight="bold">
        Properties{" "}
        {router.query.purpose === "for-sale" ? "for Sale" : "for Rent"}
      </Text>

      <Flex flexWrap="wrap">
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
      </Flex>

      {loading && (
        <Flex justifyContent="center" mt="4">
          <Spinner size="lg" />
        </Flex>
      )}

      {properties.length === 0 && !loading && (
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          marginTop="5"
          marginBottom="5"
        >
          <Image alt="no result" src={noresult} />
          <Text fontSize="2xl" marginTop="3">
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
  const hitsPerPage = 10; // Fetch 10 properties per page
  const page = 1; // Start from page 1

  // Fetch the initial set of properties
  const data = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}&hitsPerPage=${hitsPerPage}&page=${page}&fields=title,price,coverPhoto,rentFrequency`
  );

  return {
    props: {
      initialProperties: data?.hits || [],
      totalCount: data?.totalCount || 0, // Track total count for further loading
    },
  };
}
