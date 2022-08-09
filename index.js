import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import Orders from "./model/productList.js";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/public", express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

const conn = await mongoose.connect("mongodb://localhost:27017/Product");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  try {
    const newOrders = new Orders(req.body);
    newOrders.status = "pending";

    await newOrders.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/orders", async (req, res) => {
  const options = {};
  if (req.query.filter) {
    options.checked = req.query.filter;
  }
  const orders = await Orders.find(options).lean();
  const ordersWithDate = orders.map((order) => {
    order.createdAt = order.createdAt.toLocaleDateString("lt-LT");
    return order;
  });

  return res.render("orders", {
    orders: ordersWithDate,
    filter: req.query.filter,
  });
});

app.post("/orders", async (req, res) => {
  let orderlist = await Orders.find();
  let uniq = orderlist.find((user) => {
    user._id, user.status;
  });
  let btnStatus = req.body.statuser;

  if (Array.isArray(req.body.checkbox)) {
    for (let i = 0; i < req.body.checkbox.length; i++) {
      await Orders.findByIdAndUpdate(req.body.checkbox[i], {
        status: `${btnStatus}`,
      });
    }
  } else {
    await Orders.findByIdAndUpdate(req.body.checkbox, {
      status: `${btnStatus}`,
    });
  }

  return res.redirect("/orders?selector=Show+all", uniq, { orderlist });
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Orders.findByIdAndDelete(id);
    return res.redirect("/orders?selector=Show+all");
  } catch (err) {
    console.log(err);
  }
});
app.listen(3000);
