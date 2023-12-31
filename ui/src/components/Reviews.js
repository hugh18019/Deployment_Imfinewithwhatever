import * as React from "react";
import { Button, styled } from "@mui/material";
import { ToggleCard, TinderLikeCard, StackCard } from "react-stack-cards";
import BorderedBox from "../ui_components/BorderedBox";

import Review from "./Review";
import { Grid } from "@mui/material";
import UpArrow from "@mui/icons-material/KeyboardArrowUp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API from "../API_Interface";
import { MessageContext } from "../providers/MessageProvider";

import { UPDATE_MESSAGE } from "../reducer/Message/MessageAction";

import Text from "../ui_components/Text";

const ReviewsComponent = styled(Grid)({
  container: true,
  position: 'absolute',
  rowGap: 5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
});

const RowComponent = styled(Grid)({
  gridRow: true,
  display: "row",
  justifyContent: "center",
  alignItems: "center",
});

const ColumnComponent = styled(Grid)({
  gridRow: true,
  display: "column",
  justifyContent: "center",
  alignItems: "center",
});

const Reviews = (props) => {
  const { messageState, messageDispatch } = React.useContext(MessageContext);

  return (
    <ReviewsClassComponent
      messageDispatch={messageDispatch}
      reviews={props.reviews}
    />
  );
};

class ReviewsClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directionTinder: "swipeDownRight",
      directionToggle: "sideSlide",
      directionStack: "topRight",
      isOpen: false,
      reviews: [...this.props.reviews],
      swipableReviews: [...this.props.reviews],
      activeReviewIdx: 0,
    };
    this.Tinder = null;
    this.onTinderSwipe = this.onTinderSwipe.bind(this);
    this.onDeleteReview = this.onDeleteReview.bind(this);
    this.advanceIdx = this.advanceIdx.bind(this);
  }

  advanceIdx() {
    const newIdx = this.state.activeReviewIdx + (1 % this.state.reviews.length);
    return newIdx;
  }

  onTinderSwipe() {
    this.Tinder.swipe();
    const swipedReviewIdx = this.state.activeReviewIdx;
    const newActiveReviewIdx = this.advanceIdx();

    const newSwipableReviews = [
      ...this.state.swipableReviews,
      this.state.swipableReviews[swipedReviewIdx],
    ];

    this.setState({
      activeReviewIdx: newActiveReviewIdx,
      swipableReviews: newSwipableReviews,
    });
  }

  onToggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.reviews !== this.state.reviews) {
      if (this.state.reviews.length === 0) {
        this.props.messageDispatch({
          type: UPDATE_MESSAGE,
          message: "You have no reviews left.",
        });
      }
    }
  }

  async onDeleteReview() {
    if (this.state.reviews.length === 0) return;

    const { restaurantID, email } =
      this.state.reviews[this.state.activeReviewIdx];
    const res = await API.UserReviews.deleteReview({
      restaurantID: restaurantID,
      email: email,
    });
    const newReviews = this.state.reviews.filter(
      (review, index) => index !== this.state.activeReviewIdx
    );
    this.setState({
      ...this.state,
      reviews: [...newReviews],
    });

    if (res.status === "OK") {
      console.log(res.message);
    }
  }

  render() {
    return (
      <ReviewsComponent>
        <TinderLikeCard
          images={this.state.swipableReviews}
          width="800"
          height="200"
          direction={this.state.directionTinder}
          duration={400}
          ref={(node) => (this.Tinder = node)}
          className="tinder"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        > 
          {this.state.swipableReviews != null &&
            this.state.swipableReviews.length > 0 &&
            this.state.swipableReviews.map((review, index) => (
              <BorderedBox
                style={{
                  height: "100%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Review review={review} />
              </BorderedBox>
            ))}
        </TinderLikeCard>

        <RowComponent>
          <UpArrow onClick={this.onTinderSwipe} />
          <DeleteForeverIcon onClick={this.onDeleteReview} />
        </RowComponent>

        {/* <StackCard
          images={arr}
          color={"#f95c5c"}
          width="350"
          height="240"
          direction={this.state.directionStack}
          onClick={() => alert("Hello")}
        >
          <div>i</div>
        </StackCard> */}
      </ReviewsComponent>
    );
  }
}

export default Reviews;
