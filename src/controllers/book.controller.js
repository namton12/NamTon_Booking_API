const expressAsyncHandler = require("express-async-handler");
const Book = require("../models/book.model");
const Film = require("../models/film.model");
const PlayTime = require("../models/PlayTime.model");
const Room = require("../models/rom.model");
const User = require("../models/user.model");
const Cinema = require("../models/Cinema.model");
const tokenService = require("../services/token.service");

const createBook = expressAsyncHandler(async (req, res) => {
  try {
    const playTimeInfo = await PlayTime.findOne({
      where: { id: req.body.playTimeId },
    });

    const userInfo = await User.findOne({
      where: { id: req.body.userId },
    });
    const filmInfo = await Film.findOne({
      where: { id: playTimeInfo.dataValues.filmId },
    });
    const roomInfo = await Room.findOne({
      where: { id: playTimeInfo.dataValues.roomId },
    });
    const cinemaInfo = await Cinema.findOne({
      where: { id: roomInfo.dataValues.cinemaId },
    });
    const txInfo = await tokenService.buy(
      filmInfo.dataValues.contractAddress,
      userInfo.dataValues.walletAddress,
      cinemaInfo.dataValues.clusterId + "",
      cinemaInfo.dataValues.id + "",
      roomInfo.dataValues.id + "",
      req.body.seatIndex + "",
      new Date(playTimeInfo.dataValues.timeStart).getTime()
    );
    req.body.txId = txInfo.transactionHash;
    req.body.dateStart = playTimeInfo.dataValues.timeStart;
    const data = await Book.create(req.body);
    //blockchain
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookByFilm = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({
      where: { filmId: id },
      include: [{ model: PlayTime }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBook = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Book.findAll({
      include: [{ model: PlayTime, include: Room }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookByRoom = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({
      where: { roomId: id },
      include: [{ model: PlayTime, include: Room }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookById = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({ where: { id: id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const deteteBook = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.destroy({ where: { id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

module.exports = {
  createBook,
  deteteBook,
  getAllBookByFilm,
  getAllBookByRoom,
  getAllBookById,
  getAllBook,
};
