export function getListings($) {

    const listings = [];

    $(".sro-right-word2-span").each((_, element) => {

        listings.push({

            title: $(element).attr("title"),

            url: $(element).attr("href")

        });

    });

    return listings;

}