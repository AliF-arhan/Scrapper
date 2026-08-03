import axios from "axios";
import * as cheerio from "cheerio";

export async function getDetails(url, headers) {

    const response = await axios.get(url, {
        headers
    });

    const $ = cheerio.load(response.data);

    const data = {

        title: "",

        description: "",

        features: [],

        parameters: {},

        images: [],

        brochure: null

    };

    /*
      Fill these sections after inspecting the HTML.
      For example:

      data.title = $("h1").text().trim();

      data.description = $(".description").text().trim();

      $(".feature").each(...);

      $(".parameter").each(...);

      $("img").each(...);

      $("a[href$='.pdf']");
    */

    return data;

}