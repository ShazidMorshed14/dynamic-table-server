const Column = require("../models/Columns");

const getAllColumns = async (req, res) => {
  try {
    //const { email, data } = req.body;
    await Column.find({})
      .sort("serial")
      .then((columns) => {
        res.json({ columns: columns });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: err });
  }
};
const getDetailsColumn = async (req, res) => {
  try {
    //const { email, data } = req.body;
    await Column.findOne({ _id: req.params.id })
      .then((columns) => {
        res.json({ columns: columns });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: err });
  }
};

const addNewColumn = async (req, res) => {
  try {
    const { column_name, serial } = req.body;

    if (!column_name || !serial) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      const column = new Column({
        column_name: column_name,
        serial: serial,
      });

      column
        .save()
        .then((savedColumn) => {
          res.json({ column: savedColumn });
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

const editColumn = async (req, res) => {
  try {
    const { column_name, _id, serial } = req.body;

    if (!column_name || !_id || !serial) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      await Column.findByIdAndUpdate(
        _id,
        {
          $set: { column_name: column_name, serial: serial },
        },
        { new: true }
      )
        .then((updatedColumn) => {
          res.json({ column: updatedColumn });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};
const deleteColumn = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      await Column.findByIdAndDelete(_id)
        .then((updatedColumn) => {
          res.json({ column: updatedColumn });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
};

module.exports = {
  getAllColumns,
  addNewColumn,
  editColumn,
  deleteColumn,
  getDetailsColumn,
};
