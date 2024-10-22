import { useState } from "react";
import { Flex, Select, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { filterData, getFilterValues } from "../utils/filterData";

const SearchFilters = () => {
  const [filters] = useState(filterData);
  const router = useRouter();

  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;
    const newQuery = { ...query };

    const values = getFilterValues(filterValues);
    values.forEach((item) => {
      if (item.value && filterValues?.[item.name]) {
        newQuery[item.name] = item.value;
      } else {
        delete newQuery[item.name];
      }
    });

    router.push({ pathname: path, query: newQuery }, undefined, {
      shallow: false,
    });
  };

  const handleFilterChange = (filterName, value) => {
    searchProperties({ [filterName]: value });
  };

  return (
    <Flex
      bgGradient="linear(to-br, gray.900, gray.800)"
      p="6"
      justifyContent="center"
      flexWrap="wrap"
      borderRadius="lg"
      boxShadow="2xl" 
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ boxShadow: "3xl", transform: "scale(1.02)" }} 
    >
      {filters.map((filter) => (
        <Box key={filter.queryName} m="2" boxShadow="lg" borderRadius="md"> 
          <Select
            placeholder={filter.placeholder}
            bg="gray.900"
            color="white"
            w={{ base: "100%", md: "fit-content" }}
            borderRadius="md"
            border="none"
            _hover={{ bg: "gray.800" }}
            boxShadow="md" 
            _focus={{ outline: "none", boxShadow: "outline" }}
            transition="background 0.2s ease"
            onChange={(e) =>
              handleFilterChange(filter.queryName, e.target.value)
            }
          >
            {filter?.items?.map((item) => (
              <option
                value={item.value}
                key={item.value}
                style={{ backgroundColor: "#1a202c", color: "#fff" }}
              >
                {item.name}
              </option>
            ))}
          </Select>
        </Box>
      ))}
    </Flex>
  );
};

export default SearchFilters;
