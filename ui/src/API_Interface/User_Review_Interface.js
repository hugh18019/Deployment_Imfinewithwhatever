export default class UserReviews {
  constructor(axiosAgent) {
    this.axiosAgent = axiosAgent;
    this.name = "UserReviews";
  }

  async getReview(params) {
    return (
      this.axiosAgent
        .get(`user_reviews/review/${params.restaurantID}/${params.email}`) // passing params as an object here because of the format of queries with multiple parameters
        // such as select from user_reviews where id = ? and email = ?
        // because of the keyword and in between cannot conveniently pass in an array
        .then((reviewInfo) => reviewInfo.data)
        .catch((error) => ({
          error,
          review: undefined,
        }))
    );
  }

  async addReview(params) {
    return (
      this.axiosAgent
        .post(`user_reviews/review`, Object.values(params)) // conveniently passing in an array
        // like this: insert into user_reviews values (?)
        .then((reviewInfo) => reviewInfo.data)
        .catch((error) => ({
          error,
          review: undefined,
        }))
    );
  }

  async updateReview(params) {
    return this.axiosAgent
      .post(`user_reviews/review/update`, { ...params })
      .then((reviewInfo) => reviewInfo.data)
      .catch((error) => ({
        error,
        review: undefined,
      }));
  }

  async getReviews(params) {
    return this.axiosAgent
      .get(`user_reviews/${params.email}`)
      .then((reviewsInfo) => reviewsInfo.data)
      .catch((error) => ({
        error,
        reviews: undefined,
      }));
  }

  async deleteReview(params) {
    return this.axiosAgent
      .post(`user_reviews/review/delete`, { ...params })
      .then((reviewInfo) => reviewInfo.data)
      .catch((error) => ({
        error,
        review: undefined,
      }));
  }
}
