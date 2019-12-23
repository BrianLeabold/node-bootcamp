const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'All tours must have a name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A max of 40 characters is allowed'],
      minlength: [10, 'A min of 10 characters is required']
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'You must set a price.']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this.price only works when creating a new document
          return val < this.price;
        },
        message:
          'The discount price $' +
          '{VALUE} can not be greater than the price of the tour.'
      }
    },
    duration: {
      type: Number,
      required: [true, 'Please set a duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Please set the maximum number of participants']
    },
    difficulty: {
      type: String,
      required: [true, 'Please set the difficulty'],
      enum: {
        values: ['Easy', 'Medium', 'Difficult'],
        message: 'Difficulty needs to set to: Easy, Medium, or Difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, 'A minimum rating of 1 is required'],
      max: [5, 'A maximum rating of 5 is allowed'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Please add a summary of this tour']
    },
    description: {
      type: String,
      required: [true, 'Please add a description of this tour'],
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Please add an image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populating Reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
////////////////////////////////////////////////
// Document Middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/////////////////////////////////////////////
//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name'
  });
  next();
});

//////////////////////////////////////////////
// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
