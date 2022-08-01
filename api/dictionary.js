/*
 * @Author: lnquy065@gmail.com
 * @Date: 01/08/2022
 * @Last Modified by: quyln
 */

import fetch from "node-fetch";


export default async function handler(request, response) {
    const { s, gram, pron, autoplay,  } = request.query;

    const res = await fetch(`https://dictionary.cambridge.org/us/dictionary/english/${s}`, {
        method: 'GET'
    });

    const html = await res.text()

    let result = {}

    const gramPattern = /div class="posgram dpos-g hdib lmr-5"(?=.*?)>(.*?)<\/div>/g
    result.gram = gramPattern.exec(html)[1]

    const pronPattern = /span class="ipa dipa lpr-2 lpl-1"(?=.*?)>(.*?)<\/span>/g
    result.pron = '/' + pronPattern.exec(html)[1] + '/'

    const audioPattern = /src="(\/us\/media\/english\/us_pron\/(.*?).mp3)"/g
    result.audio = 'https://dictionary.cambridge.org' + audioPattern.exec(html)[1]

    const meanPattern = /<div class="def ddef_d db">(.*?)<\/div>/g
    result.meanPattern = meanPattern.exec(html)[1]

    const examPattern = /<div class="def-body ddef_b">(.*?)<\/div><\/div>/g
    result.exam = examPattern.exec(html)[1]

    const wordPattern = /<span class="hw dhw">(.*?)<\/span>/g
    result.word = wordPattern.exec(html)[1]

    return response.status(200).send(`
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>${s}</title>
                 <style>
    a {
      color: inherit !important;
    }
  </style>
            </head>
            <body>
            
            <div style="text-align: center;margin-bottom: .8rem">
  <strong style="font-size: 2rem;color: darkblue">${result.word}</strong>
    -
  <strong style="font-size: 2rem;color: cornflowerblue">${result.pron}</strong>
</div>
            
            <div style="text-align: center;margin-bottom: .5rem">
  <strong>
    ${result.meanPattern}
  </strong>
</div>

<div style="text-align: center;color: green;margin-bottom: .5rem">
  <strong>
 ${result.gram}
  </strong>
</div>


<div style="text-align: center">
  <audio autoplay controls src="${result.audio}"/>
</div>
<hr/>
<div  style="text-align: center">
    ${result.exam}
</div>
</body>
            </html>
    
    `);
}