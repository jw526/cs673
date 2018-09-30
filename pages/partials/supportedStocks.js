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
  'JNJ: Johnson &amp; Johnson',
  'JPM: JPMorgan Chase',
  'MCD: McDonald\'s',
  'MRK: Merck',
  'MSFT: Microsoft',
  'NKE: Nike',
  'PFE: Pfizer',
  'PG: Procter &amp; Gamble',
  'TRV: Travelers Companies Inc',
  'UTX: United Technologies',
  'UNH: UnitedHealth',
  'VZ: Verizon',
  'V: Visa',
  'WMT: Wal-Mart',
  'WBA: Walgreen'
];

let categoryDow30 = []
for (let index = 0; index < dow30.length; index++) {  
  categoryDow30.push({ label: dow30[index], category: "Dow 30" });
}
dow30 = categoryDow30;


var indiaStocks = [
  'Axis Bank',
  'Wipro', 
  'ITC',
  'HDFC Bank',
  'HDFC',
  'HPCL',
  'ONGC',
  'Infosys',
  'BPCL',
  'IndusInd Bank',
  'Indian Oil Corp',
  'Asian Paints',
  'Bajaj Finserv',
  'GAIL',
  'RIL',
  'SBI',
  'Kotak Bank',
  'Tech Mahindra',
  'TCS',
  'ICICI Bank',
  'Grasim Inds.',
  'HCL Tech',
  'Dr.Reddys Laborat',
  'NTPC',
  'Tata Motors',
  'Hind.Unilever',
  'Cipla',
  'Sun Pharma',
  'UltraTech Cem.',
  'Zee Ent.',
  'Bajaj Finance',
  'Bharti Infratel',
  'M & amp; M',
  'Adani Ports SEZ',
  'Titan Company ',
  'Maruti Suzuki',
  'UPL ',
  'Eicher Motors',
  'Larsen & amp; Toubro',
  'PowerGrid',
  'Bajaj Auto',
  'Vedanta ',
  'Coal India Ltd',
  'JSW Steel',
  'Tata Steel',
  'Hero MotoCorp',
  'Bharti Airtel',
  'Hindalco Inds.',
  'Ibull HousingFin',
  'YES Bank',
];

let categoryIndiaStocks = []
for (let index = 0; index < dow30.length; index++) {
  categoryIndiaStocks.push({ label: indiaStocks[index], category: "India Nifty Fifty" });
}
indiaStocks = categoryIndiaStocks;