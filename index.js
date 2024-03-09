import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const API_URL = "https://api.coincap.io/v2/assets";
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "" });
});

app.post("/post-crypto", async (req, res) => {
  try {
    const userInput = req.body.tokenName;
    const response = await axios.get(API_URL + "/" + userInput);
    const priceUsd = parseFloat(response.data.data.priceUsd);
    const cryptoPrices = {
      name: response.data.data.name,
      priceUsd: isNaN(priceUsd) ? "N/A" : priceUsd.toFixed(2),
    };
    res.render("cryptoPrices.ejs", { prices: [cryptoPrices] }); // Pass prices as an array
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error.message);
    res
      .status(500)
      .send("Error fetching cryptocurrency data. Please try again later.");
  }
});

app.listen(port, (req, res) => {
  console.log("Sever is running on server " + port);
});
