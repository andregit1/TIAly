// src/utils/generateSlug.js
const { nanoid } = require('nanoid');
const { Url } = require('../../models/Url');

const generateSlug = async () => {
    let slug;
    let isUnique = false;

    while (!isUnique) {
        slug = nanoid(6); // Generate a 6-character slug
        const existingUrl = await Url.findOne({ where: { slug } });
        if (!existingUrl) {
            isUnique = true;
        }
    }

    return slug;
};

module.exports = generateSlug;
