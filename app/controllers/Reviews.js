import Application from './Application';
import QoodishClient from '../models/QoodishClient';

class Reviews extends Application {
  async index(token, mapId, params) {
    const client = new QoodishClient;
    let reviews;
    if (params.place_id) {
      reviews = await client.fetchSpotReviews(token, mapId, params.place_id);
    } else {
      reviews = []; // currently unimplemented
    }
    return reviews;
  }

  async show(token, mapId, reviewId) {
    const client = new QoodishClient;
    let review = await client.fetchReview(token, mapId, reviewId);
    return review;
  }

  async create(token, mapId, params) {
    const client = new QoodishClient;
    let review = await client.createReview(token, mapId, params);
    return review;
  }

  async update(token, reviewId, params) {
    const client = new QoodishClient;
    let review = await client.updateReview(token, reviewId, params);
    return review;
  }

  async delete(token, reviewId) {
    const client = new QoodishClient;
    let review = await client.deleteReview(token, reviewId);
    return review;
  }
}

export default Reviews;
