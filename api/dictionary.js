/*
 * @Author: lnquy065@gmail.com
 * @Date: 01/08/2022
 * @Last Modified by: quyln
 */

import fetch from 'node-fetch';

export default async function handler(request, response) {
    const { s, gram, pron, autoplay,  } = request.query;

    const res = await fetch(`https://dictionary.cambridge.org/us/dictionary/english/${s}`, {
        method: 'GET'
    });

    console.log(res)

    return response.status(200).send({ data });
}