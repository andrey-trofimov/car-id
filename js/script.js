import { msgList } from "./msgList.js";
import { msgItem } from "./msgItem.js";
import { modal } from "./modal.js";

const radioBtns = document.querySelector("#radio-btns");
const submitBtn = document.querySelector("#submit");
const sectionSendMsg = document.querySelector("#send-msg");
const modalContainer = document.querySelector(".modal-container");

submitBtn.addEventListener("click", (event) => readMsg(event), false);

radioBtns.innerHTML = msgList.map((msg) => msgItem(msg)).join("");

function readMsg(event) {
    event.preventDefault();
    const userChoice = document.querySelector("input:checked");
    if (userChoice === undefined || userChoice === null) return;
    msgList.map((msg) => (msg.id === userChoice.id ? sendMsg(msg.title) : false));
}

function sendMsg(msg) {
    modalContainer.innerHTML = modal;

    const buyBtn = document.querySelector("#buy-btn");
    buyBtn.addEventListener("click", (event) => closeModal(event));

    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", (event) => closeModal(event));
}

function closeModal(event) {
    event.preventDefault();
    sectionSendMsg.innerHTML = "";
    modalContainer.innerHTML = "";
    window.scrollTo(0,0);
}
