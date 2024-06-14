import { AppBar, Container, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency, setSymbol, setGlobalData } from "@/features/crypto/cryptoSlice";
import { RootState } from "@/app/store";
import { allCurrencies } from "@/config/allCurrencies";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { GlobalData, options } from '@/config/api';
import { usePathname } from "next/navigation";

export default function Header() {
  const [formattedTime, setFormattedTime] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const dispatch = useDispatch();

  const globalData = useSelector((state: RootState) => state.crypto.globalData);
  const currency = useSelector((state: RootState) => state.crypto.currency);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  function formatTime(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    const formattedHours = hours % 12 || 12;
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return formattedTime;
  }

  const fetchGlobalData = async () => {
    const { data } = await axios.get(GlobalData(), options)
    dispatch(setGlobalData(data));
  }
  useEffect(() => {
    fetchGlobalData()
  }, [pathname])

  useEffect(() => {
    setFormattedTime(
      formatTime(
        new Date(globalData.data?.updated_at * 1000)
      )
    );
  }, [globalData.data?.updated_at]);

  const toggleMenu = () => {
    setMenuIsOpen(prev => !prev)
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={`min-[400px]:hidden flex justify-end items-end fixed w-full h-28 bg-[#051022] transition-all ease-in-out duration-300 ${!menuIsOpen ? "-top-full" : "top-0"}`}>
        <select
          className="text-[#dfe5ec] w-2/4 p-2 mb-2 mr-3"
          value={currency}
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedOption = e.target.options[selectedIndex];
            dispatch(setCurrency(e.target.value))
            dispatch(
              setSymbol(selectedOption.getAttribute('data-symbol'))
            );
          }}
        >
          {allCurrencies.map((currency, i) => (
            <option className="bg-[#0d1217]" key={i} data-symbol={currency.symbol} value={currency.code}>{currency.code} ({currency.symbol})</option>
          ))}
        </select>
      </div>
      <AppBar color="transparent" className="bg-[#000814d7] backdrop-blur-lg" position="fixed">
        {!formattedTime.includes("NaN") && formattedTime &&
          <div className="absolute m-1 text-[8px] text-gray-400">Last Update: {formattedTime}</div>
        }
        <Container>
          <Toolbar>
            <div className="flex-1">
              <Typography onClick={() => router.push("/")} style={{ fontFamily: "Montserrat", color: "#fff", letterSpacing: "2px" }} className="cursor-pointer inline-flex text-xl font-bold">
                Crypt
                <svg className="coin-picture" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_6)">
                    <rect width="20" height="20" rx="10" fill="white" />
                    <circle cx="10" cy="10" r="10" fill="white" />
                    <path d="M9.34659 17.3636V3.72727H10.2202V17.3636H9.34659ZM12.2869 7.81818C12.223 7.27841 11.9638 6.85938 11.5092 6.56108C11.0547 6.26278 10.4972 6.11364 9.83665 6.11364C9.35369 6.11364 8.93111 6.19176 8.56889 6.34801C8.21023 6.50426 7.92969 6.7191 7.72727 6.99254C7.52841 7.26598 7.42898 7.5767 7.42898 7.92472C7.42898 8.21591 7.49822 8.46626 7.63672 8.67578C7.77876 8.88175 7.95987 9.05398 8.18004 9.19247C8.40021 9.32741 8.63104 9.43928 8.87251 9.52805C9.11399 9.61328 9.33594 9.68253 9.53835 9.7358L10.6463 10.0341C10.9304 10.1087 11.2464 10.2116 11.5945 10.343C11.946 10.4744 12.2816 10.6538 12.6012 10.881C12.9244 11.1048 13.1907 11.3924 13.4002 11.744C13.6097 12.0955 13.7145 12.527 13.7145 13.0384C13.7145 13.6278 13.56 14.1605 13.2511 14.6364C12.9457 15.1122 12.4982 15.4904 11.9087 15.771C11.3228 16.0515 10.6108 16.1918 9.77273 16.1918C8.99148 16.1918 8.31499 16.0657 7.74325 15.8136C7.17507 15.5614 6.72763 15.2099 6.40092 14.7589C6.07777 14.3079 5.89489 13.7841 5.85227 13.1875H7.21591C7.25142 13.5994 7.38991 13.9403 7.63139 14.2102C7.87642 14.4766 8.18537 14.6754 8.55824 14.8068C8.93466 14.9347 9.33949 14.9986 9.77273 14.9986C10.277 14.9986 10.7298 14.9169 11.131 14.7536C11.5323 14.5866 11.8501 14.3558 12.0845 14.0611C12.3189 13.7628 12.4361 13.4148 12.4361 13.017C12.4361 12.6548 12.3349 12.3601 12.1325 12.1328C11.93 11.9055 11.6637 11.7209 11.3335 11.5788C11.0032 11.4368 10.6463 11.3125 10.2628 11.206L8.92045 10.8224C8.06818 10.5774 7.39347 10.2276 6.89631 9.77308C6.39915 9.31854 6.15057 8.72372 6.15057 7.98864C6.15057 7.37784 6.3157 6.84517 6.64595 6.39062C6.97976 5.93253 7.4272 5.57741 7.98828 5.32528C8.55291 5.0696 9.18324 4.94176 9.87926 4.94176C10.5824 4.94176 11.2074 5.06783 11.7543 5.31996C12.3011 5.56854 12.7344 5.90945 13.054 6.34268C13.3771 6.77592 13.5476 7.26776 13.5653 7.81818H12.2869Z" fill="#000814" />
                    <path d="M9.34659 17.3636H8.84659V17.8636H9.34659V17.3636ZM9.34659 3.72727V3.22727H8.84659V3.72727H9.34659ZM10.2202 3.72727H10.7202V3.22727H10.2202V3.72727ZM10.2202 17.3636V17.8636H10.7202V17.3636H10.2202ZM12.2869 7.81818L11.7904 7.87698L11.8426 8.31818H12.2869V7.81818ZM11.5092 6.56108L11.2349 6.9791L11.2349 6.9791L11.5092 6.56108ZM8.56889 6.34801L8.37085 5.8889L8.3692 5.88962L8.56889 6.34801ZM7.72727 6.99254L7.32539 6.69504L7.3229 6.69846L7.72727 6.99254ZM7.63672 8.67578L7.21953 8.95155L7.22511 8.95965L7.63672 8.67578ZM8.18004 9.19247L7.9138 9.61573L7.91876 9.61877L8.18004 9.19247ZM8.87251 9.52805L8.69997 9.99738L8.7061 9.99955L8.87251 9.52805ZM9.53835 9.7358L9.66834 9.25298L9.6656 9.25226L9.53835 9.7358ZM10.6463 10.0341L10.5163 10.5169L10.5194 10.5177L10.6463 10.0341ZM11.5945 10.343L11.4179 10.8108L11.4194 10.8114L11.5945 10.343ZM12.6012 10.881L12.3114 11.2885L12.3166 11.2921L12.6012 10.881ZM13.4002 11.744L13.8297 11.488L13.8297 11.488L13.4002 11.744ZM13.2511 14.6364L12.8317 14.3641L12.8303 14.3663L13.2511 14.6364ZM11.9087 15.771L11.6939 15.3195L11.6928 15.32L11.9087 15.771ZM7.74325 15.8136L7.54045 16.2706L7.5415 16.2711L7.74325 15.8136ZM6.40092 14.7589L5.99448 15.0501L5.996 15.0522L6.40092 14.7589ZM5.85227 13.1875V12.6875H5.31528L5.35354 13.2231L5.85227 13.1875ZM7.21591 13.1875L7.71406 13.1446L7.67466 12.6875H7.21591V13.1875ZM7.63139 14.2102L7.25874 14.5437L7.26343 14.5488L7.63139 14.2102ZM8.55824 14.8068L8.39205 15.2784L8.39745 15.2803L8.55824 14.8068ZM11.131 14.7536L11.3196 15.2167L11.3231 15.2152L11.131 14.7536ZM12.0845 14.0611L12.4759 14.3723L12.4777 14.37L12.0845 14.0611ZM12.1325 12.1328L12.5058 11.8003L12.5058 11.8003L12.1325 12.1328ZM11.3335 11.5788L11.1359 12.0382L11.1359 12.0382L11.3335 11.5788ZM10.2628 11.206L10.1254 11.6867L10.129 11.6877L10.2628 11.206ZM8.92045 10.8224L8.7823 11.303L8.78309 11.3032L8.92045 10.8224ZM6.89631 9.77308L6.55892 10.1421L6.55892 10.1421L6.89631 9.77308ZM6.64595 6.39062L6.24185 6.09617L6.24145 6.09673L6.64595 6.39062ZM7.98828 5.32528L8.19322 5.78135L8.19454 5.78076L7.98828 5.32528ZM11.7543 5.31996L11.5449 5.77403L11.5474 5.77514L11.7543 5.31996ZM13.054 6.34268L12.6516 6.63951L12.6532 6.64163L13.054 6.34268ZM13.5653 7.81818V8.31818H14.0817L14.0651 7.80206L13.5653 7.81818ZM9.84659 17.3636V3.72727H8.84659V17.3636H9.84659ZM9.34659 4.22727H10.2202V3.22727H9.34659V4.22727ZM9.72017 3.72727V17.3636H10.7202V3.72727H9.72017ZM10.2202 16.8636H9.34659V17.8636H10.2202V16.8636ZM12.7835 7.75938C12.7022 7.07288 12.3616 6.52237 11.7836 6.14306L11.2349 6.9791C11.566 7.19638 11.7439 7.48394 11.7904 7.87698L12.7835 7.75938ZM11.7836 6.14306C11.2315 5.78075 10.5735 5.61364 9.83665 5.61364V6.61364C10.4208 6.61364 10.8779 6.74482 11.2349 6.9791L11.7836 6.14306ZM9.83665 5.61364C9.30047 5.61364 8.80796 5.70035 8.37085 5.88891L8.76694 6.80712C9.05426 6.68317 9.40692 6.61364 9.83665 6.61364V5.61364ZM8.3692 5.88962C7.94242 6.07554 7.58734 6.34121 7.3254 6.69505L8.12914 7.29003C8.27204 7.097 8.47804 6.93298 8.76859 6.8064L8.3692 5.88962ZM7.3229 6.69846C7.05997 7.06 6.92898 7.47435 6.92898 7.92472H7.92898C7.92898 7.67906 7.99685 7.47196 8.13164 7.28663L7.3229 6.69846ZM6.92898 7.92472C6.92898 8.29794 7.01885 8.64778 7.21961 8.9515L8.05383 8.40007C7.9776 8.28475 7.92898 8.13388 7.92898 7.92472H6.92898ZM7.22511 8.95965C7.40719 9.22366 7.63856 9.44255 7.91382 9.6157L8.44627 8.76924C8.28119 8.6654 8.15034 8.53983 8.04832 8.39191L7.22511 8.95965ZM7.91876 9.61877C8.16692 9.77087 8.42746 9.89715 8.69998 9.99734L9.04505 9.05876C8.83461 8.9814 8.6335 8.88396 8.44132 8.76617L7.91876 9.61877ZM8.7061 9.99955C8.95774 10.0884 9.19295 10.1619 9.41111 10.2193L9.6656 9.25226C9.47892 9.20313 9.27024 9.1382 9.03892 9.05656L8.7061 9.99955ZM9.40837 10.2186L10.5163 10.5169L10.7763 9.55128L9.66834 9.25299L9.40837 10.2186ZM10.5194 10.5177C10.7829 10.5869 11.082 10.684 11.4179 10.8108L11.7711 9.87527C11.4108 9.73927 11.0779 9.63044 10.7733 9.55048L10.5194 10.5177ZM11.4194 10.8114C11.7285 10.9269 12.0257 11.0853 12.3114 11.2885L12.891 10.4736C12.5375 10.2222 12.1636 10.022 11.7695 9.87468L11.4194 10.8114ZM12.3166 11.2921C12.5785 11.4734 12.7963 11.7073 12.9707 11.9999L13.8297 11.488C13.5851 11.0775 13.2703 10.7361 12.8858 10.4699L12.3166 11.2921ZM12.9707 11.9999C13.1239 12.257 13.2145 12.5948 13.2145 13.0384H14.2145C14.2145 12.4592 14.0956 11.9341 13.8297 11.488L12.9707 11.9999ZM13.2145 13.0384C13.2145 13.5352 13.0859 13.9726 12.8317 14.3641L13.6704 14.9086C14.0341 14.3485 14.2145 13.7205 14.2145 13.0384H13.2145ZM12.8303 14.3663C12.5826 14.7521 12.2124 15.0727 11.6939 15.3195L12.1236 16.2224C12.784 15.9081 13.3087 15.4723 13.6719 14.9064L12.8303 14.3663ZM11.6928 15.32C11.1909 15.5603 10.557 15.6918 9.77273 15.6918V16.6918C10.6646 16.6918 11.4547 16.5427 12.1247 16.2219L11.6928 15.32ZM9.77273 15.6918C9.0441 15.6918 8.43938 15.5741 7.945 15.3561L7.5415 16.2711C8.1906 16.5573 8.93885 16.6918 9.77273 16.6918V15.6918ZM7.94606 15.3565C7.44892 15.1359 7.07497 14.8371 6.80584 14.4656L5.996 15.0522C6.38029 15.5827 6.90122 15.9869 7.54045 16.2706L7.94606 15.3565ZM6.80736 14.4677C6.54217 14.0976 6.38757 13.6638 6.351 13.1519L5.35354 13.2231C5.4022 13.9043 5.61337 14.5182 5.99449 15.0501L6.80736 14.4677ZM5.85227 13.6875H7.21591V12.6875H5.85227V13.6875ZM6.71776 13.2304C6.76119 13.7343 6.93511 14.1819 7.25877 14.5436L8.00401 13.8768C7.84472 13.6988 7.74165 13.4646 7.71406 13.1446L6.71776 13.2304ZM7.26343 14.5488C7.56883 14.8807 7.94935 15.1224 8.39206 15.2784L8.72441 14.3352C8.42139 14.2285 8.18401 14.0724 7.99936 13.8717L7.26343 14.5488ZM8.39745 15.2803C8.8301 15.4272 9.2897 15.4986 9.77273 15.4986V14.4986C9.38928 14.4986 9.03922 14.4421 8.71903 14.3334L8.39745 15.2803ZM9.77273 15.4986C10.3312 15.4986 10.8494 15.408 11.3196 15.2167L10.9425 14.2905C10.6101 14.4258 10.2228 14.4986 9.77273 14.4986V15.4986ZM11.3231 15.2152C11.7903 15.0209 12.1812 14.7428 12.4759 14.3723L11.6932 13.7499C11.5191 13.9688 11.2743 14.1524 10.939 14.2919L11.3231 15.2152ZM12.4777 14.37C12.7848 13.9791 12.9361 13.521 12.9361 13.017H11.9361C11.9361 13.3086 11.853 13.5464 11.6914 13.7522L12.4777 14.37ZM12.9361 13.017C12.9361 12.5568 12.8048 12.1359 12.5058 11.8003L11.7591 12.4654C11.8649 12.5842 11.9361 12.7529 11.9361 13.017H12.9361ZM12.5058 11.8003C12.2468 11.5094 11.9164 11.2853 11.531 11.1195L11.1359 12.0382C11.411 12.1565 11.6133 12.3017 11.7591 12.4654L12.5058 11.8003ZM11.531 11.1195C11.178 10.9677 10.7996 10.8361 10.3966 10.7242L10.129 11.6877C10.493 11.7889 10.8284 11.9059 11.1359 12.0382L11.531 11.1195ZM10.4001 10.7252L9.05782 10.3417L8.78309 11.3032L10.1254 11.6867L10.4001 10.7252ZM9.05861 10.3419C8.25795 10.1117 7.65885 9.79279 7.23369 9.40407L6.55892 10.1421C7.12808 10.6625 7.87842 11.0431 8.7823 11.303L9.05861 10.3419ZM7.23369 9.40407C6.85024 9.05349 6.65057 8.59765 6.65057 7.98864H5.65057C5.65057 8.84979 5.94805 9.58359 6.55892 10.1421L7.23369 9.40407ZM6.65057 7.98864C6.65057 7.47373 6.78774 7.04611 7.05046 6.68452L6.24145 6.09673C5.84365 6.64423 5.65057 7.28195 5.65057 7.98864H6.65057ZM7.05005 6.68508C7.32834 6.30318 7.70449 6.00097 8.19322 5.78135L7.78334 4.86922C7.14991 5.15385 6.63118 5.56188 6.24185 6.09617L7.05005 6.68508ZM8.19454 5.78076C8.68682 5.55784 9.2456 5.44176 9.87926 5.44176V4.44176C9.12087 4.44176 8.419 4.58137 7.78203 4.86981L8.19454 5.78076ZM9.87926 5.44176C10.5221 5.44176 11.0738 5.55682 11.5449 5.77402L11.9636 4.86589C11.341 4.57884 10.6426 4.44176 9.87926 4.44176V5.44176ZM11.5474 5.77514C12.0258 5.99262 12.3883 6.28252 12.6516 6.63951L13.4563 6.04586C13.0805 5.53637 12.5765 5.14445 11.9612 4.86477L11.5474 5.77514ZM12.6532 6.64163C12.914 6.99129 13.0511 7.38399 13.0656 7.8343L14.0651 7.80206C14.0441 7.15153 13.8403 6.56056 13.4548 6.04374L12.6532 6.64163ZM13.5653 7.31818H12.2869V8.31818H13.5653V7.31818Z" fill="#000814" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_6">
                      <rect width="20" height="20" rx="10" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                pia
              </Typography>
            </div>
            <div className="w-2/5 max-[399px]:hidden">
              <select
                className="w-full text-[#dfe5ec] p-3 my-2"
                value={currency}
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  const selectedOption = e.target.options[selectedIndex];
                  dispatch(setCurrency(e.target.value))
                  dispatch(
                    setSymbol(selectedOption.getAttribute('data-symbol'))
                  );
                }}
              >
                {allCurrencies.map((currency, i) => (
                  <option className="bg-[#0d1217]" key={i} data-symbol={currency.symbol} value={currency.code}>{currency.code} ({currency.symbol})</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex justify-end min-[400px]:hidden">
              {menuIsOpen ? <CloseIcon onClick={toggleMenu} /> : <MenuIcon onClick={toggleMenu} />}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  )
}