import axios from "axios";
import * as cheerio from "cheerio";

import { CONFIG } from "./config.js";
import { getCategoryPage } from "./services/getCategoryPage.js";
import { getListings } from "./services/getListings.js";

async function scrape() {

    console.log("Loading category...");

    // Get the category page
    const $ = await getCategoryPage(
        CONFIG.START_URL,
        CONFIG.HEADERS
    );

    // Extract all listings
    const listings = getListings($);

    console.log(`Found ${listings.length} listings`);

    // Take the first listing for testing
    const firstListing = listings[0];

    console.log(firstListing);

    // Download the detail page
    const response = await axios.get(
        firstListing.url,
        {
            headers: CONFIG.HEADERS
        }
    );

    // Load detail page into Cheerio
    const $$ = cheerio.load(response.data);

    // Print page title
    console.log($$("title").text());

    // -------------------------
    // PARAMETERS
    // -------------------------

    const parameters = {};

    $$(".flex.items-center.justify-between").each((_, element) => {

        const key = $$(element)
            .find(".text-gray-700")
            .text()
            .trim();

        const value = $$(element)
            .find(".text-gray-900")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        if (key) {
            parameters[key] = value;
        }

    });

    console.log(parameters);

}

scrape();