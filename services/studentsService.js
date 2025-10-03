//Mellanlager för studenter (kopplar routes till databasen)
import * as data from "../data/studentsData.js";

//Hämta alla studenter (kan filtrera med query)
export const getAll = (opts) => data.findAll(opts);

//Hämta en student via id
export const getById = (id) => data.findById(id);

//Lägg till en ny student
export const create = (payload) => data.create(payload);
