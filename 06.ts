import * as R from 'https://x.nest.land/ramda@0.27.0/source/index.js';
const data = await Deno.readTextFile("./data/customs.txt");

// Part One

const countYes = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(
    R.replace(/\n/g, ""),
    R.split(''),
    R.uniq,
    R.length,
  )),
  R.sum,
  R.tap(console.log),
);

countYes(data)

// Part Two

const countYesAll = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(
    R.replace(/\n/g, " "),
    R.split(' '),
    x => R.reduce((memo, person) => {
      return R.intersection(memo, person);
    }, R.head(x), x),
    R.length,  
  )),
  R.sum,
  R.tap(console.log),
);
  
countYesAll(data)