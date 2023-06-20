/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Book from "../m/Book.mjs";

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Book"],
  createButton = formEl["commit"];

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
  const slots = {
    isbn: formEl["isbn"].value,
    title: formEl["title"].value,
    year: formEl["year"].value
  };
  await Book.add( slots);
  formEl.reset();
});
