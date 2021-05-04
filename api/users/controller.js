const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { locale } = require('../../locale');
const { config } = require('../../config');
const User = require('./model');

const list = async (req, res) => {
  // paginacion, hacen parte del elemento query del request
  // Por defecto se pone que envie la primera pagina con 10 elementos, si no se pone nada
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;// el skip se salta elementos para no mostrarlos

  User.find({ active: true }, ['name', 'username', 'createdAt', 'updatedAt', 'role'])
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
      res.status(200).json({ token });
    } else {
      res.status(500).json({ message: 'user not found' });
    }
  }
};

const remove = async (req, res) => {
  const { id } = req.body;
  const userFind = await User.findOne({ _id: id });

  // eslint-disable-next-line no-underscore-dangle
  const userDeleted = await User.deleteOne({ _id: userFind._id });

  if (userDeleted.ok === 1) {
    res
      .status(200)
      .json({ message: locale.translate('errors.user.userDeleted') });
  } else {
    res.status(500).json({
      message: `${locale.translate('errors.user.onDelete')} ${userFind.username}`,
    });
  }
};

const update = async (req, res) => {
  const idParam = req.params.id;
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

    const userFind = await User.findOne({ _id: idParam });

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
          message: locale.translate('errors.user.userUpdated'),
        });
      } else {
        res.status(500).json({
          message: `${locale.translate(
            'errors.user.onUpdate',
          )} ${userFind.username}`,
        });
      }
    } else {
      res.status(500).json({
        message: `${locale.translate(
          'errors.user.userNotExist',
        )} ${userFind.username}`,
      });
    }
  } else {
    res.status(500).json({ message: locale.translate('errors.invalidData') });
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  login,
};
