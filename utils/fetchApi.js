import axios from "axios";

export const baseUrl = "https://bayut.p.rapidapi.com";

export const fetchApi = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      'x-rapidapi-key': '86c66f958bmsh3480764d1c77f38p1b8575jsndb258641ae48',
      'x-rapidapi-host': 'bayut.p.rapidapi.com'
    },
  });

  return data;
};
