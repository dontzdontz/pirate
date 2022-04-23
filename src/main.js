import { createApp } from "vue";
import App from "./App.vue";

// const csvFilePath = "./src/plugins/questions.csv";
// const csv = require("csvtojson");

// const trans = async () => {
//   return csv()
//     .fromFile(csvFilePath)
//     .then((jsonObj) => {
//       return jsonObj;
//     })
//     .catch((err) => console.log(err));
// };

// const json = await trans();
// console.log(json);

const app = createApp(App);

app.mount("#app");
