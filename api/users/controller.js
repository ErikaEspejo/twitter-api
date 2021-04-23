const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { locale } = require('../../locale');
const { config } = require('../../config');
const User = require('./model');

const list = async (req, res) => {
  /*
  User.find({}).then((users) => {
    res.status(200).json(users);
  });
  */
  const users = await User.find({ active: true }, ['name', 'username', 'createdAt', 'updatedAt']);
  res.status(200).json(users);
};

const create = async (req, res) => {
  const {
    name, email, username, password,
  } = req.body; // Destructuración de las llaves - valor del request
  const salt = bcrypt.genSaltSync(config.saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);

  const userFound = await User.find({ $or: [{ username }, { email }] }, ['email', 'username']);

  if (userFound.length > 0) {
    res.status(500).json({ message: locale.translate('errors.user.userExist') });
    return;
  }

  const user = {
    name,
    email,
    username,
    password: passwordHash,
  };

  const newUser = new User(user);
  newUser.save().then((userCreated) => {
    res.status(200).json(userCreated);
  });
};

const getUser = (req, res) => {
  const { username } = req.params; // entra a los parametros del request (username)
  const user = users.filter((u) => u.username === username); // filtra solo el usuario

  if (Object.keys(user).length === 0) {
    res.send('Usuario no encontrado');
  } else {
    const { name } = user[0];
    const { email } = user[0];

    res.send(`Username: ${username}, Nombre: ${name}, Email: ${email}`);
  }
};

const update = (req, res) => {
  const { username } = req.params;
  const found = users.filter((u) => u.username === username);

  if (found && found.length > 0) {
    /* Si se incluyen todos los datos pero se encuentra otro usuario con el mismo username,
    actualiza con los datos ingresados. */
    found[0].name = req.body.name ? req.body.name : found[0].name;
    found[0].email = req.body.email ? req.body.email : found[0].email;
    found[0].password = req.body.password ? req.body.password : found[0].password;

    res.status(204).json(users);
  } else {
    res.status(500).json({ message: `El usuario ${username} no existe.` }); // muestra que el usuario no existe
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  const user = {
    username,
    password,
  };

  const found = users.filter((u) => u.username === user.username && u.password === user.password);

  if (found && found.length > 0) {
    const token = jwt.sign({ username: user.username }, config.jwtKey);
    res.status(200).json({ token });
  } else {
    res.status(500).json({ message: 'user not found' });
  }
};

const remove = (req, res) => {
  const { username } = req.body;
  users = users.filter((u) => u.username !== username);
  res.status(200).json(users);
};

module.exports = {
  list, create, getUser, update, login, remove,
};
