export const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const clean = (text) =>
    text.replace(/\s+/g, " ").trim();