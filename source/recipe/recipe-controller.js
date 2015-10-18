'use strict'

import Logger from 'arsenic-logger'
import Recipe from './recipe'
import Boom from 'boom'

module.exports = {

  /**
   * Returns the list of all recipes
   * TODO: Add paging
   */
  getRecipes: () => {
    return Recipe.model.find({}).exec()
  },

  /**
   * Creates new recipe
   * @type {[type]}
   */
  addRecipe: recipe => {
    Logger.info('adding recipe', recipe)
    let doc = Recipe.create()
    Recipe.setData(doc, recipe)
    return new Promise((resolve, reject) => {
      doc.save((err, savedRecipe) => {
        Logger.info('savedRecipe', savedRecipe)
        if (err) {
          Logger.error(err)
          // FIXME: error status codes should be defined
          return reject(Boom.create(500, 'Could not add Recipe'))
        } else {
          return resolve(savedRecipe)
        }
      })
    })
  },

  updateRecipe: (id, recipe) => {
    return new Promise((resolve, reject) => {
      Recipe.model.findById(id).exec()
        .then(doc => {
          Recipe.setData(doc, recipe)
          doc.save()
            .then(resolve)
        })
    })
  }
}
