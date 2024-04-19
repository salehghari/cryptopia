export const CoinList = (currency : string, page : number) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`;

export const SingleCoin = (id : string | string[] | undefined) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id : string, days = 365, currency : string) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency : string) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

export const allCoinsList = () =>
  `https://api.coingecko.com/api/v3/coins/list`;

export const options = {
  method: 'GET',
  headers: {
    'x-cg-demo-api-key': 'CG-J99j9sVZho9dDbS2mTRs67gq'
  }
};