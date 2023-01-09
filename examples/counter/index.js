import Mvvm from "../../src/index.js"
import app from "./app.js"

const mvvm = new Mvvm(app.target)
mvvm.mount("#app")