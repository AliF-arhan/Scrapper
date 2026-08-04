import { CONFIG } from "./config.js";

import { getCategoryPage } from "./services/getCategoryPage.js";
import { getListings } from "./services/getListings.js";
import { getDetails } from "./services/getDetails.js";

async function scrape() {

    console.log("Loading category page...");

    // Load category page
    const $ = await getCategoryPage(
        CONFIG.START_URL,
        CONFIG.HEADERS
    );

    // Get all listings
    const listings = getListings($);

    console.log(`Found ${listings.length} listings\n`);

    const machines = [];

    // Loop through every listing
    for (let i = 0; i < listings.length; i++) {

        const listing = listings[i];

        console.log(`====================================`);
        console.log(`Machine ${i + 1} / ${listings.length}`);
        console.log(`Model: ${listing.title}`);
        console.log(`URL: ${listing.url}`);
        console.log(`====================================`);

        try {

            const machine = await getDetails(
                listing.url,
                CONFIG.HEADERS
            );

            machines.push(machine);

            console.log("✅ Success\n");

        } catch (err) {

            console.log("❌ Failed");
            console.log(err.message);
            console.log();

        }
    }

    console.log("\n====================================");
    console.log("SCRAPING COMPLETE");
    console.log("====================================");

    console.log(`Successfully scraped ${machines.length} machines.\n`);

    console.dir(machines, {
        depth: null
    });

}

scrape();