import { v4 as uuidv4 } from "uuid";
import mongoose from 'mongoose';

let users = [];
const kittySchema = new mongoose.Schema({
  name: String,
});
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
};
const Kitten = mongoose.model('Kitten', kittySchema);


export const getUsers = (req, res) => {
  console.log(`Users in the database: ${users}`);
  return res.status(200).json(users);
};

export const createUser = (req, res) => {
  const user = req.body;
  const silence = new Kitten({ name: 'Silence' });
  const fluffy = new Kitten({ name: 'Fluffy' });
  fluffy.speak();
  silence.speak();
  fluffy.save();
  silence.save();
  users.push({ ...user, id: uuidv4() });

  console.log(`User [${user.username}] added to the database.`);
};

export const getUser = (req, res) => {
  res.send(req.params.id);
};

export const deleteUser = (req, res) => {
  console.log(`user with id ${req.params.id} has been deleted`);

  users = users.filter((user) => user.id !== req.params.id);
};

export const updateUser = (req, res) => {
  const user = users.find((user) => user.id === req.params.id);

  user.username = req.body.username;
  user.age = req.body.age;

  console.log(
    `username has been updated to ${req.body.username}.age has been updated to ${req.body.age}`
  );
};
