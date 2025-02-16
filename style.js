const stockSymbols = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'FB', 'NVDA'];
const weightage = {
    'AAPL': '6.5%',
    'MSFT': '7.0%',
    'GOOG': '5.2%',
    'AMZN': '4.5%',
    'TSLA': '5.8%',
    'FB': '3.2%',
    'NVDA': '4.0%'
};

document.getElementById('submit-btn').addEventListener('click', function() {
    const alphaKey = document.getElementById('alpha-key').value;
    const finnhubKey = document.getElementById('finnhub-key').value;

    fetchStockData(alphaKey, finnhubKey);
});

// Fetch stock data
async function fetchStockData(alphaKey, finnhubKey) {
    const timestamp = new Date().toLocaleString();
    document.getElementById('timestamp').innerText = timestamp;
    
    let dataFetched = false;

    // Try fetching from Alpha Vantage API
    if (alphaKey) {
        try {
            const data = await getAlphaVantageData(alphaKey);
            displayData(data, 'Alpha Vantage API');
            dataFetched = true;
        } catch (error) {
            showError('Alpha Vantage API', error);
        }
    }

    // If no data from Alpha Vantage, try Finnhub API
    if (!dataFetched && finnhubKey) {
        try {
            const data = await getFinnhubData(finnhubKey);
            displayData(data, 'Finnhub API');
            dataFetched = true;
        } catch (error) {
            showError('Finnhub API', error);
        }
    }

    // If no API keys provided or failed, try open source
    if (!dataFetched) {
        try {
            const data = await getOpenSourceData();
            displayData(data, 'Open Source (Google/Yahoo)');
        } catch (error) {
            showError('Open Source', error);
        }
    }
}

// Display fetched data
function displayData(data, source) {
    document.getElementById('alerts').innerHTML = `Data fetched successfully from ${source}.`;

    const tableBody = document.querySelector('#stocks-table tbody');
    tableBody.innerHTML = ''; // Clear previous table data

    stockSymbols.forEach(symbol => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symbol}</td>
            <td>${data[symbol] ? data[symbol].open : '-'}</td>
            <td>${data[symbol] ? data[symbol].previousClose : '-'}</td>
            <td>${data[symbol] ? data[symbol].currentPrice : '-'}</td>
            <td>${weightage[symbol]}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Show error message
function showError(source, error) {
    document.getElementById('alerts').innerHTML = `Error fetching data from ${source}: ${error.message}`;
    const tableBody = document.querySelector('#stocks-table tbody');
    tableBody.innerHTML = ''; // Clear previous table data

    stockSymbols.forEach(symbol => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symbol}</td>
            <td class="error">Unable to Fetch Data</td>
            <td class="error">Unable to Fetch Data</td>
            <td class="error">Unable to Fetch Data</td>
            <td class="error">Unable to Fetch Data</td>
        `;
        tableBody.appendChild(row);
    });
}

// Alpha Vantage API data fetch function
async function getAlphaVantageData(alphaKey) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${alphaKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data['Time Series (Daily)']) {
        return {
            'AAPL': { open: data['Time Series (Daily)']['2025-02-01']['1. open'], previousClose: '-', currentPrice: '-' },
            'MSFT': { open: '-', previousClose: '-', currentPrice: '-' },
            'GOOG': { open: '-', previousClose: '-', currentPrice: '-' },
            'AMZN': { open: '-', previousClose: '-', currentPrice: '-' },
            'TSLA': { open: '-', previousClose: '-', currentPrice: '-' },
            'FB': { open: '-', previousClose: '-', currentPrice: '-' },
            'NVDA': { open: '-', previousClose: '-', currentPrice: '-' }
        };
    } else {
        throw new Error('Invalid response from Alpha Vantage');
    }
}

// Finnhub API data fetch function
async function getFinnhubData(finnhubKey) {
    const url = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
        return {
            'AAPL': { open: data.o, previousClose: data.pc, currentPrice: data.c },
            'MSFT': { open: '-', previousClose: '-', currentPrice: '-' },
            'GOOG': { open: '-', previousClose: '-', currentPrice: '-' },
            'AMZN': { open: '-', previousClose: '-', currentPrice: '-' },
            'TSLA': { open: '-', previousClose: '-', currentPrice: '-' },
            'FB': { open: '-', previousClose: '-', currentPrice: '-' },
            'NVDA': { open: '-', previousClose: '-', currentPrice: '-' }
        };
    } else {
        throw new Error('Invalid response from Finnhub');
    }
}

// Open Source data fetch function (mock data for now)
async function getOpenSourceData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                'AAPL': { open: 150.50, previousClose: 152.00, currentPrice: 151.20 },
                'MSFT': { open: 280.00, previousClose: 285.00, currentPrice: 282.50 },
                'GOOG': { open: 2700.00, previousClose: 2750.00, currentPrice: 2735.00 },
                'AMZN': { open: 3400.00, previousClose: 3500.00, currentPrice: 3470.00 },
                'TSLA': { open: 750.00, previousClose: 760.00, currentPrice: 755.00 },
               
