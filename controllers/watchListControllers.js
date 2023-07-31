const User = require("../models/user");

exports.add = async (req, res) => {
  const { watched, movie } = req.body;
  try {
    const user = await User.findById(req.userId);
    const index = user.watchlist.findIndex((e) => e.movie == movie);

    if (index > -1) {
      user.watchlist[index].watched = watched;
    } else {
      user.watchlist.push({ movie, watched });
    }
    await user.save();
    res.json({
      response: "Added",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.list = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-watchlist._id")
      .populate("watchlist.movie", ['name', 'category']);
    res.json({
      response: "Watch list",
      status: true,
      data: user.watchlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

exports.delete = async (req, res) => {
  const { movie } = req.params;
  try {
    const user = await User.findById(req.userId);
    user.watchlist = user.watchlist.filter((e) => e.movie != movie);
    await user.save();

    res.json({
      response: "Movie deleted form the watch list",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};
