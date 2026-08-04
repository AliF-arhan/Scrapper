import axios from "axios";
import * as cheerio from "cheerio";

const IMG_BASE = "https://sanyglobal-img.sany.com.cn";
const SITE_BASE = "https://www.sanyglobal.com";

export async function getDetails(url, headers) {

    const response = await axios.get(url, { headers });

    const $ = cheerio.load(response.data);

    // ---------------------------------------------------
    // Find the React Flight script that contains product data
    // ---------------------------------------------------

    let flight = "";

    $("script").each((_, el) => {

        const text = $(el).html() || "";

        if (
            text.includes("self.__next_f.push") &&
            text.includes("attributeDataList")
        ) {
            flight = text;
        }

    });

    if (!flight) {
        throw new Error("Could not locate React Flight data.");
    }

    // ---------------------------------------------------
    // Decode escaped quotes
    // ---------------------------------------------------

    let decoded = flight
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

    // ---------------------------------------------------
    // Locate the embedded object
    // ---------------------------------------------------

    const marker = '"data":{"product":';

    const start = decoded.indexOf(marker);

    if (start === -1) {
        throw new Error("Could not locate product object.");
    }

    // Start at the opening {
    let i = decoded.indexOf("{", start);

    let depth = 0;
    let end = -1;
    let inString = false;

    for (; i < decoded.length; i++) {

        const ch = decoded[i];

        if (ch === '"' && decoded[i - 1] !== "\\") {
            inString = !inString;
        }

        if (inString) continue;

        if (ch === "{") depth++;

        if (ch === "}") {

            depth--;

            if (depth === 0) {
                end = i;
                break;
            }

        }

    }

    if (end === -1) {
        throw new Error("Could not determine end of product object.");
    }

    let json = decoded.substring(start + 7, end + 1);

    const data = JSON.parse(json);

    // ---------------------------------------------------
    // Parameters
    // ---------------------------------------------------

    const parameters = {};

    for (const group of data.attributeDataList) {

        for (const attr of group.attributesList) {

            parameters[attr.attrName] =
                attr.attrValue + (attr.attrUnit || "");

        }

    }

    // ---------------------------------------------------
    // Features
    // ---------------------------------------------------

    const features = data.featureList.map(f => ({
        title: f.featName,
        description: f.featDesc
    }));

    // ---------------------------------------------------
    // Images
    // ---------------------------------------------------

    const images = data.images.images
        .split(",")
        .map(img => IMG_BASE + img);

    // ---------------------------------------------------
    // Brochure
    // ---------------------------------------------------

    let brochure = null;

    if (data.product.extendsInfo) {

        const ext = JSON.parse(data.product.extendsInfo);

        if (ext.brochure) {
            brochure = SITE_BASE + ext.brochure;
        }

    }

    return {

        title: data.product.productNo,

        description: data.product.productDesc,

        parameters,

        features,

        images,

        brochure

    };

}