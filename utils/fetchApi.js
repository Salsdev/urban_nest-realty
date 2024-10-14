import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com'


export const fetchApi = async (url) => {
    const { data } = await axios.get((url), {
        headers: {
            'x-rapidapi-key': '86bc1c8819mshd29af31ab5072c6p1774b7jsn75ac0fd0e6d4',
            'x-rapidapi-host': 'bayut.p.rapidapi.com'
        }
    });

    return data;
}