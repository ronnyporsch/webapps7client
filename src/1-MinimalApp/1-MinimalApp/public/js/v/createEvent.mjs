/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */


import Event from "../m/Event.mjs";

const formEl = document.forms["Event"],
  createButton = formEl["commit"];



createButton.addEventListener("click", async function () {
  const slots = {
    eventID: formEl["eventID"].value,
    name: formEl["name"].value,
    style: formEl["style"].value,
    date: formEl["date"].value,
    description: formEl["description"].value,
    maxParticipants: formEl["maxParticipants"].value,
  };
  await Event.add( slots);
  formEl.reset();
});

