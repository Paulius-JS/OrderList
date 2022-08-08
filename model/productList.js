import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Orders = new Schema({
  name: String,
  lastName: String,
  address: String,
  phone: String,
  email: String,
  city: String,
  checked: String,
  status: String,
});

export default mongoose.model("Orders", Orders);
