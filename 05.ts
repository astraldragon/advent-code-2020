import * as R from 'https://x.nest.land/ramda@0.27.0/source/index.js';
const data = await Deno.readTextFile("./data/seats.txt").then(x => x.split('\n'))

// Part One

const rowMarkers = { lower: 'F', upper: 'B' }
const columnMarkers = { lower: 'L', upper: 'R' }

const binaryPartition = (min, max, markers) => R.reduce((rowPosition, marker) => {
  if (marker === markers.lower) {
    rowPosition = [rowPosition[0], Math.floor(rowPosition[1] - ((rowPosition[1] - rowPosition[0]) / 2))]
  }

  if (marker === markers.upper) {
    rowPosition = [Math.ceil(rowPosition[1] - ((rowPosition[1] - rowPosition[0]) / 2)), rowPosition[1]];
  }

  return rowPosition;
}, [min, max])

const rowFinder = R.pipe(
  R.split(''),
  R.take(7),
  binaryPartition(0, 127, rowMarkers),
  R.head,
)

const columnFinder = R.pipe(
  R.split(''),
  R.drop(7),
  R.take(3),
  binaryPartition(0, 7, columnMarkers),
  R.head,
)

const seatFinder = partitions => [rowFinder(partitions), columnFinder(partitions)]

const highestSeat = R.pipe(
  R.map(seatFinder),
  R.map(([row, column]) => 8 * row + column),
  R.sort(R.diff),
  R.takeLast(1),
  R.tap(console.log),
)

highestSeat(data)

// Part Two

const mySeat = R.pipe(
  R.map(seatFinder),
  R.map(([row, column]) => 8 * row + column),
  R.sort(R.diff),
  usedSeats => R.difference(
    R.range(R.head(usedSeats), R.head(R.reverse(usedSeats)) + 1), 
    usedSeats
  ),
  R.tap(console.log),
)

mySeat(data)