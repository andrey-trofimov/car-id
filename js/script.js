import { sentMessageNotice } from "./systemMessages.js";

const carEventsContainer = document.querySelector("#radio-btns");
const submitBtn = document.querySelector("#submit");
const modalContainer = document.querySelector(".modal-container");
let carEventList = [];
let notificationId = 0;

buildEventList();

async function buildEventList() {
    if (window.location.pathname.includes("notification")) return;
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

            if (answer.notification_id) {
                notificationId = answer.notification_id;
                localStorage.setItem("notification_id", `${notificationId}`);
                openModal(sentMessageNotice, checkMsgStatus);
            } else if (answer.error_code === "SEND_TIMEOUT") {
                showError(answer.error_message, "Чуть помедленнее");
            } else if (answer.error_code) {
                showError(answer.error_message, "Упс... Уже исправляем");
            } else showError(answer);
        } else {
            showError(response.status);
        }
    } catch (err) {
        showError(err);
    }
}

function checkMsgStatus(event) {
    closeModal(event);
    const pathnamePrefix = window.location.host === 'andrey-trofimov.github.io' ? '/car-id' : ''; 
    window.location.href = `${pathnamePrefix}/notification/737/`;
    // window.location.href = `/notification/${notificationId}/`;
}

export function showError(err, title) {
    openModal(
        `
        <div class="modal">
            <div class="container">
                <h2>${title ? title : "Сообщение об ошибке"}</h2>
                <p>${err}</p>
                ${title === undefined ? "<p>Попробуйте обновить страницу и отправить завпрос позднее.</p>" : ""}
                <button id="close-btn" class="primary-btn">Понятно</button>
            </div>
        </div>
    `,
        closeModal
    );
}

export function openModal(msgHtml, cb) {
    modalContainer.innerHTML = msgHtml;
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", (event) => cb(event));
}

export function closeModal(event) {
    event.preventDefault();
    modalContainer.innerHTML = "";
    window.scrollTo(0, 0);
}
