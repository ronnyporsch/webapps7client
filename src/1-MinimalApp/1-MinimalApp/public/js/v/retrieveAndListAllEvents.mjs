/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";
import { showProgressBar, hideProgressBar } from "../../lib/util.mjs";

handleAuthentication();

const selectOrderEl = document.querySelector("main>div>div>label>select");
const tableBodyEl = document.querySelector("table#books>tbody"),
  progressEl = document.querySelector("progress");

 await Event.retrieveAndListAllEvents();

 selectOrderEl.addEventListener("change", async function (e) {
    // invoke list with order parameter selected
    await retrieveAndListAllEvents( e.target.value);
  });
  

  async function retrieveAndListAllEvents( order) {
    tableBodyEl.innerHTML = "";
    showProgressBar( progressEl);
    const eventRecords = await Event.retrieveAll( order);
    for (const eventRec of eventRecords) {
      let row = tableBodyEl.insertRow();
      row.insertCell(-1).textContent = eventRec.eventID;
      row.insertCell(-1).textContent = eventRec.name;
      row.insertCell(-1).textContent = eventRec.style;
      row.insertCell(-1).textContent = eventRec.date;
      row.insertCell(-1).textContent = eventRec.description;
      row.insertCell(-1).textContent = eventRec.maxParticipants;
    }
    hideProgressBar( progressEl);
  }