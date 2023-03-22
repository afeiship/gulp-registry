# gulp-registry
> My common gulp registry.

## installation
```shell
npm i @jswork/gulp-registry -D
```

## usage
```js
const gulp = require("gulp");
const { TailwindRegistry, CleanRegistry } = require("@jswork/gulp-registry");
const reg1 = new TailwindRegistry({ src: "./styles/index.scss", dst: "./public/" });
const reg2 = new CleanRegistry({ dst: "./public/" });

[reg1, reg2].forEach((reg) => gulp.registry(reg));
```

```conf
$ npx gulp -T
[11:02:08] Tasks for ~/aric-notes/tailwindcss-notes/pure-html/gulpfile.js
[11:02:08] ├── tailwind
[11:02:08] └── clean
```
