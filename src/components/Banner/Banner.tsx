import { Container, Typography } from "@mui/material";
import Carousel from "./Carousel";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "@/app/store";
import CountUp from 'react-countup';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import "chart.js/auto";
import TrendingSearchCoins from "../TrendingSearchCoins";
import { orderNumber } from "../CoinsTable";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';


export default function Banner() {
  interface IData {
    [key: string]: any
  }
  const [data, setData] = useState<IData>({active_cryptocurrencies: 0, total_market_cap: "", markets: 0, ended_icos: 0});

  const globalData = useSelector((state: RootState) => state.crypto.globalData);
  const profit = data?.market_cap_change_percentage_24h_usd > 0;


  interface CryptoData {
    id: string;
    value: number;
    label: string;
  }
  const [chartData, setChartData] = useState<CryptoData[]>([]);

  useEffect(() => {
    const marketCapData = globalData.data?.market_cap_percentage;

    if(marketCapData) {
      const pieChartData = Object.keys(marketCapData).map(coin => ({
        id: coin,
        value: marketCapData[coin],
        label: coin
      }));
  
      setChartData(pieChartData);
    }
  }, [globalData.data?.market_cap_percentage]);

  useEffect(() => {
    setData(globalData.data)
  }, [globalData]);


  return (
    <>
      <div className="banner">
        <Container className="banner-content flex flex-col justify-around pt-6">
          <div className="flex flex-col gap-6 justify-end text-center h-2/5">
            <Typography
              variant="h2"
              className="font-bold max-sm:text-5xl"
              style={{ fontFamily: "Montserrat" }}
            >
              Cryptopia
            </Typography>
            <Typography
              variant="subtitle2"
              className="text-gray-400 capitalize mb-4"
              style={{ fontFamily: "Montserrat" }}
            >
              Get All The Info Regarding Your Favorite Crypto Currency!
            </Typography>
          </div>
          <Carousel />
        </Container>
      </div>
      {data?.total_market_cap?.usd && data?.market_cap_change_percentage_24h_usd && <Container className="flex justify-center mt-8">
        <Typography data-editorial-content-target="description" className="text-lg font-medium text-gray-400" variant="h2">
          The global cryptocurrency market cap today is ${orderNumber(data?.total_market_cap?.usd)}, a 
          <span className={`${ profit ? "text-[#32ca5b]" : "text-[#ff3a33]"}`}>
            {profit && <ArrowDropUpRoundedIcon className="-mr-1" />}
            {!profit && <ArrowDropDownRoundedIcon className="-mr-1" />}
            {data?.market_cap_change_percentage_24h_usd?.toFixed(2).toString().replace("-", "")}
            %&nbsp;
          </span>
          change in the last 24 hours.
        </Typography>
      </Container>}
      <Container className="flex justify-center max-sm:flex-col my-8">
        {data?.active_cryptocurrencies === 0 || !data && 
          <div className="bg-gray-900 w-full h-44 max-sm:h-[340px] rounded-lg"></div>
        }
        {data?.active_cryptocurrencies !== 0 && data &&
          <> 
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 sm:border-r-2 text-center border-[#ffffff4d] max-sm:mx-8 max-sm:border-b-2">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                <CountUp start={0} end={Math.floor(data?.active_cryptocurrencies / 10) * 10} duration={2} delay={0.5} />+
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Coins
              </Typography>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 sm:border-r-2 text-center border-[#ffffff4d] max-sm:mx-8 max-sm:border-b-2">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                <CountUp start={0} end={Math.floor(data?.markets / 10) * 10} duration={2} delay={0.5}/>+
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Markets
              </Typography>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 max-sm:mx-8 text-center">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                <CountUp start={0} end={Math.floor(data?.ended_icos / 10) * 10} duration={2} delay={0.5}/>+
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Initial coin offerings (ICOs)
              </Typography>
            </div>
          </>
        }
      </Container>
      <Container className="flex flex-col items-center justify-center mb-14">
        <Typography variant="h4" className="text-center mb-5" style={{ fontFamily: "Montserrat" }}>
          Coins&apos; Dominance By Market Cap
        </Typography>
        <div className="flex justify-center w-full max-w-[800px]">
          <PieChart
            series={[
              {
                data: chartData,
                arcLabel: (item) => `${item.value.toFixed(1)}%`,
                arcLabelRadius: 70,
                arcLabelMinAngle: 10,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 2,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { color: "#003566" },
                cx: "40%",
              },
            ]}
            tooltip={{trigger: "none"}} // mui pls fix tooltip's bugs -_-
            slotProps={
              {
                legend: {itemMarkHeight: 10, itemMarkWidth: 10, labelStyle: {fill: "#fff"}}
              }
            }
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
              },
              backgroundColor: "#256ab4",
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1050%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(0%2c 53%2c 102%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c533.106C106.083%2c544.388%2c216.328%2c533.613%2c309.228%2c481.169C404.876%2c427.174%2c478.068%2c339.058%2c522.038%2c238.407C565.584%2c138.727%2c569.201%2c28.056%2c554.244%2c-79.688C539.232%2c-187.828%2c507.043%2c-294.902%2c436.444%2c-378.181C365.427%2c-461.954%2c269.433%2c-535.957%2c159.964%2c-544.786C55.136%2c-553.241%2c-23.968%2c-454.855%2c-124.325%2c-423.411C-222.05%2c-392.791%2c-349.301%2c-438.081%2c-419.269%2c-363.299C-488.991%2c-288.78%2c-433.163%2c-164.746%2c-458.764%2c-65.96C-488.993%2c50.683%2c-626.071%2c153.666%2c-582.344%2c265.948C-539.329%2c376.401%2c-377.4%2c370.179%2c-269.663%2c419.605C-179.188%2c461.112%2c-98.984%2c522.579%2c0%2c533.106' fill='%23002a52'%3e%3c/path%3e%3cpath d='M1440 1255.766C1571.025 1244.4740000000002 1619.676 1074.6689999999999 1708.333 977.534 1772.249 907.506 1846.88 850.019 1888.213 764.692 1930.237 677.937 1942.78 583.624 1945.815 487.275 1949.3980000000001 373.524 1967.113 251.87400000000002 1907.4189999999999 154.97899999999998 1844.5720000000001 52.966999999999985 1736.539-29.80899999999997 1617.725-45.277000000000044 1502.332-60.29899999999998 1411.239 49.80099999999999 1297.771 75.613 1173.061 103.98200000000003 1018.515 26.793999999999983 923.679 112.60500000000002 830.411 196.998 870.312 351.051 855.343 475.93899999999996 840.772 597.51 780.787 726.61 837.053 835.357 893.083 943.649 1040.185 956.76 1140.201 1026.497 1245.532 1099.94 1312.067 1266.792 1440 1255.766' fill='%2300407a'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1050'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
              backgroundPosition: "center",
              paddingY: "16px",
              borderRadius: "8px",
            }}
            cx="50%"
            cy="50%"
            width={400}
            height={200}
          />
        </div>
      </Container>
      <TrendingSearchCoins />
    </>
  )
}
