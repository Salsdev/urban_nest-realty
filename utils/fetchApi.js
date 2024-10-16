import axios from "axios";

export const baseUrl = "https://bayut.p.rapidapi.com";

export const fetchApi = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "x-rapidapi-key": "604545b2f0msh9e5b80be7a97ae0p13f4e8jsn16833febe654",
      "x-rapidapi-host": "bayut.p.rapidapi.com",
    },
  });

  return data;
};
