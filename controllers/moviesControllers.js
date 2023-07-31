const Movie = require("../models/movie");

exports.create = async (req, res) => {
  const { name, category, description } = req.body;
  try {
    const movie = await Movie({ name, category, description }).save();

    res.json({
      response: "Movie created",
      status: true,
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.find = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie)
      return res
        .status(404)
        .json({ response: "Movie not found", status: false });
    res.json({
      response: "Movie found",
      status: true,
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;
  try {
    await Movie.updateOne(
      { _id: id },
      {
        $set: {
          name,
          category,
          description,
        },
      }
    );
    const movie = await Movie.findById(id);
    res.json({
      response: "Movie updated",
      status: true,
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.deleteOne({ _id: id });
    res.json({
      response: "Movie deleted",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.list = async (req, res) => {
  const page = req.query?.page || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const movies = await Movie.find()
      .select("-reviews")
      .skip(skip)
      .limit(limit);
    const total = await Movie.countDocuments();
    const pages = Math.ceil(total / limit);
    res.json({
      response: "Movies",
      status: true,
      pages,
      data: movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { comment, rate } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).send();
    const isRated = movie.reviews.findIndex((m) => m.user == req.userId);
    if (isRated > -1)
      return res.status(403).send({ message: "Review is already added" });

    const totalRate = movie.reviews.reduce(
      (sum, review) => sum + review.rate,
      0
    );
    const finalRate = (totalRate + rate) / (movie.reviews.length + 1);
    await Movie.updateOne(
      { _id: id },
      {
        $push: {
          reviews: {
            user: req.userId,
            comment,
            rate,
          },
        },
        $set: {
          rate: finalRate,
        },
      }
    );
    res.json({
      response: "review added",
      status: true,
      // data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.reviews = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id)
      .select("-reviews._id")
      .populate("reviews.user", "name");
    if (!movie)
      return res
        .status(404)
        .json({ response: "Movie not found", status: false });
    res.json({
      response: "Movie found",
      status: true,
      data: movie.reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};
