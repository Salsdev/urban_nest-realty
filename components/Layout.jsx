import Head from "next/head";
import { Box } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => (
    <>
    <Head>
        <title> Real Estate</title>
    </Head>
    <Box maxWidth="1280px" m="auto" bgGradient="linear(to-br, gray.900, gray.800)" >
        <header>
             <Navbar />
        </header>
        <main>
            {children}
        </main>
        <footer>
            <Footer />
        </footer>
    </Box>
    </>

);
export default Layout;