const url = "ws://localhost:8080/spring-boot-tutorial/websocket";
const topic = "/topic/greetings";
const app = "/app/hello";

class ChatClient {
    constructor() {
        this.client = new StompJs.Client({ brokerURL: url });
        this.initializeElements();

        if (this.elementsExist) {
            this.setupEventListeners();
            this.setupClientCallbacks();
        }
    }

    initializeElements() {
        this.buttonConnect = document.getElementById("connect");
        this.buttonDisconnect = document.getElementById("disconnect");
        this.buttonSend = document.getElementById("send");
        this.conversationDisplay = document.getElementById("conversation");
        this.greetings = document.getElementById("greetings");
        this.formInput = document.getElementById("form");
        this.nameInput = document.getElementById("name");

        this.elementsExist = this.buttonConnect && this.buttonDisconnect && this.buttonSend &&
            this.conversationDisplay && this.greetings && this.formInput && this.nameInput;

        if (!this.elementsExist) {
            console.error("One or more required elements are missing in the DOM.");
        }
    }

    setupClientCallbacks() {
        this.client.onConnect = (frame) => {
            this.setConnected(true);
            console.log("Connected: " + frame);
            this.client.subscribe(topic, (greeting) => {
                this.showGreeting(JSON.parse(greeting.body).content);
            });
        };

        this.client.onWebSocketError = (error) => {
            console.error("WebSocket Error:", error);
        };

        this.client.onStompError = (frame) => {
            console.error("Broker Error:", frame.headers['message']);
            console.error("Details:", frame.body);
        };

        this.client.onWebSocketClose = () => {
            console.warn("WebSocket connection closed. Attempting to reconnect...");
            setTimeout(() => this.connect(), 3000);
        };
    }

    setupEventListeners() {
        this.buttonConnect.addEventListener("click", (e) => {
            e.preventDefault();
            this.connect();
        });

        this.buttonDisconnect.addEventListener("click", (e) => {
            e.preventDefault();
            this.disconnect();
        });

        this.buttonSend.addEventListener("keydown", (e) => {
            if(e.key === "Enter") {
                e.preventDefault();
                this.sendName();
            }
        });

        this.nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.sendName();
                e.preventDefault();
            }
        })

        this.buttonSend.addEventListener("enter", (e) => {
            e.preventDefault();
            this.sendName();
        })

        this.formInput.addEventListener("submit", (e) => e.preventDefault());
    }

    setConnected(connected) {
        if (!this.elementsExist) return;

        this.buttonConnect.disabled = connected;
        this.buttonDisconnect.disabled = !connected;
        this.conversationDisplay.style.display = connected ? "block" : "none";
        if (!connected) this.greetings.innerHTML = "";
    }

    connect() {
        console.log("Attempting to connect to WebSocket...");
        try {
            this.client.activate();
        } catch (error) {
            console.error("Failed to connect:", error);
        }
    }

    disconnect() {
        if (this.client.connected) {
            this.client.deactivate();
        }
        this.setConnected(false);
    }

    sendName() {
        if (!this.client.connected) {
            console.warn("Cannot send message: WebSocket is not connected.");
            return;
        }
        if (this.nameInput.value.trim()) {
            // console.log("Name " + this.nameInput.value);
            this.client.publish({
                destination: "/app/hello",
                body: JSON.stringify({ content: this.nameInput.value.trim() }),
            });

            this.nameInput.value = ""; // Clear input after sending
        }
    }

    showGreeting(message) {
        this.greetings.innerHTML += `<tr><td>${message}</td></tr>`;
    }
}

window.onload = () => {
    const chat = new ChatClient();
    chat.setConnected(false);
};
