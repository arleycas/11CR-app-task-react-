import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

// un Schema es la estructura de la DB
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// se ejecuta antes de guardar el registro en la DB
// se usa 'function' ya que vamosa a usar 'this'
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  // se hashea el password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;