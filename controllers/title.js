const Title = require("../models/Title");

const getTitle = async (req, res) => {
  try {
    //const { email, data } = req.body;
    await Title.findOne({})
      .then((title) => {
        res.json({ title: title });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: err });
  }
};

const addNewtitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      const newTitle = new Title({
        title: title,
      });

      newTitle
        .save()
        .then((savedTitle) => {
          res.json({ title: savedTitle });
        })
        .catch((err) => {
          console.log(err);
          return res.status(422).json({ error: err });
        });
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};

const editTitle = async (req, res) => {
  try {
    const { title, _id } = req.body;

    if (!title || !_id) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      await Title.findByIdAndUpdate(
        _id,
        {
          $set: { title: title },
        },
        { new: true }
      )
        .then((updatedTitle) => {
          res.json({ title: updatedTitle });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};

module.exports = { getTitle, addNewtitle, editTitle };
