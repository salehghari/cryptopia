import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { setCoin, setGlobalData, setSingleCoinLoading } from "@/features/crypto/cryptoSlice";
import { RootState } from '@/app/store';
import axios from 'axios';
import { GlobalData, SingleCoin, options } from '@/config/api';
import { useEffect, useState } from 'react';
import CoinInfo from '@/components/CoinInfo';
import { CircularProgress, Typography } from '@mui/material';
import HTMLReactParser from 'html-react-parser';
import { separator } from '@/components/Banner/Carousel';



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
  const coinCurrentPrice = coin?.market_data?.current_price[currency.toLowerCase()];

  const fetchCoin = async () => {
    dispatch(setSingleCoinLoading(true));
    if(id) {
      const { data } = await axios.get(SingleCoin(id))
      dispatch(
        setCoin(data)
      )
      dispatch(setSingleCoinLoading(false));
    }
  }
  const fetchGlobalData = async () => {
    const { data } = await axios.get(GlobalData(), options)
    dispatch(setGlobalData(data));
    console.log(data);
  }
  

  useEffect(() => {
    fetchCoin();
  }, [id])
  
  useEffect(() => {
    fetchGlobalData()
  }, [])
  
  const marketCap = () => {
    if(coinMarketCap >= 1000000) {
      return (
        <>
          <span style={{ direction: 'ltr', display: 'inline-block' }}>
            {separator(coinMarketCap.toString().slice(0, -6))}
          </span>
          M
        </>
      )
    }
    else if(coinMarketCap < 1000000) {
      return separator(coinMarketCap)
    }
  }
  
  return (
    <>
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
          <div className="w-[30%] flex flex-col items-center mt-6 max-lg:w-full">
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
            <div className="w-full self-start p-6 pt-3 max-lg:flex max-lg:justify-around max-md:flex-col max-md:items-center max-sm:items-start">
              <span className="flex flex-wrap">
                <Typography
                  variant="h5"
                  className="font-bold mb-5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Rank:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {!coin?.market_cap_rank && "-"}
                  {separator(coin?.market_cap_rank)}
                </Typography>
              </span>
              <span className="flex flex-wrap">
                <Typography
                  variant="h5"
                  className="font-bold mb-5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Current Price:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {coinCurrentPrice &&
                    <div style={{ textAlign: 'right' }}>
                      <span className="mr-[1px]">{symbol}</span>               
                      <span style={{ direction: 'ltr', display: 'inline-block' }}>
                        {separator(coinCurrentPrice)}
                      </span>
                    </div>
                  }
                  {!coinCurrentPrice && "-"}
                </Typography>
              </span>
              <span className="flex flex-wrap">
                <Typography
                  variant="h5"
                  className="font-bold mb-5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Market Cap:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {coinMarketCap &&
                    <div style={{ textAlign: 'right' }}>
                      <span className="mr-[1px]">{symbol}</span>
                      {marketCap()}
                    </div>
                  }
                  {!coinMarketCap && coinMarketCap !== 0 && "-"}
                </Typography>
              </span>
            </div>
          </div>
          <CoinInfo coin={ coin } />
        </div>
      }
    </>
  );
}