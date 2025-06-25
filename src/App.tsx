import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import type React from "react"
import { Redirect, Route } from "react-router"
import EmployeeList from "./pages/EmployeeList" 
import AddEmployee from "./pages/AddEmployee"
import EmployeeDetails from "./pages/EmployeeDetails"

import "@ionic/react/css/core.css"

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={EmployeeList} />
        <Route exact path="/addEmployee" component={AddEmployee} />
        <Route exact path="/employeeDetails" component={EmployeeDetails} />
        <Redirect to="/" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
