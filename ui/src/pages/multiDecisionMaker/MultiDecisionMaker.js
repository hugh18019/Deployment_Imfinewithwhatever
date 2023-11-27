import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, Grid, Tabs, Tab } from "@mui/material";
import { Scrollbar } from "react-scrollbars-custom";

import Text from "../../ui_components/Text";
import TextField from "../../ui_components/TextField";
import styled from "@emotion/styled";
import GridRow from "../../ui_components/GridRow";
import RoundButton from "../../ui_components/RoundButton";
import attributes from "../../config";
import Checkboxes from "../../ui_components/Checkbox";
import Dropdown from "../../ui_components/Dropdown";

import { MessageContext } from "../../providers/MessageProvider";
import { RestaurantsContext } from "../../providers/RestaurantsProvider";
import { GameContext } from "../../providers/GameProvider";

import { UPDATE_MESSAGE } from "../../reducer/Message/MessageAction";
import { UPDATE_RESTAURANTS_FOR_GAMES } from "../../reducer/Game/GameActions";
import { UPDATE_RESTAURANT, UPDATE_RESTAURANTS } from "../../reducer/Main/actions";

const GridRowStyle = (display) => {
  const newdisplay =
    display == null
      ? {
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }
      : { ...display };
  return {
    display: "flex",
    ...newdisplay,
  };
};

const RowGridComponent = styled(Grid)(({ children, ...otherProps }) => ({
  container: true,
  gridRow: true,
  ...otherProps,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const RowComponent = styled(Grid)((props) => ({
  gridRow: true,
  color: "primary",
  display: "flex",
  width: "100%",
  flexDirection: props.flexDirection ? props.flexDirection : "row",
  justifyContent: props.flexDirection ? props.flexDirection : "center",
  alignItems: "center",
  data_id: "row-component",
  columnGap: 20,
}));

const RestaurantsInputComponent = styled(Grid)({
  // gridRow: true,
  container: true,
  rowGap: 30,
  width: "100%",
});

const RestaurantsInput = (props) => {
  const { restaurantInputs, handleChange, handleAddRestaurantInput, handleRemoveRestaurantInput, restaurants, flex } =
    props;

  return (
    <RowGridComponent flex={flex} rowGap={20}>
      <RowComponent>
        <Text text={"Enter Restaurants"} />
      </RowComponent>
      <Scrollbar style={{ width: 900, height: 500 }}>
        <RestaurantsInputComponent autoFocus={true}>
          <Dropdown inputs={restaurantInputs} options={restaurants} handleChange={handleChange} />
          <RowComponent>
            <RowComponent onClick={() => handleAddRestaurantInput()}>
              <Text text={"+"} />
              <TextField value={"add more"} />
            </RowComponent>
            <RowComponent onClick={() => handleRemoveRestaurantInput()}>
              <Text text={"-"} />
              <TextField value={"remove last"} />
            </RowComponent>
          </RowComponent>
        </RestaurantsInputComponent>
      </Scrollbar>
    </RowGridComponent>
  );
};

const GamesInputComponent = (props) => {
  const { games, checked, onSelectGameCallback, flex } = props;

  return (
    <RowComponent flex={flex} flexDirection={"column"}>
      <RowComponent>
        <Text text={"Select Game"} />
      </RowComponent>
      <RowComponent>
        <Checkboxes
          labels={games}
          checked={checked}
          onSelectGameCallback={onSelectGameCallback}
          style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}
        />
      </RowComponent>
    </RowComponent>
  );
};

// For the benefit of easily adding additional styles to the default mui components
// by using the styled function
const MultiDecisionMakerComponent = styled(Grid)(() => ({
  container: true,
  rowGap: 20,
  height: "90vh",
  width: "width",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "flex-start",
}));

const createInitialRestaurants = (num) => {
  return Array(num)
    .fill()
    .map(() => [{}]);
};

const MultiDecisionMaker = (props) => {
  const games = attributes.games.names;
  const navigate = useNavigate();

  const { messageState, messageDispatch } = useContext(MessageContext);
  const { restaurantState, restaurantDispatch } = useContext(RestaurantsContext);
  const { gameState, gameDispatch } = useContext(GameContext);

  // console.log("restaurants", restaurantState.restaurantsData);

  const [numRestaurants, setNumRestaurants] = useState(3);
  const [restaurantInputs, setRestaurantInputs] = useState(createInitialRestaurants(numRestaurants));
  const [selectedGame, setSelectedGame] = useState("");
  const [checked, setChecked] = useState(games.map(() => false));

  const onSelectGameCallback = (game, gameIndex) => {
    const newChecked = checked.map((bool, index) => {
      if (index === gameIndex) return true;
      if (index !== gameIndex) return false;
      return bool;
    });

    // const newGames = games.map((game, index) =>
    //   newChecked[index] ? game : ""
    // );

    setChecked(newChecked);
    setSelectedGame(game);
  };

  const handleGoButtonClick = () => {
    // Game start requires at least three valid restaurant inputs that are not empty strings
    if (restaurantInputs.length < 3 && restaurantInputs.some((input) => input !== "")) {
      return;
    }

    messageDispatch({
      type: UPDATE_MESSAGE,
      message: "Start game ?",
      interactive: true,
      onModalClick: handleGameStart,
    });
  };

  const handleGameStart = (gameStart) => {
    if (gameStart) {
      if (restaurantInputs.every((restaurant) => restaurant === "")) return;
      if (selectedGame === "") return;

      const filteredRestaurantInputs = restaurantInputs.filter((restaurant) => Object.keys(restaurant).length !== 0);

      const handleGameEndCallback = (selectedItem) => {
        // Note the selectedItem returned by the games is a restaurant data object

        restaurantDispatch({
          type: UPDATE_RESTAURANTS,
          payload: {
            restaurantsData: [selectedItem],
          },
        });

        messageDispatch({
          type: UPDATE_MESSAGE,
          message: `you selected ${selectedItem.name}`,
          onModalClick: () => navigate("/Restaurants"),
        });
      };

      gameDispatch({
        type: UPDATE_RESTAURANTS_FOR_GAMES,
        restaurants: filteredRestaurantInputs,
        onGameEndCallback: handleGameEndCallback,
      });

      console.log("game started");
      navigate(`/Games/${selectedGame}`);
    }
  };

  const handleRestaurantChange = (index, restaurant) => {
    const newRestaurantInputs = [...restaurantInputs];
    newRestaurantInputs[index] = { ...restaurant };
    setRestaurantInputs(newRestaurantInputs);
  };

  const handleAddRestaurantInput = () => {
    const newRestaurantInputs = [...restaurantInputs, [""]];
    setRestaurantInputs(newRestaurantInputs);
  };

  const handleRemoveRestaurantInput = () => {
    if (restaurantInputs.length === 3) {
      return;
    }
    const newRestaurantInputs = [...restaurantInputs];
    newRestaurantInputs.pop();
    setRestaurantInputs(newRestaurantInputs);
  };

  return (
    <MultiDecisionMakerComponent>
      <RestaurantsInput
        flex={"70%"}
        restaurantInputs={restaurantInputs}
        handleChange={handleRestaurantChange}
        handleAddRestaurantInput={handleAddRestaurantInput}
        handleRemoveRestaurantInput={handleRemoveRestaurantInput}
        restaurants={restaurantState.restaurantsData}
      />
      <GamesInputComponent flex={"20%"} games={games} checked={checked} onSelectGameCallback={onSelectGameCallback} />
      <RowComponent>
        <RowComponent display={{ justifyContent: "center" }}>
          <RoundButton onClick={handleGoButtonClick}>
            <Text text="Go!" />
          </RoundButton>
        </RowComponent>
      </RowComponent>
    </MultiDecisionMakerComponent>
  );
};

export default MultiDecisionMaker;
