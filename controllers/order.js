const Order = require("../models/order");
const Column = require("../models/Columns");
const Title = require("../models/Title");
const { getRandomOrderId } = require("../utils/commons");

const getAllOrders = async (req, res) => {
  try {
    //const { email, data } = req.body;
    await Order.find({})
      .then((orders) => {
        res.json({ orders: orders });
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  } catch (error) {
    return res.status(422).json({ error: err });
  }
};

const addNewOrder = async (req, res) => {
  try {
    const { order_quantity, total_price, order_status, payment_status } =
      req.body;

    //creating uid
    let uid = "OID-" + getRandomOrderId();

    if (!uid || !order_quantity || !total_price) {
      return res.status(422).json({ error: "Please give all the data" });
    } else {
      const order = new Order({
        uid: uid,
        order_quantity: order_quantity,
        total_price: total_price ? total_price : 0,
        order_status: order_status ? order_status : "pending",
        payment_status: payment_status ? payment_status : "unpaid",
      });

      order
        .save()
        .then((savedOrder) => {
          res.json({ order: savedOrder });
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

const filtering = async (req, res) => {
  try {
    //const { email, data } = req.body;

    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "_id";
    let order_status = req.query.order_status || "All";
    let payment_status = req.query.payment_status || "All";

    const orderStatusOptions = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled",
    ];
    const paymentStatusOptions = ["unpaid", "paid"];

    //if it gets all it will send all states of orders
    order_status === "All"
      ? (order_status = [...orderStatusOptions])
      : (order_status = req.query.order_status.split(","));

    //if it gets all it will send all states of orders
    payment_status === "All"
      ? (payment_status = [...paymentStatusOptions])
      : (payment_status = req.query.payment_status.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    let queryObject = {
      order_status: { $in: [...order_status] },
      payment_status: { $in: [...payment_status] },
      uid: { $regex: search, $options: "i" },
    };

    if (req.query.start_date && req.query.end_date) {
      queryObject = {
        order_status: { $in: [...order_status] },
        payment_status: { $in: [...payment_status] },
        uid: { $regex: search, $options: "i" },
        createdAt: {
          $gte: new Date(req.query.start_date),
          $lte: new Date(req.query.end_date),
        },
      };
    } else if (req.query.start_date && !req.query.end_date) {
      queryObject = {
        order_status: { $in: [...order_status] },
        payment_status: { $in: [...payment_status] },
        uid: { $regex: search, $options: "i" },
        createdAt: { $gte: new Date(req.query.start_date) },
      };
    } else if (!req.query.start_date && req.query.end_date) {
      queryObject = {
        order_status: { $in: [...order_status] },
        payment_status: { $in: [...payment_status] },
        uid: { $regex: search, $options: "i" },
        createdAt: { $lte: new Date(req.query.end_date) },
      };
    }

    //const orders = await Order.find({ uid: { $regex: search, $options: "i" } })
    const orders = await Order.find(queryObject)
      //.where("order_status")
      //.in([...order_status])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Order.countDocuments(queryObject);

    const columns_found = await Column.find().sort("serial");

    const columns = [];
    for (var i = 0; i < columns_found.length; i++) {
      columns.push(columns_found[i].column_name);
    }

    const title = await Title.findOne({});

    const response = {
      error: false,
      total,
      columns: columns,
      title: title.title ? title.title : "Order History",
      page: page + 1,
      limit,
      order_status_options: orderStatusOptions,
      payment_status_options: paymentStatusOptions,
      orders,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: true, message: error });
  }
};

// const removeLikedMovie = async (req, res) => {
//   try {
//     const { email, data } = req.body;

//     const foundUser = await User.findOne({ email: email });

//     if (foundUser) {
//       const { likedMovies } = foundUser;
//       const isAdded = likedMovies.filter((movie) => movie.id == data.id);

//       if (isAdded.length > 0) {
//         await User.findByIdAndUpdate(
//           foundUser._id,
//           {
//             $pull: { likedMovies: { id: data.id } },
//           },
//           { new: true }
//         )
//           .then((updatedUser) => {
//             res.json({ user: updatedUser });
//           })
//           .catch((err) => {
//             return res.status(422).json({ error: "Update Failed" });
//           });
//       } else {
//         return res.status(409).json({ error: "movie not added as liked" });
//       }
//     } else {
//       return res.status(404).json({ error: "No user found" });
//     }
//   } catch (error) {
//     res.status(422).json({ error: error });
//   }
// };

module.exports = { getAllOrders, addNewOrder, filtering };
