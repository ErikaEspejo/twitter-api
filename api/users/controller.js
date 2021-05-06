const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserById } = require('../services/userService');
const { locale } = require('../../locale');
const { config } = require('../../config');
const User = require('./model');

const list = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  User.find({ active: true }, ['name', 'username', 'createdAt', 'updatedAt'])
    .limit(parseInt(limit, 10)) // maximma cantidad de elementos por pagina
    .skip(skip) // saltarse elementos para mostrar lo que se quiere
    .sort({ createdAt: -1 }) // ordena ascendentemente
    .then(async (users) => { // promise
      const total = await User.estimatedDocumentCount();
      const totalPages = Math.round(total / limit);
      const hasMore = page < totalPages;

      res.status(200).json({
        total,
        currentPage: page,
        totalPages,
        hasMore,
        users,
      });
    });
};

const create = async (req, res) => {
  const {
    name, email, username, password, role,
  } = req.body; // Destructuración de las llaves - valor del request

  const userFound = await User.find({ $or: [{ username }, { email }] });

  if (userFound.length > 0) {
    res
      .status(500)
      .json({ message: locale.translate('errors.user.userExist') });
    return;
  }

  const user = {
    name,
    email,
    username,
    password,
    role,
  };

  const newUser = new User(user);
  newUser.save().then((userCreated) => {
    res.status(200).json(userCreated);
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({ username });
  if (foundUser) {
    // eslint-disable-next-line no-underscore-dangle
    const userId = foundUser._id;
    const result = await bcrypt.compare(password, foundUser.password);
    if (result) {
      const token = jwt.sign({ userId }, config.jwtKey);
      res
        .status(200)
        .cookie('token', token, { maxAge: 60 * 60 * 24 * 10000, httpOnly: true })
        .json({
          data: {
            username: foundUser.username,
            name: foundUser.name,
            token,
          },
          message: 'ok',
        });
    } else {
      res.json({ message: locale.translate('errors.user.userNotExists') });
    }
  } else {
    res.json({ message: locale.translate('errors.user.userNotExists') });
  }
};

const remove = async (req, res) => {
  const { id } = req.body;

  await User.findOneAndDelete({ _id: { $eq: id } }, (err, docs) => {
    if (err) {
      res.status(500).json({
        message: locale.translate('errors.user.onDelete'),
      });
    } else if (docs === null) {
      res
        .status(400)
        .json({ message: locale.translate('errors.user.userNotExists') });
    } else {
      res
        .status(200)
        .json({ message: locale.translate('success.user.onDelete') });
    }
  });
};

const update = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, username, password,
  } = req.body;

  if (name && email && username && password) {
    const user = {
      name,
      email,
      username,
      password,
    };

    const userFind = await findUserById(id);

    if (userFind) {
      const userUpdated = await User.updateOne(
        // eslint-disable-next-line no-underscore-dangle
        { _id: userFind._id },
        {
          $set: { name: user.name, email: user.email, password: user.password },
        },
      );

      if (userUpdated.ok === 1) {
        res.status(204).json({
          message: locale.translate('success.user.onUpdate'),
        });
      } else {
        res.status(500).json({
          message: `${locale.translate('errors.user.onUpdate')} ${id}`,
        });
      }
    } else {
      res.status(500).json({
        message: `${locale.translate('errors.user.userNotExists')} ${id}`,
      });
    }
  } else {
    res.status(500).json({ message: locale.translate('errors.invalidData') });
  }
};

const logout = (req, res) => {
  res.clearCookie('token')
    .json({ message: 'ok' });
};

module.exports = {
  list,
  create,
  update,
  remove,
  login,
  logout,
};
