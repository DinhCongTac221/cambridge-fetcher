# Cambridge Crawler

Fetching meaning, pronunciation, audio (US), examples, images from Cambridge
& Yandex. Supporting Anki template.

You are bored when add new words to your Anki desk by typing word, meaning, example and evenly can't attach audio.

Now with this template, you just input your word and let the rest for Cambridge Crawler.

## APIs:

### Dictionary

Get details a word: meaning, pronunciation, audio, example sentences.

```
https://cambridge-fetcher.vercel.app/api/dictionary?s=<WORD>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/pic-dictionary.png"/>
</p>

### Meaning

Get short meaning

```
https://cambridge-fetcher.vercel.app/api/meaning?s=<WORD>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/pic-meaning.png"/>
</p>

### Images

Get images based on word

```
https://cambridge-fetcher.vercel.app/api/images?s=<WORD>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/pic-images.png"/>
</p>

## Anki implementation

### Prerequisite configuration

Following pictures below

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/tut-1.png"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/tut-2.png"/>
</p>

At this point, change the template according to the code below

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/tut-3.png"/>
</p>

#### Front Template

```html
<h1>{{Front}}</h1>

<iframe class="cb-front cb-meaning" 
src="https://cambridge-fetcher.vercel.app/api/meaning?s={{Front}}"
></iframe>

```

#### Back Template

```html
<h1>{{Front}}</h1>

<hr>

<div class="cb-back cb-grid">

	<div>
<iframe class="cb-back cb-dictionary" src="https://cambridge-fetcher.vercel.app/api/dictionary?s={{Front}}">
</iframe>
	</div>
<div>

```

#### Styling

```css
.card {
    font-family: arial;
    font-size: 20px;
    text-align: center;
    color: black;
    background-color: white;
}

.cb-front.cb-images {
	height: 50vh;
	width: 50vw;
}

.cb-front.cb-meaning {
	height: 30vh;
	width: 50vw;
}

.cb-back.cb-grid {
display: grid;
grid-template-columns: auto;
height: 80vh;
}

.cb-back.cb-dictionary {
	width:100%;
height: 100%;
}

@media only screen and (max-width: 600px) {
  .cb-front.cb-images {
	width: calc(100vw - 3rem);
}

.cb-front.cb-meaning {
	width: calc(100vw - 3rem);
}

.cb-back.cb-grid {
grid-template-columns: auto;
}

.cb-back.cb-dictionary {
	height: 100vh;
}
}
```

### Adding words

Just input your word to Front, leave Back empty.

<p align="center">
  <img src="https://raw.githubusercontent.com/lnquy065/cambridge-fetcher/main/readme/tut-4.png"/>
</p>


## License

MIT © [lnquy065](https://github.com/lnquy065)
