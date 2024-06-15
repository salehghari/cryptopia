import axios from "axios"
import { TrendingCoins, options } from "@/config/api"
import { useDispatch, useSelector } from 'react-redux';
import { setTrendingCoins, setTrendingCoinsLoading } from "@/features/crypto/cryptoSlice";
import { useEffect } from "react";
import AliceCarousel from 'react-alice-carousel';
import Link from 'next/link';
import { RootState } from "@/app/store";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { CircularProgress } from "@mui/material";
import Image from 'next/image';



export function separator(number: number) {
  let numStr = number?.toString();

  let parts = numStr?.split('.');
  let integerPart = parts?.[0];
  let decimalPart = parts?.[1];

  let formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  

  if (decimalPart) {
      return formattedIntegerPart + '.' + decimalPart;
  } else {
      return formattedIntegerPart;
  }
}

export default function Carousel() {

  const dispatch = useDispatch();

  const currency = useSelector((state: RootState) => state.crypto.currency);
  const trendingCoins = useSelector((state: RootState) => state.crypto.trendingCoins);
  const symbol = useSelector((state: RootState) => state.crypto.symbol);
  const loading = useSelector((state: RootState) => state.crypto.loading.trendingCoins);



  const fetchTrendingCoins = async () => {
    dispatch(setTrendingCoinsLoading(true));

    const { data } = await axios.get(TrendingCoins(currency), options)
    dispatch(setTrendingCoins(data));

    dispatch(setTrendingCoinsLoading(false));
  };


  const responsive = {
    0: {
      items: 2
    },
    512: {
      items: 4
    },
  }


  useEffect(() => {
    fetchTrendingCoins();
  }, [currency])

  const items = trendingCoins.map((trendingCoin: any) => {
    let profit = trendingCoin.price_change_percentage_24h >= 0;
    return (
      <Link key={trendingCoin.name} className="flex flex-col items-center justify-between cursor-pointer uppercase text-white h-[135px]" href={`/coins/${trendingCoin.id}`}>
        <Image
          className="mb-2 h-20 w-auto"
          src={trendingCoin?.image}
          alt={trendingCoin.name}
          width={80}
          height={80}
        />
        <>
          <span className="font-medium">{trendingCoin?.symbol}
            &nbsp;
            <span className={`${profit ? "text-green-500" : "text-red-500"}`}>
              {profit && <ArrowDropUpRoundedIcon className="mr-[-4px]" />}
              {!profit && <ArrowDropDownRoundedIcon className="mr-[-4px]" />}
              {trendingCoin?.price_change_percentage_24h?.toFixed(2)
              .toString()
              .replace("-", "")}%
            </span>
          </span>
          <div className="text-xl font-medium" style={{ textAlign: 'right' }}>
            <span className="mr-[2px]">{symbol}</span>
            <span style={{ direction: 'ltr', display: 'inline-block' }}>
              {separator(trendingCoin?.current_price.toFixed(2).replace(/\.0+$/,''))}
            </span>
          </div>
        </>
      </Link>
    )
  })

  return (
    <div className="flex justify-center items-center h-1/2">
      {loading &&
        <CircularProgress
          style={{ color: "#256ab4" }}
          size={150}
          thickness={2}
        />
      }
      {!loading &&
        <AliceCarousel 
          infinite
          autoPlayInterval={1000}
          animationDuration={500}
          disableButtonsControls
          responsive={responsive}
          autoPlay
          items={items}
          renderDotsItem={
            (e) => (
              <>
                {!e.isActive && <li className="w-2 h-2 bg-gray-400 rounded-[50%] ml-3 cursor-pointer"></li>}
                {e.isActive && <li className="w-2 h-2 bg-[#2576c2] rounded-[50%] ml-3"></li>}
              </>
            )
          }
        />
      }
    </div>
  )
}
