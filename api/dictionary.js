/*
 * @Author: lnquy065@gmail.com
 * @Date: 01/08/2022
 * @Last Modified by: quyln
 */

import fetch from "node-fetch";

const buildHtml = (result) => {
    return `
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${result.s}</title>
            <style>
                body {
                    font-family: ${result.style.body.fontFamily};
                    background-color: ${result.style.body.backgroundColor};
                }
            
                a {
                  color: inherit !important;
                  text-decoration: none;
                }
                
                .dsp {
                    position: relative;
                    line-height: 0;
                    vertical-align: baseline;
                    top: -0.5em;
                    font-size: 75%;
                }
                
                .examp.dexamp {
                    line-height: 1.5;
                    font-style: italic;
                }
                
                .dexamp::before {
                    content: "•";
                    display: inline-block;
                }
                
                #pron {
                    display: ${result.display.pron};
                }
                #mean {
                    display: ${result.display.pron};
                }
                #gram {
                    display: ${result.display.pron};
                }
                #audio {
                    display: ${result.display.pron};
                }
                #example {
                    display: ${result.display.pron};
                }
                
                .dsense_h { 
                    margin-bottom: 12px;
                    padding-top: 10px;
                    color: #5d2fc1;
                    font-size: 1rem;
                    font-weight: 700;
                }
                
                .def.ddef_d.db {
                    margin-top: 10px;
                    font-size: 18px;
                    line-height: 1.5;
                    color: #1d2a57;
                    font-weight: bold;
                }
                
                .dwl {
                    position: relative;
                    margin-top: 2px;
                    border-top: solid thin #fec400;
                }
                
                .ddef_h {
                    margin: 15px 0 15px;
                }
                
                .examp.dexamp {
                    margin-right: 22px;
                    position: relative;
                    font-size: 17px;
                    margin-bottom: 10px;
                    line-height: 1.4;
                }
                
                .db {
                    font-weight: bold;
                }
                
                .def-info.ddef-info {
                    font-size: .8rem;
                }
                
                .dexamp::before {
                    content: "•";
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                
                .eg.deg {
                    padding-left: 15px;
                }
                
                .pr.phrase-block.dphrase-block, .daccord, .bb.hax {
                    display: none;
                }
            </style>
        </head>
        <body>
        
            <div id="pron" style="text-align: center;margin-bottom: .8rem">
              <strong class="cword" style="font-size: 2rem;color: darkblue">${result.word}</strong>
                <strong style="font-size: 1rem">•</strong>
              <strong class="cpron" style="font-size: 2rem;color: cornflowerblue">${result.pron}</strong>
            </div>
            
            <div id="audio" style="text-align: center">
              <audio autoplay controls src="${result.audio}" controlsList="play nodownload notimeline noremoteplayback noplaybackrate novolume"/>
            </div>
            <hr/>
            ${result.image? `
                <div>
                    <img style="display: block; margin: 0 auto" src="https://dictionary.cambridge.org${result.image}" alt="${result.s}"/>
                </div>
            `:''}
            <div id="example">
                ${result.examples}
            </div>
        </body>
</html>
`;
};

export default async function handler(request, response) {
    const {
        s, gram, pron, examples, mean, audio,
        styleFontFamily,
        styleBodyBackgroundColor,
        styleTextWordColor,
        styleTextPronColor,
        styleTextMeanColor,
        styleTextGramColor,
        styleTextExampleColor,
        translateFrom
    } = request.query;

    const dictionaryPromise = fetch(
        `https://dictionary.cambridge.org/us/dictionary/english/${s}`,
        {
            method: "GET",
        }
    );

    const translatePromise = fetch(
        `https://yandex.com/images/search?text=${s}`,
        {
            method: "GET"
        }
    )

    const [dictionaryRes, translateRes] = await Promise.all([dictionaryPromise, translatePromise])


    const [dictionaryHtml, translateHtml] = await Promise.all([dictionaryRes.text(), translateRes.text()]);

    let viewContext = {
        s,
        style: {
            body: {
                fontFamily: styleFontFamily || 'Arial',
                backgroundColor: styleBodyBackgroundColor || '#FFFFFF'
            },
            text: {
                wordColor: styleTextWordColor || 'darkblue',
                pronColor: styleTextPronColor || 'cornflowerblue',
                meanColor: styleTextMeanColor || 'black',
                gramColor: styleTextGramColor || 'green',
                exampleColor: styleTextExampleColor || 'black',
            }
        },
        display: {
            gram: gram || 'block',
            pron: pron || 'block',
            examples: examples || 'block',
            mean: mean || 'block',
            audio: audio || 'block'
        }
    };

    try {
        const gramPattern =
            /div class="posgram dpos-g hdib lmr-5"(?=.*?)>(.*?)<\/div>/g;
        viewContext.gram = gramPattern.exec(dictionaryHtml)[1];

        const pronPattern =
            /span class="ipa dipa lpr-2 lpl-1"(?=.*?)>(.*?)<\/span>\//g;
        viewContext.pron = "/" + pronPattern.exec(dictionaryHtml)[1] + "/";

        const audioPattern = /src="(\/us\/media\/english\/us_pron\/(.*?).mp3)"/g;
        viewContext.audio =
            "https://dictionary.cambridge.org" + audioPattern.exec(dictionaryHtml)[1];

        const examplePattern = /<div class="pos-body">(.*?)<\/div><\/div><\/div><\/div><\/div>/gs;
        viewContext.examples = examplePattern.exec(dictionaryHtml)[1]

        const wordPattern = /<span class="hw dhw">(.*?)<\/span>/g;
        viewContext.word = wordPattern.exec(dictionaryHtml)[1];

        const imagePattern = /<amp-img class="dimg_i hp" src="(.*?)"/g
        let img =  imagePattern.exec(dictionaryHtml);
        if (img) {
            viewContext.image = img[1]
        }
    } catch (e) {
        console.log(e);
        return response.status(200).send(dictionaryHtml);
    }

    return response.status(200).send(buildHtml(viewContext));
}
