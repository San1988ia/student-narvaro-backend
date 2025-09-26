//Service lager för studenter
import * as data from "../data/studentsData.js";

//Hämta alla studenter (med query parametrar)
export const getAll = (opts) => data.findAll(opts);

//Hämta en student med id
export const getById = (id) => data.findById(id);

//Skapa en ny student
export const create = (payload) => data.create(payload);
