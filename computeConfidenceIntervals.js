self.onmessage = (event) => {
  const data = event.data;
  const outcomes = computeConfidenceInterals(
    data.totalRuns,
    data.itemsTarget,
    data.throughputs,
    new Date(data.startingDate)
  );

  self.postMessage([...outcomes.entries()]);
  self.close();
}

function computeConfidenceInterals(TOTAL_RUNS, ITEMS_TARGET, THROUGHPUTS, START_DATE) {
  const outcomes = new Map();

  for (let i = 0; i < TOTAL_RUNS; i++) {
    let currentDate = new Date(START_DATE.getTime());
    let storiesCompleted = 0;

    while (storiesCompleted < ITEMS_TARGET) {
      let randomIndex = randomIntFromInterval(0, THROUGHPUTS.length - 1);
      storiesCompleted += THROUGHPUTS[randomIndex];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const timestamp = currentDate.getTime().toString();
    const count = outcomes.get(timestamp) || 0;
    outcomes.set(timestamp, count + 1);
  }

  const orderedOutcomes = new Map([...outcomes.entries()].sort());

  return orderedOutcomes;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}