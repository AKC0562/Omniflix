import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IProfileDoc {
  name: string;
  avatar: string;
  watchlist: number[];
  preferences: {
    genres: number[];
    language: string;
  };
}

export interface IUserDoc extends Document {
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  profiles: IProfileDoc[];
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ProfileSchema = new Schema<IProfileDoc>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'heatblast',
    enum: [
      'heatblast', 'fourarms', 'xlr8', 'diamondhead', 'upgrade',
      'ghostfreak', 'ripjaws', 'stinkfly', 'wildmutt', 'greymatter',
      'cannonbolt', 'wildvine', 'benwolf', 'benmummy', 'benvicktor',
      'way_big', 'swampfire', 'echo_echo', 'humungousaur', 'jetray',
      'big_chill', 'chromastone', 'brainstorm', 'spidermonkey', 'goop', 'alien_x',
    ],
  },
  watchlist: {
    type: [Number],
    default: [],
  },
  preferences: {
    genres: { type: [Number], default: [] },
    language: { type: String, default: 'en' },
  },
});

const UserSchema = new Schema<IUserDoc>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profiles: {
      type: [ProfileSchema],
      validate: {
        validator: function (profiles: IProfileDoc[]) {
          return profiles.length <= 5;
        },
        message: 'Maximum 5 profiles allowed',
      },
    },
    refreshTokens: {
      type: [String],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  },
});

const User = mongoose.model<IUserDoc>('User', UserSchema);
export default User;
