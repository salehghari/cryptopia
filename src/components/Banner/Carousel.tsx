import axios from "axios"
import { TrendingCoins, options } from "@/config/api"
import { useDispatch, useSelector } from 'react-redux';
import { setTrendingCoins, setCurrencyLoading } from "@/features/crypto/cryptoSlice";
import { useEffect } from "react";
import AliceCarousel from 'react-alice-carousel';
import Link from 'next/link';
import { RootState } from "@/app/store";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';


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
  const loading = useSelector((state: RootState) => state.crypto.loading.currency);


  const fetchTrendingCoins = async () => {
    dispatch(setCurrencyLoading(true));

    const { data } = await axios.get(TrendingCoins(currency), options)
    dispatch(setTrendingCoins(data));

    dispatch(setCurrencyLoading(false));
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
      <Link className="flex flex-col items-center justify-between cursor-pointer uppercase text-white h-[135px]" href={`/coins/${trendingCoin.id}`}>
        <img
          className="mb-2 h-20 w-20"
          src={trendingCoin?.image}
          alt={trendingCoin.name}
        />
        {loading && 
          <div className="flex flex-col items-center gap-2">
            <div className="text-loader w-20 h-4 rounded-sm"></div>
            <div className="text-loader w-24 h-6 rounded-sm"></div>
          </div>
        }
        {!loading && 
          <>
            <span>{trendingCoin?.symbol}
              &nbsp;
              <span className={profit ? `text-green-500` : `text-red-500`}>
                {profit && <ArrowDropUpRoundedIcon className="mr-[-4px]" />}
                {!profit && <ArrowDropDownRoundedIcon className="mr-[-4px]" />}
                {trendingCoin?.price_change_percentage_24h?.toFixed(2)
                .toString()
                .replace("-", "")}%
              </span>
            </span><span className="text-xl font-medium">
              {symbol}{separator(trendingCoin?.current_price.toFixed(2).replace(/\.0+$/,''))}
            </span>
          </>
        }
      </Link>
    )
  })

  return (
    <div className="flex items-center h-1/2">
      <AliceCarousel 
        infinite
        autoPlayInterval={1000}
        animationDuration={500}
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  )
}
