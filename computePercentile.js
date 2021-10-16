self.onmessage = (event) => {
  const data = event.data;
  const totalRuns = data.reduce((a, b) => a + b[1], 0);
  const outcomes = new Map(data);

  const p25 = computePercentile(outcomes, 25, totalRuns);
  const p50 = computePercentile(outcomes, 50, totalRuns);
  const p75 = computePercentile(outcomes, 75, totalRuns);
  const p85 = computePercentile(outcomes, 85, totalRuns);
  const p95 = computePercentile(outcomes, 95, totalRuns);

  self.postMessage([p25, p50, p75, p85, p95]);
  self.close();
}

function computePercentile(outcomes, percentile, totalRuns) {
  const p_qtd = totalRuns - Math.ceil(totalRuns / (100 / percentile));
  const orderedData = new Map([...outcomes.entries()].sort(function (a, b) {
    const aTimestamp = parseInt(a[0]);
    const bTimestamp = parseInt(b[0]);

    if (aTimestamp > bTimestamp) {
      return -1;
    } else if (aTimestamp < bTimestamp) {
      return 1;
    } else {
      return 0;
    }
  }));

  let sum = 0;
  let percentileTimestamp = 0;

  for (let [key, value] of orderedData) {
    sum += value;

    if (sum >= p_qtd) {
      percentileTimestamp = key;
      break;
    }
  }

  return {
    percentile,
    timestamp: percentileTimestamp,
    sum,
    totalRuns
  };
}