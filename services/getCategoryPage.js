import axios from "axios";
import * as cheerio from "cheerio";

export async function getCategoryPage(url, headers) {

    const response = await axios.get(url, {
        headers
    });

    return cheerio.load(response.data);
    
}