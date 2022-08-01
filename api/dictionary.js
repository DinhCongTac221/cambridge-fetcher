/*
 * @Author: lnquy065@gmail.com
 * @Date: 01/08/2022
 * @Last Modified by: quyln
 */

const fetch = require('node-fetch')

export default async function handler(request, response) {
    const { s, gram, pron, autoplay,  } = request.query;

    const res = await fetch(`https://dictionary.cambridge.org/us/dictionary/english/${s}`, {
        method: 'GET'
    });

    console.log(res)
    const html = res

    let result = {}

    const gramPattern = /div class="posgram dpos-g hdib lmr-5"(?=.*?)>(.*?)<\/div>/g
    result.gram = gramPattern.exec(html)

    const pronPattern = /span class="ipa dipa lpr-2 lpl-1"(?=.*?)>(.*?)<\/span>/g
    result.pron = '/' + pronPattern.exec(html) + '/'

    const audioPattern = /src="(\/us\/media\/english\/us_pron\/(.*?).mp3)"/g
    result.pron = 'https://dictionary.cambridge.org' + audioPattern.exec(html) + '/'

    console.log(result)
    return response.status(200).send({ data });
}