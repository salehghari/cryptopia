import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { setCoin, setSingleCoinLoading } from "@/features/crypto/cryptoSlice";
import { RootState } from '@/app/store';
import axios from 'axios';
import Head from 'next/head';
import { SingleCoin, options } from '@/config/api';
import { useEffect, useState } from 'react';
import CoinInfo from '@/components/CoinInfo';
import { CircularProgress, Typography } from '@mui/material';
import HTMLReactParser from 'html-react-parser';
import { separator } from '@/components/Banner/Carousel';
import { orderNumber } from '@/components/CoinsTable';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { parseISO, format, differenceInMonths  } from 'date-fns';




export default function CoinPage() {
  const dispatch = useDispatch();

  const [showMore, setShowMore] = useState(false);

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const coin = useSelector((state: RootState) => state.crypto.coin);
  const currency = useSelector((state: RootState) => state.crypto.currency);
  const symbol = useSelector((state: RootState) => state.crypto.symbol);
  const loading = useSelector((state: RootState) => state.crypto.loading.singleCoin);

  const coinMarketCap = coin?.market_data?.market_cap[currency.toLowerCase()];
  const coinTotalVolume = coin?.market_data?.total_volume[currency.toLowerCase()];
  const coinCurrentPrice = coin?.market_data?.current_price[currency.toLowerCase()];
  const coinATH = coin?.market_data?.ath[currency.toLowerCase()];
  const coinATHPercentage = coin?.market_data?.ath_change_percentage[currency.toLowerCase()];
  const coinATHPercentageProfit = coinATHPercentage > 0;
  const coinATHDate = coin?.market_data?.ath_date[currency.toLowerCase()];
  const coinATL = coin?.market_data?.atl[currency.toLowerCase()];
  const coinATLPercentage = coin?.market_data?.atl_change_percentage[currency.toLowerCase()];
  const coinATLPercentageProfit = coinATLPercentage > 0;
  const coinATLDate = coin?.market_data?.atl_date[currency.toLowerCase()];

  const formatDate = (dateString: string, getYearsDifference: boolean = false): string => {
    const date = parseISO(dateString);
    const formattedDate = format(date, 'MMM dd, yyyy');
    const now = new Date();
    const monthsDifference = Math.abs(differenceInMonths(date, now));
    const yearsDifference = (monthsDifference / 12).toFixed();
    if(getYearsDifference) {
      return `${formattedDate} (almost ${yearsDifference} years)`
    }
    return `${formattedDate} (${monthsDifference} months)`;
  };


  const fetchCoin = async () => {
    dispatch(setSingleCoinLoading(true));
    if(id) {
      const { data } = await axios.get(SingleCoin(id), options)
      dispatch(
        setCoin(data)
      )
      dispatch(setSingleCoinLoading(false));
    }
  }
  

  useEffect(() => {
    fetchCoin();
  }, [id])
  

  
  return (
    <>
      {id && <Head>
        <title>{`Cryptopia - ${id}`}</title>
      </Head>}
      {loading && 
        <div className="h-screen flex items-center justify-center">
          <CircularProgress
            style={{ color: "#256ab4" }}
            size={100}
            thickness={2}
          />
        </div>
      }
      {!loading && 
        <div className="lg:overflow-y-auto lg:h-screen flex max-lg:flex-col max-lg:items-center pt-16">
          <div className="w-[40%] flex flex-col items-center mt-6 max-lg:w-full">
            <img
              src={ coin.image?.large }
              alt={ coin.name }
              className="mb-5 h-[200px]"
            />
            <Typography variant="h3" className="font-bold mb-5 text-center">
              { coin.name }
            </Typography>
            <Typography variant="subtitle1" className="w-full p-6 pb-4 pt-0 text-justify" style={{fontFamily: "Montserrat"}}>
              {coin.description?.en &&
                <>
                  {showMore ? HTMLReactParser(`${coin.description?.en}`) : HTMLReactParser(`${coin.description?.en.split(". ")[0]}`)}
                  {coin.description?.en.split(". ")[1] && <span className="text-gray-500 active:bg-gray-700 cursor-pointer" onClick={() => setShowMore(!showMore)}>{showMore ? " ...see less" : "...see more"}</span>}
                </>
              }
              {!coin.description?.en && "No Description"}
            </Typography>
            <div className="w-full self-start p-6 pt-3 max-lg:flex max-lg:justify-around max-lg:flex-col max-md:items-center max-sm:items-start">
              <span className="flex flex-wrap mb-5">
                <Typography
                  variant="h5"
                  
                  style={{ fontFamily: "Montserrat" }}
                >
                  Rank:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  className="font-semibold"
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {!coin?.market_cap_rank && "-"}
                  {separator(coin?.market_cap_rank)}
                </Typography>
              </span>
              <span className="flex flex-wrap mb-5">
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Current Price:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  className="font-semibold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {coinCurrentPrice &&
                    <div style={{ textAlign: 'right' }}>
                      <span className="mr-[2px]">{symbol}</span>               
                      <span style={{ direction: 'ltr', display: 'inline-block' }}>
                        {separator(coinCurrentPrice)}
                      </span>
                    </div>
                  }
                  {!coinCurrentPrice && "-"}
                </Typography>
              </span>
              <span className="flex flex-wrap mb-5">
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Market Cap:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  className="font-semibold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {coinMarketCap &&
                    <div style={{ textAlign: 'right' }}>
                      <span className="mr-[2px]">{symbol}</span>
                      <span style={{ direction: 'ltr', display: 'inline-block' }}>
                        {orderNumber(coinMarketCap)}
                      </span>
                    </div>
                  }
                  {!coinMarketCap && coinMarketCap !== 0 && "-"}
                </Typography>
              </span>
              <span className="flex flex-wrap mb-5">
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Total Volume:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  className="font-semibold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {coinTotalVolume &&
                    <div style={{ textAlign: 'right' }}>
                      <span className="mr-[2px]">{symbol}</span>
                      <span style={{ direction: 'ltr', display: 'inline-block' }}>
                        {orderNumber(coinTotalVolume)}
                      </span>
                    </div>
                  }
                  {!coinTotalVolume && coinTotalVolume !== 0 && "-"}
                </Typography>
              </span>
              <span className="flex items-center flex-wrap lg:justify-between mb-5">
                <Typography
                  variant="h5"
                  className="text-sm"
                  style={{ fontFamily: "Montserrat" }}
                >
                  All-Time High:
                </Typography>
                &nbsp; &nbsp;
                <div className="flex flex-col">
                  <div className="flex justify-end">
                    <Typography
                      variant="h5"
                      className="font-medium max-lg:text-xs text-sm"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      {coinATH &&
                        <div style={{ textAlign: 'right' }}>
                          <span className="mr-[2px]">{symbol}</span>               
                          <span style={{ direction: 'ltr', display: 'inline-block' }}>
                            {separator(coinATH)}
                          </span>
                        </div>
                      }
                      {!coinATH && "-"}
                    </Typography>
                    <Typography
                      variant="h5"
                      style={{ fontFamily: "Montserrat" }}
                      className={`font-medium max-lg:text-xs text-sm ${ coinATHPercentageProfit ? "text-[#32ca5b]" : "text-[#ff3a33]"}`}
                    >
                      {coinATHPercentage &&
                        <div>
                          {coinATHPercentageProfit && <ArrowDropUpRoundedIcon className="-mr-1" />}
                          {!coinATHPercentageProfit && <ArrowDropDownRoundedIcon className="-mr-1" />}
                          {coinATHPercentage.toFixed(2)
                          .toString()
                          .replace("-", "")}%
                        </div>
                      }
                      {!coinATHPercentage && "-"}
                    </Typography>
                  </div>
                  <div className="flex justify-end">
                    <Typography
                      variant="h5"
                      style={{ fontFamily: "Montserrat" }}
                      className="font-medium max-lg:text-xs text-sm text-gray-400"
                    >
                      {coinATHDate && formatDate(coinATHDate)}
                      {!coinATHDate && "-"}
                    </Typography>
                  </div>
                </div>
              </span>
              <span className="flex items-center flex-wrap lg:justify-between mb-5">
                <Typography
                  variant="h5"
                  className="text-sm"
                  style={{ fontFamily: "Montserrat" }}
                >
                  All-Time Low:
                </Typography>
                &nbsp; &nbsp;
                <div className="flex flex-col">
                  <div className="flex justify-end">
                    <Typography
                      variant="h5"
                      className="font-medium max-lg:text-xs text-sm"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      {coinATL &&
                        <div style={{ textAlign: 'right' }}>
                          <span className="mr-[2px]">{symbol}</span>               
                          <span style={{ direction: 'ltr', display: 'inline-block' }}>
                            {separator(coinATL)}
                          </span>
                        </div>
                      }
                      {!coinATL && "-"}
                    </Typography>
                    <Typography
                      variant="h5"
                      style={{ fontFamily: "Montserrat" }}
                      className={`font-medium max-lg:text-xs text-sm ${ coinATLPercentageProfit ? "text-[#32ca5b]" : "text-[#ff3a33]"}`}
                    >
                      {coinATLPercentage &&
                        <div>
                          {coinATLPercentageProfit && <ArrowDropUpRoundedIcon className="-mr-1" />}
                          {!coinATLPercentageProfit && <ArrowDropDownRoundedIcon className="-mr-1" />}
                          {coinATLPercentage.toFixed(2)
                          .toString()
                          .replace("-", "")}%
                        </div>
                      }
                      {!coinATLPercentage && "-"}
                    </Typography>
                  </div>
                  <div className="flex justify-end">
                    <Typography
                      variant="h5"
                      style={{ fontFamily: "Montserrat" }}
                      className="font-medium max-lg:text-xs text-sm text-gray-400"
                    >
                      {coinATLDate && formatDate(coinATLDate, true)}
                      {!coinATLDate && "-"}
                    </Typography>
                  </div>
                </div>
              </span>
            </div>
          </div>
          <CoinInfo coin={ coin } />
        </div>
      }
    </>
  );
}