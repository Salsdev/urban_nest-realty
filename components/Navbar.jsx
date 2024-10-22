import Link from "next/link";
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Flex, Box, Spacer } from "@chakra-ui/react";
import { FcMenu, FcHome, FcAbout } from "react-icons/fc";
import { BsSearch } from "react-icons/bs";
import { FiKey } from "react-icons/fi";

const Navbar = () => (
    <Flex 
        p="4" 
        borderBottom="1px" 
        borderColor="gray.600" 
        bgGradient="linear(to-br, gray.900, gray.800)"
        alignItems="center"
    >
        
        <Box
  fontSize="4xl" 
  fontWeight="extrabold"
  bgGradient="linear(to-r, teal.500, blue.500)" 
  bgClip="text" 
>
  <Link href="/" paddingleft="2">
    Urban_Nest
  </Link>
</Box>
        <Spacer />
        
       
        <Box>
            <Menu>
                <MenuButton 
                    as={IconButton} 
                    icon={<FcMenu />} 
                    variant="outline" 
                    color="whiteAlpha.900" 
                    borderColor="whiteAlpha.300" 
                    _hover={{ bg: "whiteAlpha.200" }} 
                />
                <MenuList
  bgGradient="linear(to-r, teal.500, blue.500)" 
  borderColor="gray.600"
  boxShadow="2xl"
  borderRadius="md"
>
  <Link href="/" passHref>
    <MenuItem
      icon={<FcHome />}
      bgGradient="linear(to-r, teal.500, blue.500)"
      _hover={{ bg: "blue.600", transform: "scale(1.02)", transition: "0.3s ease" }}
      color="white" 
    >
      Home
    </MenuItem>
  </Link>

  <Link href="/search" passHref>
    <MenuItem
      icon={<BsSearch />}
      bgGradient="linear(to-r, teal.500, blue.500)"
      _hover={{ bg: "blue.600", transform: "scale(1.02)", transition: "0.3s ease" }}
      color="white" 
    >
      Search
    </MenuItem>
  </Link>

  <Link href="/search?purpose=for-sale" passHref>
    <MenuItem
      icon={<FcAbout />}
      bgGradient="linear(to-r, teal.500, blue.500)"
      _hover={{ bg: "blue.600", transform: "scale(1.02)", transition: "0.3s ease" }}
      color="white" 
    >
      Buy Property
    </MenuItem>
  </Link>

  <Link href="/search?purpose=for-rent" passHref>
    <MenuItem
      icon={<FiKey />}
      bgGradient="linear(to-r, teal.500, blue.500)"
      _hover={{ bg: "blue.600", transform: "scale(1.02)", transition: "0.3s ease" }}
      color="white" 
    >
      Rent Property
    </MenuItem>
  </Link>
</MenuList>

            </Menu>
        </Box>
    </Flex>
);

export default Navbar;
