import Mvvm from "../../src/index.js"
import app from "./app.js"

const mvvm = new Mvvm(app)
mvvm.mount("#app")