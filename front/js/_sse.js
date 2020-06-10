let eventSource = new EventSource("/_server-sent-events");

eventSource.onerror = function (e) {
  console.log("Событие: error");
  if (this.readyState == EventSource.CONNECTING) {
    console.log(`Переподключение (readyState=${this.readyState})...`);
  } else {
    console.log("Произошла ошибка.");
  }
};

eventSource.onmessage = function (e) {
  const message = e.data;
  console.log("Событие: message, данные: " + message);

  if (message === "reload") {
    location.reload();
  }
};

console.log(`live reload enabled.`);
