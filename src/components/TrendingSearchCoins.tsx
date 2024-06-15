import { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { TrendingSearchList, options } from "@/config/api";
import { setTrendingSearchCoins, setTrendingSearchCoinsLoading } from "@/features/crypto/cryptoSlice";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import { orderNumber } from "./CoinsTable";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Link from "next/link";


export default function TrendingSearchCoins() {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);

  const currency = useSelector((state: RootState) => state.crypto.currency);
  const trendingSearchCoins = useSelector((state: RootState) => state.crypto.trendingSearchCoins);
  const loading = useSelector((state: RootState) => state.crypto.loading.trendingSearchCoins);
  const firstThreeItems = trendingSearchCoins.slice(0, expanded ? trendingSearchCoins.length : 3);




  const fetchTrendingCoins = async () => {
    dispatch(setTrendingSearchCoinsLoading(true));

    const { data } = await axios.get(TrendingSearchList(), options)
    dispatch(setTrendingSearchCoins(data.coins));

    dispatch(setTrendingSearchCoinsLoading(false));
  };

  useEffect(() => {
    fetchTrendingCoins()
  }, [currency])
  
  return (
    <Container className={`flex flex-col border-2 border-[#003566] item-container rounded-xl p-4 max-[360px]:p-2 max-[360px]:pt-3 w-[800px] max-w-[calc(100%-48px)] ${expanded ? 'expanded' : ''}`}>
      <div className="flex justify-between items-center px-2 mb-4">
        <Typography variant="h3" className="text-xl max-[360px]:text-base" style={{ fontFamily: "Montserrat" }}>
          🔥 Trending
        </Typography>
        <p onClick={() => setExpanded(!expanded)} className="flex items-center max-[360px]:text-sm cursor-pointer hover:text-[#256ab4] font-medium select-none">
          <ExpandMoreRoundedIcon className={`w-[22px] h-[22px] transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "View less" : "View more"}
        </p>
      </div>
      {loading && 
        <div className="flex flex-col gap-1">
          <div className="w-full h-11 rounded-md bg-[#ffffff0c]"></div>
          <div className="w-full h-11 rounded-md bg-[#ffffff0c]"></div>
          <div className="w-full h-11 rounded-md bg-[#ffffff0c]"></div>
        </div>
      }
      {!loading && firstThreeItems.map((coin) => {
        const profit = coin.item.data.price_change_percentage_24h.usd > 0;
        const item = coin.item;
        return (
          <Link href={`/coins/${item.id}`} key={item.id} className="flex justify-between p-2 rounded-md text-white hover:bg-[#000d1f]">
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-[8px]">#{item?.market_cap_rank}</p>
              <Image src={item?.small} alt={item.name} width={28} height={28} className="h-7 rounded-[50%]" />
              <Typography variant="h4" className="text-sm max-[360px]:text-xs" style={{ fontFamily: "Montserrat" }}>
                {item.name}
              </Typography>
            </div>
            <div className="flex flex-wrap justify-end items-center">
              <Typography variant="h4" className="text-xs" style={{ fontFamily: "Montserrat" }}>
                ${orderNumber(item.data.price)}
              </Typography>
              <div className={`${ profit ? "text-[#32ca5b]" : "text-[#ff3a33]"} text-xs flex justify-end items-center`}>
                {profit && <ArrowDropUpRoundedIcon className="-mr-1" />}
                {!profit && <ArrowDropDownRoundedIcon className="-mr-1" />}
                {item.data.price_change_percentage_24h.usd.toFixed(2)
                .toString()
                .replace("-", "")}%
              </div>
            </div>
          </Link>
        )
      })}
    </Container>
  )
}
