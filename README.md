# Cambridge Crawler

Fetch word, meaning, pronunciation, audio (US), examples from Cambridge

Endpoint: 

```
https://cambridge-fetcher.vercel.app/api/dictionary?s=<WORD>
```

### Anki implement

Back card template

```html
{{FrontSide}}
{{Back}}
<hr>
<div style="width:80%;height:60vh;margin: 0px auto">
  <iframe src="https://cambridge-fetcher.vercel.app/api/dictionary?s={{Front}}" style="width:100%;height: 100%"/>
</div>
```

## License

MIT © [lnquy065](https://github.com/lnquy065)