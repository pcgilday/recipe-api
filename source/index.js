'use strict'

import logger from 'arsenic-logger'
import Hapi from 'hapi'
import pkg from '../package.json'
import mongoose from 'mongoose'
import recipeController from './recipe/recipe-controller'
import Boom from 'boom'

mongoose.connect('mongodb://localhost/recipes')

function boomIt (err) {
  logger.error('original pre boom error', err)
  err = Boom.create(512, 'Something went wrong')
  // if (!err.isBoom) {
  // }
  return formatBoom(err)
}

function formatBoom (boom) {
  if (!boom.data) {
    boom.data = {}
  }
  boom.data.timestamp = Date.now()
  boom.reformat()
  logger.info('after reformat', boom)
  return boom
}

let server = new Hapi.Server()
server.connection({ host: 'localhost', port: 3000 })

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply('version ' + pkg.version)
  }
})

server.route({
  method: 'GET',
  path: '/recipes',
  handler: (request, reply) => {
    recipeController.getRecipes()
      .then(recipes => reply(recipes))
      .catch(err => reply(boomIt(err)))
  }
})

server.route({
  method: 'POST',
  path: '/recipes',
  handler: (req, reply) => {
    recipeController.addRecipe(req.payload)
      .then(recipe => {
        return reply(recipe)
      })
      .catch(err => {
        const boom = boomIt(err)
        logger.error(boom)
        return reply(boom)
      })
  }
})

server.route({
  method: 'PUT',
  path: '/recipes/{id}',
  handler: (req, reply) => {
    recipeController.updateRecipe(req.params.id, req.payload)
      .then(recipe => reply(recipe))
  }
})

server.start(() => logger.info('Server running at:', server.info.uri))
