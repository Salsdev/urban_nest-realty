import { useState } from "react";
import { Flex, Select, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { filterData, getFilterValues } from "../utils/filterData";

const SearchFilters = () => {
  const [filters] = useState(filterData); // Keep filter data
  const router = useRouter();

  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;

    // Clone the query object to avoid direct mutation
    const newQuery = { ...query };

    // Update the query object with the new filter values
    const values = getFilterValues(filterValues);
    values.forEach((item) => {
      if (item.value && filterValues?.[item.name]) {
        newQuery[item.name] = item.value;
      } else {
        delete newQuery[item.name]; // Remove filters if not selected
      }
    });

    // Push the updated query with shallow: false to trigger full re-render
    router.push({ pathname: path, query: newQuery }, undefined, {
      shallow: false,
    });
  };

  const handleFilterChange = (filterName, value) => {
    searchProperties({ [filterName]: value });
  };

  return (
    <Flex bg="gray.100" p="4" justifyContent="center" flexWrap="wrap">
      {filters.map((filter) => (
        <Box key={filter.queryName}>
          <Select
            placeholder={filter.placeholder}
            w="fit-content"
            p="2"
            onChange={(e) =>
              handleFilterChange(filter.queryName, e.target.value)
            }
          >
            {filter?.items?.map((item) => (
              <option value={item.value} key={item.value}>
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
