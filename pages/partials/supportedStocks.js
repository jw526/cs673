var dow30 = [
  'MMM: 3M',
  'AXP: American Express',
  'AAPL: Apple',
  'BA: Boeing',
  'CAT: Caterpillar',
  'CVX: Chevron',
  'CSCO: Cisco',
  'KO: Coca-Cola',
  'DIS: Disney',
  'DWDP: DowDuPont Inc',
  'XOM: Exxon Mobil',
  'GS: Goldman Sachs',
  'HD: Home Depot',
  'IBM: IBM',
  'INTC: Intel',
  'JNJ: Johnson & Johnson',
  'JPM: JPMorgan Chase',
  'MCD: McDonald\'s',
  'MRK: Merck',
  'MSFT: Microsoft',
  'NKE: Nike',
  'PFE: Pfizer',
  'PG: Procter & Gamble',
  'TRV: Travelers Companies Inc',
  'UTX: United Technologies',
  'UNH: UnitedHealth',
  'VZ: Verizon',
  'V: Visa',
  'WMT: Wal-Mart',
  'WBA: Walgreen'
];

var categoryDow30 = []
for (var index = 0; index < dow30.length; index++) {  
  categoryDow30.push({ label: dow30[index], category: "Dow 30" });
}

var indiaStocks = [
  'AXISBANK.NS',
  'WIPRO.NS', 
  'ITC.NS',
  'HDFCBANK.NS',
  'HDFC.NS',
  'HINDPETRO.NS',
  'ONGC.NS',
  'INFY.NS',
  'BPCL.NS',
  'INDUSINDBK.NS',
  'IOC.NS',
  'ASIANPAINT.NS',
  'BAJAJFINSV.NS',
  'GAIL.NS',
  'RELIANCE.NS',
  'SBIN.NS',
  'KOTAKBANK.NS',
  'TECHM.NS',
  'TCS.NS',
  'ICICIBANK.NS',
  'GRASIM.NS',
  'HCLTECH.NS',
  'DRREDDY.NS',
  'NTPC.NS',
  'TATAMTRDVR.NS',
  'HINDUNILVR-EQ.NS',
  'CIPLA.NS',
  'SUNPHARMA.NS',
  'ULTRACEMCO.NS',
  'ZEEL.NS',
  'BAJFINANCE.NS',
  'INFRATEL.NS',
  'M&M.NS',
  'ADANIPORTS.NS',
  'TITAN.NS',
  'MARUTI.NS',
  'UPL.NS',
  'EICHERMOT.NS',
  'LT.NS',
  'POWERGRID.NS',
  'BAJAJ-AUTO.NS',
  'VEDL.NS',
  'COALINDIA.NS',
  'JSWSTEEL.NS',
  'TATASTEEL.NS',
  'HEROMOTOCO.NS',
  'BHARTIARTL.NS',
  'HINDALCO.NS',
  'IBULHSGFIN.NS',
  'YESBANK.NS'
];

var categoryIndiaStocks = []
for (var index = 0; index < indiaStocks.length; index++) {
  categoryIndiaStocks.push({ label: indiaStocks[index], category: "India Nifty Fifty" });
}


var septemberPriceMap = {
  'AAPL': 2
}