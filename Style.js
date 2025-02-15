// Example stock data
const stockData = [
    { date: '2025-02-01', price: 100 },
    { date: '2025-02-02', price: 102 },
    { date: '2025-02-03', price: 105 },
    { date: '2025-02-04', price: 98 },
    { date: '2025-02-05', price: 95 },
];

// Simple moving average calculation
function calculateSMA(data, period) {
    let sma = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
        sma.push(sum / period);
    }
    return sma;
}

// Generate buy/sell signals based on EMA and RSI
function generateSignals(data) {
    const sma20 = calculateSMA(data, 20);
    const sma50 = calculateSMA(data, 50);

    let signals = [];

    for (let i = 1; i < sma20.length; i++) {
        const currentSMA20 = sma20[i];
        const previousSMA20 = sma20[i - 1];
        const currentSMA50 = sma50[i];
        const previousSMA50 = sma50[i - 1];

        // Buy Signal: EMA(20) crosses above EMA(50)
        if (currentSMA20 > currentSMA50 && previousSMA20 <= previousSMA50) {
            signals.push('Buy Signal');
        }
        // Sell Signal: EMA(20) crosses below EMA(50)
        if (currentSMA20 < currentSMA50 && previousSMA20 >= previousSMA50) {
            signals.push('Sell Signal');
        }
    }
    return signals;
}

// Display results in the webpage
function displaySignals() {
    const signals = generateSignals(stockData);
    const outputDiv = document.getElementById('output');
    const alertsDiv = document.getElementById('alerts');

    if (signals.length > 0) {
        outputDiv.innerHTML = `Signals: <br> ${signals.join('<br>')}`;
        alertsDiv.innerHTML = 'New trading signals available!';
    } else {
        outputDiv.innerHTML = 'No new signals at the moment.';
    }
}

// Call the display function
displaySignals();
