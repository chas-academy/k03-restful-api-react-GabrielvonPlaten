const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    minlength: 1,
  },

  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },

  orderHistory: [{
    order: {
      type: String,
      minlength: 1,
    }
  }],

  password: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
    validate(val) {
      if (val.toLowerCase().includes('password') || val.toLowerCase().includes('admin') || val.toLowerCase().includes('root')) {
        throw new Error('Password cannot be "Password", "admin" or "root"');
      }
    },
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is invalid')
      }
    },
  },

  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
}, {
  timestamps: true
});

// Find Users by its credendials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to log in');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to log in');
  };

  return user;
}

// Generate Auth Session Token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "KkPjMC9RLpjPN9O")

  user.tokens = [...user.tokens, {token}];
  await user.save();

  return token;
};


userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  };

  next();
})

let User = mongoose.model('User', userSchema);
module.exports = User;