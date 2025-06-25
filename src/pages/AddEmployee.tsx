import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBackButton,
  IonButtons,
} from "@ionic/react"
import type React from "react"
import { useState } from "react"
import { useHistory } from "react-router"
import type { Employee } from "../types"
import { Preferences } from "@capacitor/preferences"

const AddEmployee: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [isPresent, setIsPresent] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isValidPhone = (phone: string) =>
  /^[6-9]\d{9}$/.test(phone)

  const history = useHistory()

  const handleSave = async () => {
    if (!name || !email || !phone || !role) {
      alert("Please fill all fields")
      return
    }

    if(!isValidEmail(email)){
      alert("Please enter a valid email")
      return
    }

    if(!isValidPhone(phone)){
      alert("Please enter a valid phone number")
      return
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role,
      isPresent,
    }

    // Get Existing Employees:
    const { value } = await Preferences.get({ key: "employees" })
    const existing = value ? JSON.parse(value) : []

    const updated = [...existing, newEmployee]

    await Preferences.set({
      key: "employees",
      value: JSON.stringify(updated),
    })

    setShowToast(true)

    setTimeout(() => history.push("/"), 1000)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Add Employee</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="form-card">
          <IonCardHeader>
            <IonCardTitle>Employee Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
           <IonItem className="form-item ion-margin-bottom">
  <IonLabel position="floating">Name</IonLabel>
  <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} placeholder="Enter full name" />
</IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                type="email"
                placeholder="Enter email address"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating">Phone</IonLabel>
              <IonInput
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value!)}
                type="tel"
                placeholder="Enter phone number"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating">Role</IonLabel>
              <IonInput value={role} onIonChange={(e) => setRole(e.detail.value!)} placeholder="Enter job role" />
            </IonItem>

            <IonItem className="form-item toggle-item">
              <IonLabel>
                <h3>Is Present</h3>
                <p>Mark if employee is currently present</p>
              </IonLabel>
              <IonToggle checked={isPresent} onIonChange={(e) => setIsPresent(e.detail.checked)} color="success" />
            </IonItem>

            <IonButton expand="block" onClick={handleSave} className="save-button ion-margin-top" size="large">
              Save Employee
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          message="Employee Saved Successfully!"
          duration={1500}
          onDidDismiss={() => setShowToast(false)}
          color="success"
        />
      </IonContent>
    </IonPage>
  )
}

export default AddEmployee
