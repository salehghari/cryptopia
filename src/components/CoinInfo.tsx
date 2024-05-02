import { RootState } from "@/app/store";
import { HistoricalChart } from "@/config/api";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import "chart.js/auto";
import { chartDays } from "@/config/chartDays";
import SelectButton from "./SelectButton";
import { ChartArea } from "chart.js/auto";
import { historicDataBasis } from "@/config/historicData";
import { orderNumber } from "./CoinsTable";


interface Props {
  coin: {
    [key: string]: any
  };
}

export default function CoinInfo({ coin } : Props) {
  
  const [historicData, setHistoricData] : any = useState({});
  const [historicDataText, setHistoricDataText] = useState("prices");
  const [days, setDays] = useState(1);

  const currency = useSelector((state: RootState) => state.crypto.currency);

  const fetchHistoricData = async () => {
    if(coin.id) {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setHistoricData(data);
      console.log(data);
    }
  }


  useEffect(() => {
    fetchHistoricData();
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });
  let width: number, height: number, gradient: { addColorStop: (arg0: number, arg1: any) => void; };
  function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, "#00356600");
      gradient.addColorStop(0.5, "#0035663a");
      gradient.addColorStop(1, "#00356660");
    }
  
    return gradient;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="lg:sticky lg:top-6 w-3/4 flex flex-col items-center justify-center my-6 p-10 max-lg:w-full max-lg:mt-0 max-lg:p-2 max-lg:pt-0">
        {!historicData[historicDataText] ? (
            <CircularProgress
              style={{ color: "#256ab4" }}
              size={100}
              thickness={2}
            />
          ) : (
            <>
              <div className="flex  justify-center gap-3 max-sm:flex-col max-[400px]:text-sm mt-5 mb-3 w-full">
                <div className="flex flex-wrap bg-gray-800 p-1 rounded-xl">
                  {historicDataBasis.map((data) => (
                    <SelectButton
                      key={data.value}
                      onClick={() => setHistoricDataText(data.value)}
                      selected={data.value === historicDataText}
                    >
                      {data.label}
                    </SelectButton>
                  ))}
                </div>
                <div className="flex bg-gray-800 p-1 rounded-xl">
                  {chartDays.map((day) => (
                    <SelectButton
                      key={day.value}
                      onClick={() => setDays(day.value)}
                      selected={day.value === days}
                    >
                      {day.label}
                    </SelectButton>
                  ))}
                </div>
              </div>
              <Line
                data={{
                  labels: historicData[historicDataText]?.map((coin: (string | number | Date)[]) => {
                    let date = new Date(coin[0]);
                    const formattedMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${formattedMinutes} PM`
                        : `${date.getHours()}:${formattedMinutes} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicData[historicDataText]?.map((coin: any[]) => coin[1]),
                      label: `Price ( Past ${days} ${days === 1 ? "Day" : "Days"} ) in ${currency}`,
                      borderColor: "#256ab4",
                      backgroundColor: function(context) {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                
                        if (!chartArea) {
                          // This case happens on initial chart load
                          return;
                        }
                        return getGradient(ctx, chartArea);
                      },
                      fill: true,
                      borderJoinStyle: "round",
                    },
                  ],
                }}
                options={{
                  animation: {easing: "easeInOutQuint"},
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value: any) {
                          return orderNumber(value, true);
                        }
                      }
                    }
                  },
                  hover: {mode: "y", intersect: false},
                  aspectRatio: 1.6,
                  elements: {
                    point: {
                      radius: 1,
                      hitRadius: 2,
                      hoverRadius: 3,
                      drawActiveElementsOnTop: false
                    },
                  },
                }}
              />
            </>
          )
        }
      </div>
    </ThemeProvider>
  )
}
