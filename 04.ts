import * as R from 'https://x.nest.land/ramda@0.27.0/source/index.js';
const data = await Deno.readTextFile("./data/passports.txt");

// Part One

const toPairs = R.pipe(
  R.replace(/\n/g, " "),
  R.split(" "),
  R.map(R.split(":")),
);

const parsePassports = R.pipe(
  R.split("\n\n"),
  R.map(toPairs),
);

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const containsRequiredField = fields => R.includes(
  R.__,
  fields,
);

const containsRequiredFields = fields => R.pipe(
  R.filter(([key]) => containsRequiredField(fields)(key)),
  R.length,
  R.equals(fields.length),
)

const countValidPassportsFieldsPresent = R.pipe(
  parsePassports,
  R.filter(containsRequiredFields(requiredFields)),
  R.length,
);

console.log(countValidPassportsFieldsPresent(data));

// Part Two

const validateNumberLength = (length) => R.test(new RegExp(`^\\d{${length}}$`));
const validateNumberRange = (min, max) =>
  R.allPass([
    (x) => R.gte(parseInt(x), min),
    (x) => R.lte(parseInt(x), max),
  ]);

const validateHeight = (measure, minLength, min, max, value) =>
  R.curry(
    R.allPass([validateNumberLength(minLength), validateNumberRange(min, max)]),
  )(parseInt(R.replace(measure, "", value)));

const fieldValidations = {
  byr: R.allPass([validateNumberLength(4), validateNumberRange(1920, 2002)]),
  iyr: R.allPass(
    [validateNumberLength(4), R.gte(R.__, 2010), R.lte(R.__, 2020)],
  ),
  eyr: R.allPass([validateNumberLength(4), validateNumberRange(2020, 2030)]),
  hgt: R.cond([
    [R.includes("cm"), (x) => validateHeight("cm", 3, 150, 193, x)],
    [R.includes("in"), (x) => validateHeight("in", 2, 59, 76, x)],
    [R.T, R.F],
  ]),
  hcl: R.test(/^#[0-9a-f]{6}$/g),
  ecl: R.includes(R.__, ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]),
  pid: R.allPass([validateNumberLength(9)]),
  cid: R.T,
};

const validatePassportProperties = R.all(([key, value]) => R.invoker(1, key)(value, fieldValidations))
const countValidPassports = R.pipe(
  parsePassports,
  R.filter(containsRequiredFields(requiredFields)),
  R.filter(validatePassportProperties),
  R.length,
);

console.log(countValidPassports(data));
