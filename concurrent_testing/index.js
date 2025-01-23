import axios from "axios";

const url1 = "http://localhost:80/api/submit"; // Replace with your API URL
const url2 =
  "http://localhost:5000/api/status?jobId=5a3475b7-9c71-491e-adc0-4f9365c24218";
const payload = {
  count: 0,
  visits: [],
};

for (let i = 0; i < 200; i++) {
  payload.visits.push({
    store_id: "S01408764",
    image_url: ["https://www.gstatic.com/webp/galsafessdfsfslery/3.jpg"],
  });
}

payload.count = 200;

// Function to send a POST request
const sendRequest = async () => {
  try {
    const response = await axios.post(url1, payload);
    console.log({ data: response.data });

    console.log(`Response: ${response.status}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

const getRequest = async () => {
  try {
    const response = await axios.get(url2);
    console.log({ data: response.data });

    console.log(`Response: ${response.status}`);
  } catch (error) {
    console.error(error?.message);
  }
};

// Send 1000 concurrent requests
const sendConcurrentRequests = async () => {
  const requests = Array(10000)
    .fill(null)
    .map(() => sendRequest());
  await Promise.all(requests);
  console.log("All requests completed");
};

// Start the test
sendConcurrentRequests();
