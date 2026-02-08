import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes?tag=&search=&page=&perPage=
export const getAllNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = Number(page);
    perPage = Number(perPage);
    const skip = (page - 1) * perPage;

    // БАЗОВИЙ ФІЛЬТР — ТІЛЬКИ НОТАТКИ ПОТОЧНОГО КОРИСТУВАЧА
    const filter = {
      userId: req.user._id,
    };

    // фільтр по tag
    if (tag) {
      filter.tag = tag;
    }

    // текстовий пошук (через text index)
    if (search) {
      filter.$text = { $search: search };
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id, // перевірка власника
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id, // прив’язка до користувача
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id, // тільки свої
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: req.user._id, // тільки свої
      },
      req.body,
      { new: true },
    );

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
