const axios = require("axios");

const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
};

const getRestaurantsByCuisine = async (ctx) => {
  try {
    const endpoint = "https://api.yelp.com/v3/businesses/search";
    console.log("yelp api get restaurant by cuisine called");
    let params = ctx.params;
    await axios
      .get(endpoint, { params, headers })
      .then((response) => {
        console.log(response.data);
        ctx.body = {
          restaurantsData: { ...response.data },
          status: "OK",
        };
      })
      .catch((error) => {
        console.error(error);
        ctx.body = {
          restaurantsData: undefined,
          status: "NOT FOUND",
        };
      });
  } catch (error) {
    console.log(
      "Error while making request to Yelp API for restaurants by cuisine",
      error
    );
    throw error;
  }
};

const getRestaurantsByLocation = async (ctx) => {
  try {
    const endpoint = "https://api.yelp.com/v3/businesses/search";
    console.log("yelp api get restaurant by location called");
    // let params = ctx.request.body
    let params = ctx.params;
    await axios
      .get(endpoint, { params, headers })
      .then((response) => {
        // Handle the API response
        console.log(response.data);
        ctx.body = {
          restaurantsData: { ...response.data },
          status: "OK",
        };
      })
      .catch((error) => {
        // Handle API errors
        console.error(error);
        ctx.body = {
          restaurantsData: undefined,
          status: "NOT FOUND",
        };
      });
  } catch (error) {
    console.log(
      "Error while making request to Yelp API for restaurants by location",
      error
    );
    throw error;
  }
};

const getRestaurantById = async (ctx) => {
  try {
    let params = ctx.params;
    const endpoint = `https://api.yelp.com/v3/businesses/${params.id}`;
    await axios
      .get(endpoint, { params, headers })
      .then((response) => {
        console.log(response.data);
        ctx.body = {
          data: { ...response.data },
          status: "OK",
          message: `Success when retrieving restaurant data`,
        };
      })
      .catch((error) => {
        console.error(error);
        ctx.body = {
          data: undefined,
          status: "NOT FOUND",
          message: `The requested restaurant data cannot be found`,
        };
      });
  } catch (error) {
    console.log(
      "Error while making request to Yelp API for restaurant by id",
      error
    );
    throw error;
  }
};

// const storeRestaurants = async (ctx) => {
//   try {
//     const params = ctx.request.body
//     let res await mutate({ ...STORE_RESTAURANTS, params: [...params]})
//   }
// }

module.exports = {
  getRestaurantsByLocation,
  getRestaurantsByCuisine,
  getRestaurantById,
};
