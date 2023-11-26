import * as React from "react";
import { styled } from "@mui/material";
import { TinderLikeCard } from "react-stack-cards";
import BorderedBox from "../ui_components/BorderedBox";

import Review from "./Review";
import Grid from "@mui/material/Grid";
import UpArrow from "@mui/icons-material/KeyboardArrowUp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import API from "../API_Interface";
import { MessageContext } from "../providers/MessageProvider";
import { NavigationContext } from "../providers/NavigationProvider";

import { UPDATE_MESSAGE } from "../reducer/Message/MessageAction";
import { NAVIGATE } from "../reducer/Navigation/actions";

const ReviewsComponent = styled(Grid)({
  container: true,
  position: "absolute",
  columnGap: 20,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

const RowComponent = styled(Grid)({
  gridRow: true,
  display: "row",
  justifyContent: "center",
  alignItems: "center",
});

const ColumnComponent = styled(Grid)((props) => ({
  data_id: "column-component",
  gridRow: true,
  heights: `${props.numItems * 50}px`,
  width: `50px`,
  display: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const EMPYT_DATA_MESSAGE = "Go explore and don't forget to leave some reviews!";

const Reviews = (props) => {
  const { messageDispatch } = React.useContext(MessageContext);
  const { navigationDispatch } = React.useContext(NavigationContext);

  return (
    <ReviewsClassComponent
      messageDispatch={messageDispatch}
      navigationDispatch={navigationDispatch}
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

  onEmptyData() {
    this.props.messageDispatch({
      type: UPDATE_MESSAGE,
      message: EMPYT_DATA_MESSAGE,
      onModalClick: () =>
        this.props.navigationDispatch({
          type: NAVIGATE,
          payload: {
            destination: "/Main",
            options: { replace: true },
          },
        }),
    });
  }

  componentDidMount() {
    if (this.state.reviews == null || this.state.reviews.length === 0) this.onEmptyData();
    if (this.state.reviews != null || this.state.swipableReviews.length !== this.state.reviews.length)
      this.setState({
        ...this.state,
        swipableReviews: this.state.reviews,
      });
  }

  advanceIdx(swipableReviewIdx) {
    // let newIdx = swipableReviewIdx + 1;
    // newIdx = newIdx === this.state.reviews.length ? 0 : newIdx;
    // return newIdx;
    return 0;
  }

  onTinderSwipe() {
    this.Tinder.swipe();
    if (this.state.swipableReviews.length === 0) return;
    if (this.state.swipableReviews.length === 1) return;

    const swipedReviewIdx = this.state.activeReviewIdx;
    const newActiveReviewIdx = this.advanceIdx(swipedReviewIdx);
    const newSwipableReviews = [...this.state.swipableReviews];
    // const head = this.state.swipableReviews[0];
    const head = newSwipableReviews[0];
    newSwipableReviews.shift();
    newSwipableReviews.push(head);

    this.setState({
      ...this.state,
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
    const { restaurant_id, email } = this.state.reviews[this.state.activeReviewIdx];
    const res = await API.UserReviews.deleteReview({
      restaurantID: restaurant_id,
      email: email,
    });
    const newReviews = this.state.reviews.filter((review, index) => index !== this.state.activeReviewIdx);

    this.setState({
      ...this.state,
      reviews: [...newReviews],
      swipableReviews: [...newReviews],
    });

    if (res.status === "OK") {
      console.log(res.message);
    }
  }

  render() {
    const activeReviewIdx = this.state.activeReviewIdx;

    return (
      <ReviewsComponent>
        {this.state.swipableReviews != null && this.state.swipableReviews.length > 0 && (
          <React.Fragment>
            <ColumnComponent numItems={2}>
              <UpArrow onClick={this.onTinderSwipe} />
              <DeleteForeverIcon onClick={this.onDeleteReview} />
            </ColumnComponent>
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
                <Review review={this.state.swipableReviews[activeReviewIdx]} />
              </BorderedBox>
            </TinderLikeCard>
          </React.Fragment>
        )}
      </ReviewsComponent>
    );
  }
}

export default Reviews;
