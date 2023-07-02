/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";

handleAuthentication();

const eventRecords = await Event.retrieveAll();

const formEl = document.forms["Event"],
    updateButton = formEl["commit"],
    selectEventEl = formEl["selectEvent"];


for (const eventRec of eventRecords){
    const optionEl = document.createElement("option");
    optionEl.text = eventRec.name;
    optionEl.value = eventRec.eventID;
    selectEventEl.add(optionEl, null);
}

selectEventEl.addEventListener("change", async function (){
    const eventID = selectEventEl.value;

    if (eventID) {
        const eventRec = await Event.retrieve(eventID);
        formEl["eventID"].value = eventRec.eventID;
        formEl["name"].value = eventRec.name;
        formEl["style"].value = eventRec.style;
        formEl["date"].value = eventRec.date;
        formEl["description"].value = eventRec.description;
        formEl["maxParticipants"].value = eventRec.maxParticipants;
    } else {
        formEl.reset();
    }
});

updateButton.addEventListener("click", async function (){
    const slots = {
        eventID: formEl["eventID"].value,
        name: formEl["name"].value,
        style: formEl["style"].value,
        date: formEl["date"].value,
        description:  formEl["description"].value,
        maxParticipants:  formEl["maxParticipants"].value
    },
        eventIdRef = selectEventEl.value;
    
    if(!eventIdRef) return;
    await Event.update( slots);

   selectEventEl.options[selectEventEl.selectedIndex].text = slots.title;
   formEl.reset();
});