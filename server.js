const WebSocket = require('ws');

// Set the target date for the countdown
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 14);

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Store the active WebSocket connections
const clients = new Set();

// Broadcast function to send updates to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Update the countdown every second
setInterval(() => {
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;

  // Calculate the number of weeks, days, hours, minutes, and seconds remaining
  const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Construct the countdown data
  const countdownData = {
    weeks,
    days,
    hours,
    minutes,
    seconds
  };

  // Convert the data to JSON
  const jsonData = JSON.stringify(countdownData);

  // Broadcast the countdown data to all connected clients
  broadcast(jsonData);
}, 1000);

// Handle new WebSocket connections
wss.on('connection', ws => {
  // Add the new connection to the set of clients
  clients.add(ws);

  // Send the initial countdown data to the new client
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;
  const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  const countdownData = { weeks, days, hours, minutes, seconds };
  const jsonData = JSON.stringify(countdownData);
  ws.send(jsonData);

  // Handle WebSocket close event
  ws.on('close', () => {
    // Remove the closed connection from the set of clients
    clients.delete(ws);
  });
});

console.log('WebSocket server running on port 8080');
