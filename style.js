const stocks = [
    { symbol: "AAPL", spyWeightage: 6.6 },
    { symbol: "TSLA", spyWeightage: 4.0 },
    { symbol: "GOOGL", spyWeightage: 3.4 },
    { symbol: "AMZN", spyWeightage: 2.9 },
    { symbol: "MSFT", spyWeightage: 5.8 },
    { symbol: "NVDA", spyWeightage: 3.7 },
    { symbol: "META", spyWeightage: 3.3 },
];

// Fetch stock data from Alpha Vantage
async function fetchFromAlphaVantage(symbol) {
    const alphaKey = document.getElementById('alphaKey').value;
    if (!alphaKey) {
        return null;
    }
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alphaKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data["Time Series (Daily)"]) {
            const lastRefreshed = data["Meta Data"]["3. Last Refreshed"];
            const openPrice = data["Time Series (Daily)"][lastRefreshed]["1. open"];
            const previousClose = data["Time Series (Daily)"][lastRefreshed]["4. close"];
            const currentPrice = data["Time Series (Daily)"][lastRefreshed]["4. close"];
            return { openPrice, previousClose, currentPrice, lastRefreshed };
        }
    } catch (error) {
        return null;
    }
}

// Fetch stock data from Finnhub
async function fetchFromFinnhub(symbol) {
    const finnhubKey = document.getElementById('finnhubKey').value;
    if (!finnhubKey) {
        return null;
    }
    
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data) {
            return {
                openPrice: data.o,
                previousClose: data.pc,
                currentPrice: data.c,
                lastRefreshed: new Date().toLocaleString(),
            };
        }
    } catch (error) {
        return null;
    }
}

// Display stock data in the table
function displayTable(stockData) {
    let tableHTML = '<table><thead><tr><th>Symbol</th><th>Open Price</th><th>Previous Close</th><th>Current Price</th><th>SPY Weightage</th><th>RSI</th><th>EMA 20</th><th>EMA 50</th></tr></thead><tbody>';
    
    stockData.forEach(stock => {
        tableHTML += `
            <tr>
                <td>${stock.symbol}</td>
                <td>${stock.openPrice || '-'}</td>
                <td>${stock.previousClose || '-'}</td>
                <td>${stock.currentPrice || '-'}</td>
                <td>${stock.spyWeightage || '-'}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    document.getElementById('output').innerHTML = tableHTML;
}

// Function to fetch data and populate the table
async function fetchData() {
    const stockData = [];
    const alertsDiv = document.getElementById('alerts');
    
    let allDataFetched = true;

    for (let stock of stocks) {
        let stockDataFromApi = await fetchFromAlphaVantage(stock.symbol);
        
        if (!stockDataFromApi) {
            stockDataFromApi = await fetchFromFinnhub(stock.symbol);
        }
        
        if (stockDataFromApi) {
            stockData.push({
                ...stock,
                ...stockDataFromApi,
            });
        } else {
            allDataFetched = false;
            stockData.push({ ...stock, openPrice: '-', previousClose: '-', currentPrice: '-' });
        }
    }
    
    if (allDataFetched) {
        alertsDiv.innerHTML = 'Data fetched successfully!';
    } else {
        alertsDiv.innerHTML = 'Some data could not be fetched, showing default values.';
    }
    
    displayTable(stockData);
}
