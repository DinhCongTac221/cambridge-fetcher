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
            .def {
            font-size: 1.5rem;
            }
               .def.ddef_d.db a {
                   text-decoration: none !important;
                   color: inherit !important;
               }
            </style>
        </head>
        <body>
            ${context.meaning.join('')}
              ${context.image? `
                <div>
                    <img style="display: block; margin: 0 auto" src="https://dictionary.cambridge.org${context.image}" alt="${context.s}"/>
                </div>
            `:''}
        </body>
</html>
`;
};

export default async function handler(request, response) {
    const {
        s,
        width
    } = request.query;

    const meaningPromise = fetch(
        `https://dictionary.cambridge.org/us/dictionary/english/${s}`,
        {
            method: "GET",
        }
    );


    const [meaningRes] = await Promise.all([meaningPromise])


    const [meaningHtml] = await Promise.all([meaningRes.text()]);

    let viewContext = {
        ...request.query
    }

    try {
        const meaningPattern =
            /<div class="def ddef_d db">(.*?)<\/div>/g;

        viewContext.meaning = []

        let array1;

        while ((array1 = meaningPattern.exec(meaningHtml)) !== null) {
            viewContext.meaning.push(array1[0])
            if (viewContext.meaning.length >= 3) break;
        }

        const imagePattern = /<amp-img class="dimg_i hp" src="(.*?)"/g
        let img =  imagePattern.exec(meaningHtml);
        if (img) {
            viewContext.image = img[1]
        }
    } catch (e) {
        console.log(e)
        return response.status(200).send(meaningHtml);
    }

    return response.status(200).send(buildHtml(viewContext));
}
