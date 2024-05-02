import { Container, Typography } from "@mui/material";
import Carousel from "./Carousel";

export default function Banner() {
  

  return (
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
  )
}
