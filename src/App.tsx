import React from "react"
//import { cosApiUtil } from "./Shared/Api/CosApiUtil";
import AnimatedRoutes from "./components/AnimatedRoutes"
/*
function test() {
  cosApiUtil.getApiUrl().then((data) => console.log(data));
}*/
import * as cu from './Shared/Api/CosApi'
window.cu = cu
function App() {

  return (
    <>
      <AnimatedRoutes />
    </>

  )
}

export default App
