'use strict'

import mongoose from 'mongoose'

// Tell mongoose to use native promises
mongoose.Promise = global.Promise

const RecipeModel = mongoose.model('Recipe', new mongoose.Schema({
  name: String,
  ingredients: [String],
  description: String,
  image: String
}))

/**
 * Set the given document the data.
 * @param {[type]} doc  [description]
 * @param {[type]} data [description]
 */
function setData (doc, data) {
  doc.name = data.name
  doc.ingredients = data.ingredients
  doc.description = data.description
  doc.image = data.image
}

module.exports = {
  model: RecipeModel,
  setData: setData,
  create: () => { return new RecipeModel() }
}
