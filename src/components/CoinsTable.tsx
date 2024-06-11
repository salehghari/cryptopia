import { RootState } from '@/app/store';
import { CoinList, options } from '@/config/api';
import { setAllCoins, setAllCoinsLoading, setPage, setSearch } from '@/features/crypto/cryptoSlice';
import { Button, Container, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { separator } from './Banner/Carousel';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export const orderNumber = (number: number, forChart: boolean = false) => {
  let numStr = number?.toString();

  if(number >= 10000000000000) {
    // 10^12 => 1,000B
    // 10^13 => 10T
    return `${separator(Number(numStr.slice(0, -12)))}T`
  }
  else if(number >= 1000000000) {
    return `${separator(Number(numStr.slice(0, -9)))}B`
  }
  else if(number >= 1000000) {
    return `${separator(Number(numStr.slice(0, -6)))}M`
  }
  else if(number < 1000000 && number >= 0.01) {
    if(forChart) {
      return separator(Number(number.toExponential(2)))
    }
    return separator(Number(number?.toFixed(2).replace(/\.0+$/,'')))
  }
  else if(number < 0.01) {
    return number.toExponential(2)
  }
}

export default function CoinsTable() {
  const [perPage, setPerPage] = useState(10);
  const [pageInput, setPageInput] = useState(1);


  const dispatch = useDispatch();

  const router = useRouter();

  const tableRowItems: string[] = ["Coin", "Price", "24h Change", "Market Cap"];

  const currency = useSelector((state: RootState) => state.crypto.currency);
  const symbol = useSelector((state: RootState) => state.crypto.symbol);
  const loading = useSelector((state: RootState) => state.crypto.loading.allCoins);
  const allCoins = useSelector((state: RootState) => state.crypto.allCoins);
  const page = useSelector((state: RootState) => state.crypto.page);
  const search = useSelector((state: RootState) => state.crypto.search);
  const globalData = useSelector((state: RootState) => state.crypto.globalData);


  const fetchAllCoins = async () => {
    dispatch(setAllCoinsLoading(true));

    const { data } = await axios.get(CoinList(currency, page), options);
    dispatch(setAllCoins(data));

    dispatch(setAllCoinsLoading(false));
  };

  useEffect(() => {
    fetchAllCoins()
  }, [currency, page])

  useEffect(() => {
    setPageInput(page);
    setPerPage(10);
  }, [page])


  
  const handleScroll = () => {
    const offsetHeight = document.documentElement.offsetHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    
    if (offsetHeight - (innerHeight + scrollTop) <= 10 && router.pathname === "/" && !loading && !search) {
      setPerPage(perPage + 10);
      if (perPage === 100 && page < Number((globalData.data.active_cryptocurrencies / 100).toFixed()) + 1) {
        dispatch(setPage(Number(page) + 1));
        setPerPage(10);
        window.scrollTo({top: 0, behavior: "instant"});
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const handleSearch = () => {
    return allCoins.filter((coin: { name: string; symbol: string; }) => (
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    ))
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      dispatch(setPage(pageInput));
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container className="text-center">
        <Typography variant="h4" className="m-5" style={{ fontFamily: "Montserrat" }}>
          Prices by Market Cap
        </Typography>
        <div className="flex justify-between gap-3 mb-5">
          <TextField
            className="w-full"
            label="Search For a Crypto Currency.."
            variant="filled"
            value={search}
            onChange={(e) => dispatch(
              setSearch(e.target.value)
            )}
          />
          <TextField
            className="w-1/2"
            label="Page"
            type="number"
            value={pageInput}
            InputLabelProps={{
              shrink: true,
            }}
            onKeyDown={handleKeyDown}
            onChange={(e: any) => {
              if(e.target.value <= 0 || !globalData.data.active_cryptocurrencies) {
                e.target.value = "";
              }
              if(e.target.value > Number((globalData.data.active_cryptocurrencies / 100).toFixed()) + 1) {
                e.target.value = Number((globalData.data.active_cryptocurrencies / 100).toFixed()) + 1
              }
              setPageInput(e.target.value)
            }}
            InputProps={{endAdornment: 
              <Button
                className="min-w-[auto] w-16 max-sm:text-xs"
                variant="text"
                onClick={() => {
                  if(pageInput) {
                    dispatch(setPage(pageInput))
                  }
                  else {
                    dispatch(setPage(1))
                  }
                }}
              >
                Go
              </Button>
            }}
          />
        </div>
        <TableContainer className="rounded-sm pb-5">
          {loading && <LinearProgress style={{ backgroundColor: "#003566" }}></LinearProgress>}
          {!loading && handleSearch().length !== 0 &&
            <Table>
              <TableHead className="bg-[#054785]">
                <TableRow>
                  {tableRowItems.map(tableRowItem => (
                    <TableCell
                      className="text-white text-lg max-sm:text-base font-bold"
                      style={{ fontFamily: "Montserrat" }}
                      key={tableRowItem}
                      align={tableRowItem === "Coin" ? undefined : "right"}
                    >
                      {tableRowItem}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch().slice(0, perPage).map((row) => {
                  const profit = row.price_change_percentage_24h > 0;

                  return (
                    <TableRow
                      onClick={() => router.push(`/coins/${row.id}`)}
                      style={{ fontFamily: "Montserrat" }}
                      className="cursor-pointer transition-colors hover:bg-[#000a18]"
                      key={row.id}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="flex gap-4 max-sm:gap-2 text-white text-lg max-sm:text-xs font-bold"
                      >
                        <img src={row?.image} alt={row.name} className="h-12" />
                        <div className="flex flex-col max-sm:w-32">
                          <span className="uppercase text-lg">{row.symbol}</span>
                          <span className="text-gray-500">{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        align="right"
                        className="max-sm:text-xs"
                      >
                        {row.current_price && 
                          <div className="flex justify-end" style={{ textAlign: 'right' }}>
                            <span className="text-gray-400 mr-[2px]">{symbol}</span>
                            <span style={{ direction: 'ltr', display: 'inline-block' }}>
                              {orderNumber(row.current_price)}
                            </span>
                          </div>
                        }
                        {!row.current_price && "-"}
                      </TableCell>
                      <TableCell
                        align="right"
                        className={`font-medium max-sm:text-xs ${ profit ? "text-[#32ca5b]" : "text-[#ff3a33]"}`}
                      >
                        {row.price_change_percentage_24h &&
                          <div className="flex justify-end items-center">
                            {profit && <ArrowDropUpRoundedIcon className="-mr-1" />}
                            {!profit && <ArrowDropDownRoundedIcon className="-mr-1" />}
                            {row.price_change_percentage_24h.toFixed(2)
                            .toString()
                            .replace("-", "")}%
                          </div>
                        }
                        {!row.price_change_percentage_24h && "-"}

                      </TableCell>
                      <TableCell
                        align="right"
                        className="max-sm:text-xs"
                      >
                        {row.market_cap &&
                          <div style={{ textAlign: 'right' }}>
                            <span className="text-gray-400 mr-[2px]">{symbol}</span>
                            <span style={{ direction: 'ltr', display: 'inline-block' }}>
                              {orderNumber(row.market_cap)}
                            </span>
                          </div>
                        }
                        {!row.market_cap && row.market_cap !== 0 && "-"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          }
          {!loading && search && handleSearch().length === 0 && 
            <div className="flex items-center bg-gray-800 p-5 rounded">
              <ErrorOutlineRoundedIcon />
              <p className="mx-auto">Your search did not match any coins on current page :(</p>
            </div>
          }
        </TableContainer>
      </Container>
    </ThemeProvider>
  )
}