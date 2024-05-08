import { Container, Typography } from "@mui/material";
import Carousel from "./Carousel";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "@/app/store";
import CountUp from 'react-countup';
import { Doughnut } from 'react-chartjs-2';
import "chart.js/auto";


export default function Banner() {
  const [data, setData] = useState({active_cryptocurrencies: 0, markets: 0, ended_icos: 0});

  const globalData = useSelector((state: RootState) => state.crypto.globalData);

  const chartData = {
    labels: ['BNB', 'BTC', 'DOGE', 'ETH', 'SOL', 'STETH', 'TON', 'USDC', 'USDT', 'XRP'],
    
    datasets: [{
      label: "Market Cap Percentage",
      data: [3.6691512431545297, 50.737125385284585, 0.8941919906818783, 14.93763832719624, 2.7473500228151577, 1.164983181277857, 0.8169502469853454, 1.371530487310671, 4.575598207869957, 1.1964984697620438],
      borderWidth: 1,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8A2BE2',
        '#00FF00',
        '#800000',
        '#0000FF',
        '#FF4500',
        '#00CED1',
        '#FFA07A',
      ],
    }]
  };
  
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
              className="text-stone-400 capitalize mb-4"
              style={{ fontFamily: "Montserrat" }}
            >
              Get All The Info Regarding Your Favorite Crypto Currency!
            </Typography>
          </div>
          <Carousel />
        </Container>
      </div>
      <Container className="flex justify-center max-sm:flex-col mt-5">
        {data?.active_cryptocurrencies === 0 || !data && 
          <div className="bg-gray-900 w-full h-44 max-sm:h-[340px] rounded-lg"></div>
        }
        {data?.active_cryptocurrencies !== 0 && data &&
          <>
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 sm:border-r-2 text-center border-[#ffffff4d] max-sm:mx-8 max-sm:border-b-2">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                +<CountUp start={0} end={Math.floor(data?.active_cryptocurrencies / 10) * 10} duration={2} delay={0.5} />
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Coins
              </Typography>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 sm:border-r-2 text-center border-[#ffffff4d] max-sm:mx-8 max-sm:border-b-2">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                +<CountUp start={0} end={Math.floor(data?.markets / 10) * 10} duration={2} delay={0.5}/>
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Markets
              </Typography>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center py-5 px-12 sm:my-8 max-sm:mx-8 text-center">
              <Typography variant="h4" className="text-[#4d97d3] text-4xl">
                +<CountUp start={0} end={Math.floor(data?.ended_icos / 10) * 10} duration={2} delay={0.5}/>
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 text-lg">
                Initial coin offerings (ICOs)
              </Typography>
            </div>
          </>
        }
      </Container>
      <Container className="h-full w-full max-w-[500px]">
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 10,
                  boxHeight: 10,
                },
                title: {
                  display: true,
                  text: "Market Cap Percentage",
                }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </Container>
    </>
  )
}
