import { modal } from "./modal.js";

const carEventsContainer = document.querySelector("#radio-btns");
const submitBtn = document.querySelector("#submit");
const sectionSendMsg = document.querySelector("#send-msg");
const modalContainer = document.querySelector(".modal-container");

let carEventList = [];

submitBtn.addEventListener("click", (event) => readMsg(event), false);

buildEventList();

async function buildEventList() {
    // const fetchUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
    //     "https://car-id.ru/api/report/get_all_reasons"
    // )}`;
    const fetchUrl = "https://car-id.ru/api/report/get_all_reasons";

    try {
        let response = await fetch(fetchUrl);
        if (response.ok) {
            let eventList = await response.json();
            let carEvents = await JSON.parse(eventList.contents);
            carEventList = [...carEvents];

            carEventsContainer.innerHTML = carEventList.map((carEvent) => addCarEventRadioBtn(carEvent)).join("");
            submitBtn.removeAttribute("disabled", "");
            console.log(carEventList);
        } else {
            console.log("Ошибка соединения с сервером: ", response.status);
        }
    } catch (err) {
        console.log("Ошибка соединения с сервером: ", err);
    }
}

function addCarEventRadioBtn(carEvent) {
    return `<label class="custom-radio">${carEvent.description}<input type="radio" name="carEvent" id=${carEvent.id} /></label>`;
}

function readMsg(event) {
    if (carEventsContainer.innerHTML === "") return;
    event.preventDefault();
    const userChoice = document.querySelector("input:checked");
    if (userChoice === undefined || userChoice === null) return;
    carEventList.map((msg) => (+msg.id == +userChoice.id ? sendMsg(msg.id) : false));
}

async function sendMsg(msg) {
    modalContainer.innerHTML = modal;

    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", (event) => closeModal(event));

    console.log(msg);

    const fetchUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://car-id.ru/api/report/get_all_reasons"
    )}`;
    // const fetchUrl = "https://car-id.ru/api/report/get_all_reasons";

    try {
        let response = await fetch(fetchUrl);
        if (response.ok) {
            let eventList = await response.json();
            let carEvents = await JSON.parse(eventList.contents);
            carEventList = [...carEvents];

            carEventsContainer.innerHTML = carEventList.map((carEvent) => addCarEventRadioBtn(carEvent)).join("");
            submitBtn.removeAttribute("disabled", "");
            console.log(carEventList);
        } else {
            console.log("Ошибка соединения с сервером: ", response.status);
        }
    } catch (err) {
        console.log("Ошибка соединения с сервером: ", err);
    }
}

function closeModal(event) {
    event.preventDefault();
    sectionSendMsg.innerHTML = "";
    modalContainer.innerHTML = "";
    window.scrollTo(0, 0);
}
