# mål

- en listning av två slumpmässiga färger och nyanserna mellan dessa två samt svart och vitt. vid hover på en färgbox så ska namnet på respektive färg visas.

# status

- för att kunna importera kod från t.ex. npm-paket eller bara straight-up filer (typ .json eller .csv) så behöver en bundler baka ihop allting till en sammanslagen fil. Detta för att webbläsare visst inte förstår sig på ES6:s _import_ och _export_ nyckelord.
- se därför till att bundlern är up and running och att den spottar ut rätt grejer i _dist.js_ (och att denna är länkad i index.html)
- det är troligtvis det som gör att denna appen inte fungerar i nuläget
