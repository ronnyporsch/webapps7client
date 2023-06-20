/**
 * @fileOverview  The model class Book with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @copyright Copyright 2020-2022 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes,
 * Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";

/**
 * Constructor function for the class Book
 * @constructor
 * @param {{isbn: string, title: string, year: number}} slots - Object creation slots.
 */
class Book {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({isbn, title, year}) {
    this.isbn = isbn;
    this.title = title;
    this.year = year;
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "books"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Book.add = async function (slots) {
  const booksCollRef = fsColl( fsDb, "books"),
    bookDocRef = fsDoc (booksCollRef, slots.isbn);
  slots.year = parseInt( slots.year);  // convert from string to integer
  try {
    await setDoc( bookDocRef, slots);
    console.log(`Book record ${slots.isbn} created.`);
  } catch( e) {
    console.error(`Error when adding book record: ${e}`);
  }
};
/**
 * Load a book record from Firestore
 * @param isbn: {object}
 * @returns {Promise<*>} bookRecord: {array}
 */
Book.retrieve = async function (isbn) {
  let bookDocSn = null;
  try {
    const bookDocRef = fsDoc( fsDb, "books", isbn);
    bookDocSn = await getDoc( bookDocRef);
  } catch( e) {
    console.error(`Error when retrieving book record: ${e}`);
    return null;
  }
  const bookRec = bookDocSn.data();
  return bookRec;
};
/**
 * Load all book records from Firestore
 * @returns {Promise<*>} bookRecords: {array}
 */
Book.retrieveAll = async function () {
  let booksQrySn = null;
  try {
    const booksCollRef = fsColl( fsDb, "books");
    booksQrySn = await getDocs( booksCollRef);
  } catch( e) {
    console.error(`Error when retrieving book records: ${e}`);
    return null;
  }
  const bookDocs = booksQrySn.docs,
    bookRecs = bookDocs.map( d => d.data());
  console.log(`${bookRecs.length} book records retrieved.`);
  return bookRecs;
};
/**
 * Update a Firestore document in the Firestore collection "books"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Book.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date book record
  const bookRec = await Book.retrieve( slots.isbn);
  // convert from string to integer
  if (slots.year) slots.year = parseInt( slots.year);
  // update only those slots that have changed
  if (bookRec.title !== slots.title) updSlots.title = slots.title;
  if (bookRec.year !== slots.year) updSlots.year = slots.year;
  if (Object.keys( updSlots).length > 0) {
    try {
      const bookDocRef = fsDoc( fsDb, "books", slots.isbn);
      await updateDoc( bookDocRef, updSlots);
      console.log(`Book record ${slots.isbn} modified.`);
    } catch( e) {
      console.error(`Error when updating book record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "books"
 * @param isbn: {string}
 * @returns {Promise<void>}
 */
Book.destroy = async function (isbn) {
  try {
    await deleteDoc( fsDoc( fsDb, "books", isbn));
    console.log(`Book record ${isbn} deleted.`);
  } catch( e) {
    console.error(`Error when deleting book record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Book.generateTestData = async function () {
  let bookRecs = [
    {
      isbn: "006251587X",
      title: "Weaving the Web",
      year: 2000},
    {
      isbn: "0465026567",
      title: "Gödel, Escher, Bach",
      year: 1999
    },
    {
      isbn: "0465030793",
      title: "I Am A Strange Loop",
      year: 2008
    }
  ];
  // save all book record/documents
  await Promise.all( bookRecs.map( d => Book.add( d)));
  console.log(`${Object.keys( bookRecs).length} book records saved.`);
};
/**
 * Clear database
 */
Book.clearData = async function () {
  if (confirm("Do you really want to delete all book records?")) {
    // retrieve all book documents from Firestore
    const bookRecs = await Book.retrieveAll();
    // delete all documents
    await Promise.all( bookRecs.map( d => Book.destroy( d.isbn)));
    // ... and then report that they have been deleted
    console.log(`${Object.values( bookRecs).length} book records deleted.`);
  }
};

export default Book;
