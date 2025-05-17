let socket = null;
let reconnectTimeout = null;
let manuallyClosed = false;

const RECONNECT_DELAY_MS = 2000;

const connectWebSocket = (
  onMessage,
  onOpen = null,
  onClose = null,
  onError = null
) => {
  try {
    manuallyClosed = false;
    socket = new WebSocket("wss://echo.websocket.events");

    socket.onopen = () => {
      console.log("WebSocket connected");

      // socket.send("promptStart");
      // socket.send("systemPrompt");
      // socket.send("audioStart");

      if (onOpen) onOpen();
    };

    socket.onmessage = (event) => {
      try {
        if (onMessage) onMessage(event.data);
      } catch (err) {
        console.error("Error handling incoming message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (onError) onError(error);
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected");
      if (onClose) onClose();

      if (!manuallyClosed) {
        console.log(`Reconnecting in ${RECONNECT_DELAY_MS}ms...`);
        reconnectTimeout = setTimeout(() => {
          connectWebSocket(onMessage, onOpen, onClose, onError);
        }, RECONNECT_DELAY_MS);
      }
    };
  } catch (err) {
    console.error("Failed to connect WebSocket:", err);
    if (onError) onError(err);
  }
};

const sendMessage = (message) => {
  try {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.warn("WebSocket not open. Cannot send message.");
    }
  } catch (err) {
    console.error("Error sending message via WebSocket:", err);
  }
};

const closeWebSocket = () => {
  manuallyClosed = true;
  clearTimeout(reconnectTimeout);
  reconnectTimeout = null;

  try {
    if (socket) {
      socket.close();
      socket = null;
    }
  } catch (err) {
    console.error("Error closing WebSocket:", err);
  }
};

export { connectWebSocket, sendMessage, closeWebSocket };
