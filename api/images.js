/*
 * @Author: lnquy065@gmail.com
 * @Date: 01/08/2022
 * @Last Modified by: quyln
 */

import fetch from "node-fetch";

const buildHtml = (context) => {
    return `
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${context.s}</title>
            <style>
                img {
                    width: ${context.width || '100%'};
                }
                .img-container {
                    display: grid;
                    grid-template-columns: auto auto;
                }
            </style>
        </head>
        <body>
            <div class="img-container">
                            ${context.images.join('')}

            </div>
        </body>
</html>
`;
};

export default async function handler(request, response) {
    const {
        s,
        width
    } = request.query;

    const rand = Math.floor(100000 + Math.random() * 900000)
    const imagesPromise = fetch(
        `https://yandex.com/images/search?text=${s}&suggest_reqid=${rand}750165932932167557145${rand}`,
        {
            method: "GET",
        }
    );


    const [imagesRes] = await Promise.all([imagesPromise])


    const [imagesHtml] = await Promise.all([imagesRes.text()]);

    let viewContext = {
        ...request.query
    }

    try {
        const imagesPattern =
            /<img class="serp-item__thumb justifier__thumb" src="(.*?)"/g;

        viewContext.images = []

        let array1;

        while ((array1 = imagesPattern.exec(imagesHtml)) !== null) {
            viewContext.images.push(array1[0] + '/>')
            if (viewContext.images.length >= 2) break;
        }
    } catch (e) {
        return response.status(200).send(imagesHtml);
    }

    return response.status(200).send(buildHtml(viewContext));
}
