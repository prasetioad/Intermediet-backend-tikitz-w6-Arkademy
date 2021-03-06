const ticketssModels = require('../models/products')
const db = require('../config/db')
const helpers = require('../helpers/helper')
const redis = require("redis");
const { json } = require('body-parser');
const client = redis.createClient(6379);



const getTicketByName = (req, res) => {
  const name = req.query.search
  console.log(name + ' ini Get by Name')
  ticketssModels.getTicketsByName(name)
    .then((result) => {
      res.json({
        message: 'Apakah ini yang anda Cari?',
        data: result
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const getAllTickets = (req, res) => {
  const name = req.query.search
  const currentPage = req.query.page || 1
  const perPage = req.query.per_Page || 5
  const skip = (currentPage - 1) * perPage
  console.log(name + ' Query Search berjalan')

  if (typeof name === 'string') {
    ticketssModels.getTicketsByName(name)
      .then((result) => {
        totalItems = result.length
        if (result.length > 0) {
          res.json({
            message: 'Nama yang mungkin sesuai ....',
            data: result
          })
        }
      })
      .catch((err) => {
        return helpers.response(res, null, 401, { err: err })
      })
  } else {
    console.log(currentPage.length, 'Mengunakan')
    ticketssModels.getTickets(skip, perPage)
      .then((result) => {
        res.status(201).json({
        message: 'Get Successfull',
        data: result
      })
        
      })
      .catch((err) => {
        return helpers.response(res, null, 401, { err: err })
      })
  }
}

const creatTicket = (req, res) => {
  const { name, release_date, duration, category, director, synopsis, cast , provider} = req.body
  const image = req.file.filename
  console.log(req.file);
  // console.log(req.file.size)
  // if (req.file.size > 200000) {
  //   return helpers.response(res, null, 401, { gambar: 'Gambar terlalu Besar!' })
  // }
  let data = {
    name,
    release_date,
    duration,
    director,
    synopsis,
    category,
    cast,
    provider,
    image: `${process.env.IMAGE}${image}`
  }
  data.provider = JSON.stringify(data.provider)
  console.log(data.provider);
  ticketssModels.creatTickets(data)
    .then((result) => {
      res.status(201).json({
        message: 'Creat Successfull',
        data: result
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 401, { err: err })
    })
}

// //

const updateTicket =async (req, res) => {
  console.log('masuk Update Tiket');
  const idTicket = req.params.id
  if(req.body.name !== undefined){
    const { name, release_date, seat, price, provider, genre, category, duration, director, cast, synopsis,  } = req.body
    const data = {
      name,
      release_date,
      seat,
      price,
      provider,
      genre, category, duration, director, cast, synopsis, 
    }
    ticketssModels.updateTicket(idTicket, data)
    .then((result) => {
      res.json({
        message: 'Update Success!',
        data: result
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 401, { err: err })
    })
  }else{
    console.log(req.body);
    const data = await ticketssModels.getTicketsById(req.params.id)
    data[0].seat = data[0].seat+','+ req.body.seat
    delete data[0].id
    delete data[0].nameCategory
    ticketssModels.updateTicket(idTicket, data[0])
      .then((result) => {
        res.json({
          message: 'Update Seat Success!',
          data: result
        })
      })
      .catch((err) => {
        return helpers.response(res, null, 401, { err: err })
      })
  }
}

const deleteTicket = (req, res) => {
  console.log('masuk delete');
  const idTicket = req.params.id
  ticketssModels.deleteTicket(idTicket)
    .then((result) => {
      res.json({
        message: 'Delete success!',
        data: result
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 401, { err: err })
    })
}

const getTicketById = (req, res) => {
  ticketssModels.getTicketsById(req.params.id)
    .then((result) => {
      result[0].provider = JSON.parse(result[0].provider)
      console.log(result[0].provider);
        helpers.response(res, result, 200)
    })
    .catch((err) => {
      return helpers.response(res, null, 401, err)
    })
}

const updateTicketSeat = (req, res) => {
  const idTicket = req.params.id
  const { seat } = req.body
  const data = {
    seat,
  }
  ticketssModels.updateTicket(idTicket, data)
    .then((result) => {
      res.status(200).json({
        message: 'Update Seat Success!',
        data: result
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 401, err)
    })
}

module.exports = {
  creatTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
  getTicketById,
  getTicketByName,
  updateTicketSeat
}
