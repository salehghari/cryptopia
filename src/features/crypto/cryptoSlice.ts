import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface cryptoState {
  currency: string,
  symbol: string,
  trendingCoins: any[],
  allCoins: any[],
  coin: {
    [key: string]: any
  },
  loading: { allCoins: boolean, currency: boolean, singleCoin: boolean },
  page: number,
  search: string,
}

const initialState: cryptoState = {
  currency: "USD",
  symbol: "$",
  trendingCoins: [],
  allCoins: [],
  coin: {},
  loading: { allCoins: false, currency: false, singleCoin: false },
  page: 1,
  search: "",
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setTrendingCoins: (state, action: PayloadAction<[]>) => {
      state.trendingCoins = action.payload;
    },
    setAllCoins: (state, action: PayloadAction<[]>) => {
      state.allCoins = action.payload;
    },
    setCoin: (state, action: PayloadAction<[]>) => {
      state.coin = action.payload;
    },
    setAllCoinsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.allCoins = action.payload;
    },
    setCurrencyLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.currency = action.payload;
    },
    setSingleCoinLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.singleCoin = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

  }
})

export const {
  setCurrency,
  setSymbol,
  setTrendingCoins,
  setAllCoins,
  setCoin,
  setAllCoinsLoading,
  setCurrencyLoading,
  setSingleCoinLoading,
  setPage,
  setSearch
} = cryptoSlice.actions;

export default cryptoSlice.reducer;