import { sentMessageNotice, waitingForReadingNotice, readMessageNotice } from "./systemMessages.js";

const carEventsContainer = document.querySelector("#radio-btns");
const submitBtn = document.querySelector("#submit");
const sectionSendMsg = document.querySelector("#send-msg");
const modalContainer = document.querySelector(".modal-container");
let carEventList = [];
let notificationId = 0;
let timeoutId = 0;

buildEventList();

async function buildEventList() {
    const fetchUrl = "https://car-id.ru/api/report/get_all_reasons";

    try {
        let response = await fetch(fetchUrl);
        if (response.ok) {
            carEventList = [...(await response.json())];

            carEventsContainer.innerHTML = carEventList.map((carEvent) => createCarEventRadioBtn(carEvent)).join("");
            submitBtn.removeAttribute("disabled", "");
            submitBtn.addEventListener("click", (event) => readMsg(event), false);
        } else {
            showError(response.status);
        }
    } catch (err) {
        showError(err);
    }
}

function createCarEventRadioBtn(carEvent) {
    return `<label class="custom-radio">${carEvent.description}<input type="radio" name="carEvent" id=${carEvent.id} /></label>`;
}

function readMsg(event) {
    event.preventDefault();
    const userChoice = document.querySelector("input:checked");
    if (userChoice === undefined || userChoice === null) return;
    carEventList.map((event) => (+event.id === +userChoice.id ? sendMsg(event.id) : false));
}

async function sendMsg(eventId) {
    // let windowLocationPathname = window.location.pathname;
    const windowLocationPathname = "/qr/74b82e70-c612-4b7c-995a-e3bb88d3ad4a";
    const fetchUrl = "https://car-id.ru/api/report/send";

    let body = {
        qr_id: windowLocationPathname.slice(4),
        reason_id: eventId,
    };

    try {
        let response = await fetch(fetchUrl, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            let answer = await response.json();
            if (answer.error_code === "SEND_TIMEOUT") {
                showError(answer.error_message, "Чуть помедленнее");
            } else {
                notificationId = answer.notification_id;
                openModal(sentMessageNotice);
                checkMsgStatus();
            }
        } else {
            showError(response.status);
        }
    } catch (err) {
        showError(err);
    }
}

async function checkMsgStatus() {
    const fetchUrl = `https://car-id.ru/api/notification/${notificationId}/status`;

    try {
        let fetchAnswer = await fetch(fetchUrl);
        if (fetchAnswer.ok) {
            let msgStatus = await fetchAnswer.json();

            if (msgStatus.status !== "UNREAD" && msgStatus.status !== "READ") {
                showError(msgStatus.status);
            }
            if (msgStatus.status === "UNREAD") {
                sectionSendMsg.innerHTML = waitingForReadingNotice;
                timeoutId = setTimeout(() => checkMsgStatus(), 5000);
            }
            if (msgStatus.status === "READ") {
                clearTimeout(timeoutId);
                sectionSendMsg.innerHTML = readMessageNotice;
            }
        } else {
            showError(response.status);
        }
    } catch (err) {
        showError(err);
    }
}

function showError(err, title) {
    openModal(`
        <div class="modal">
            <div class="container">
                <h2>${title ? title : "Сообщение об ошибке"}</h2>
                <p>${err}</p>
                ${title === undefined ? "<p>Попробуйте обновить страницу и отправить завпрос позднее.</p>" : ""}
                <button id="close-btn" class="primary-btn">Понятно</button>
            </div>
        </div>
    `);
}

function openModal(msgHtml) {
    modalContainer.innerHTML = msgHtml;
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", (event) => closeModal(event));
}

function closeModal(event) {
    event.preventDefault();
    modalContainer.innerHTML = "";
    window.scrollTo(0, 0);
}
