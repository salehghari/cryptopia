import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface cryptoState {
  currency: string,
  symbol: string | null,
  trendingCoins: any[],
  allCoins: any[],
  coin: {
    [key: string]: any
  },
  loading: { allCoins: boolean, trendingCoins: boolean, singleCoin: boolean, globalData: boolean },
  page: number,
  search: string,
  globalData: {
    [key: string]: any
  }
}

const initialState: cryptoState = {
  currency: "USD",
  symbol: "$",
  trendingCoins: [],
  allCoins: [],
  coin: {},
  loading: { allCoins: false, trendingCoins: false, singleCoin: false, globalData: false },
  page: 1,
  search: "",
  globalData: {},
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setSymbol: (state, action: PayloadAction<string | null>) => {
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
    setTrendingCoinsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.trendingCoins = action.payload;
    },
    setSingleCoinLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.singleCoin = action.payload;
    },
    setGlobalDataLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.globalData = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setGlobalData: (state, action: PayloadAction<object>) => {
      state.globalData = action.payload;
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
  setTrendingCoinsLoading,
  setSingleCoinLoading,
  setGlobalDataLoading,
  setPage,
  setSearch,
  setGlobalData
} = cryptoSlice.actions;

export default cryptoSlice.reducer;