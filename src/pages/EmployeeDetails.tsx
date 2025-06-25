import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonBackButton,
  IonButtons,
} from "@ionic/react"
import type React from "react"
import { useLocation } from "react-router"
import type { Employee } from "../types"

const EmployeeDetails: React.FC = () => {
  const location = useLocation<{ employee: Employee }>()
  const employee = location.state?.employee

  if (!employee) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Employee Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="empty-state">
            <h3>No employee data available.</h3>
            <p>Please go back and select an employee</p>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Employee Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="details-card">
          <IonCardHeader>
            <div className="details-header">
              <div>
                <IonCardTitle className="employee-name">{employee.name}</IonCardTitle>
                <p className="employee-role">{employee.role}</p>
              </div>
              <IonBadge color={employee.isPresent ? "success" : "danger"} className="status-badge-large">
                {employee.isPresent ? "Present ✅" : "Absent ❌"}
              </IonBadge>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <div className="details-grid">
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{employee.email}</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong>
                <span>{employee.phone}</span>
              </div>
              <div className="detail-row">
                <strong>Role:</strong>
                <span>{employee.role}</span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={employee.isPresent ? "status-present" : "status-absent"}>
                  {employee.isPresent ? "Present ✅" : "Absent ❌"}
                </span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default EmployeeDetails
