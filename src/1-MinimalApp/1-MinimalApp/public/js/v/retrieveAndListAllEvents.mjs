/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";

const eventRecords = await Event.retrieveAll();

const tableBodyEl = document.querySelector("table#events>tbody");

for (const eventRec of eventRecords) {
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = eventRec.eventID;
    row.insertCell().textContent = eventRec.name;
    row.insertCell().textContent = eventRec.style;
    row.insertCell().textContent = eventRec.date;
    row.insertCell().textContent = eventRec.description;
    row.insertCell().textContent = eventRec.maxParticipants;
}