const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { config } = require('../../config');

const collection = 'users';

const objectSchema = {
  name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: { type: String, default: 'registered', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
};

const options = {
  timestamps: true,
};

const schema = new mongoose.Schema(objectSchema, options);

// eslint-disable-next-line func-names
schema.pre('updateOne', function (next) {
  const data = this.getUpdate().$set;

  bcrypt.hash(data.password, config.saltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    data.password = hash;
    next();
  });
});

// eslint-disable-next-line func-names
schema.pre('save', function (next) {
  const salt = bcrypt.genSaltSync(config.saltRounds);
  const passwordHash = bcrypt.hashSync(this.password, salt);

  this.password = passwordHash;
  next();
});

const User = mongoose.model(collection, schema);

module.exports = User;
