import { RootState } from "@/app/store";
import { HistoricalChart } from "@/config/api";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import "chart.js/auto";
import { chartDays } from "@/config/data";
import SelectButton from "./SelectButton";


interface Props {
  coin: {
    [key: string]: any
  };
}

export default function CoinInfo({ coin } : Props) {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);

  const currency = useSelector((state: RootState) => state.crypto.currency);

  const fetchHistoricData = async () => {
    if(coin.id) {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setHistoricData(data.prices);
      console.log(data)
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


  return (
    <ThemeProvider theme={darkTheme}>
      <div className="sticky top-6 w-3/4 flex flex-col items-center justify-center mt-6 p-10 max-lg:w-full max-lg:mt-0 max-lg:p-5 max-lg:pt-0">
        {!historicData ? (
            <CircularProgress
              style={{ color: "#256ab4" }}
              size={100}
              thickness={2}
            />
          ) : (
            <>
              <Line
                data={{
                  labels: historicData?.map((coin: (string | number | Date)[]) => {
                    let date = new Date(coin[0]);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicData.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      fill: true,
                      borderColor: "#256ab4",
                      backgroundColor: "#00356680",
                      borderJoinStyle: "round",
                    },
                  ],
                }}
                options={{
                  animation: {easing: "easeInOutQuint"},
                  hover: {mode: "y"},
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />
              <div className="flex mt-5 mb-3 justify-around w-full max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
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
            </>
          )
        }
      </div>
    </ThemeProvider>
  )
}
