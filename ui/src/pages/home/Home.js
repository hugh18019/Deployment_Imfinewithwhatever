import { useContext } from "react";

import Logo from "../../Assets/Logo.png";
import Developers from "../../components/Developers";

import CardMedia from "@mui/material/CardMedia";
import Backdrop from "@mui/material/Backdrop";

import { Grid, useTheme } from "@mui/material";
import { styled } from "@mui/system";

import Icons from "../../components/Icons";
import { AssetsContext } from "../../providers/AssetsProvider";
import FoodWalls from "../../components/Three/FoodWalls";

const HomeComponent = styled(Grid)(({ theme }) => ({
  container: true,
  height: "100vh",
  width: "80vw",
  display: "flex",
  margin: "auto",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  zIndex: 1,
  // backgroundColor: theme.palette.background.default,
  backgroundColor: "indianred",
}));

const LogoComponent = styled(CardMedia)({
  backgroundImage: `url(${Logo})`,
  backgroundSize: "contain",
  alt: "logo",
  // height: "500px",
  // maxHeight: "500px",
  // minHeight: "200px",
  // minWidth: "200px",
  // maxWidth: "500px",
});

const Home = (props) => {
  console.log("Home Page");

  return (
    <HomeComponent data_id="home-container">
      <LogoComponent
        src={Logo}
        sx={{
          width: {
            xs: "300px",
            sm: "500px",
            lg: "700px",
          },
          height: {
            xs: "800px",
            sm: "800px",
            lg: "800px",
          },
        }}
      />
      {/* <Developers
        style={{s
          height: "50px",
          width: "100%",
        }}
        color="white"
      /> */}
    </HomeComponent>
  );
};

export default Home;
