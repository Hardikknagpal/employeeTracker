import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonActionSheet,
  IonAlert,
  IonToast,
  IonAvatar,
} from "@ionic/react"
import type React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import type { Employee, EmployeeStats } from "../types"
import { Preferences } from "@capacitor/preferences"
import {
  ExpandIcon as Add,
  Mail,
  Phone,
  Briefcase,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchText, setSearchText] = useState("")
  const [filterSegment, setFilterSegment] = useState<string>("all")
  const [stats, setStats] = useState<EmployeeStats>({
    total: 0,
    present: 0,
    absent: 0,
    departments: {},
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const history = useHistory()

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
    calculateStats()
  }, [employees, searchText, filterSegment])

  const fetchEmployees = async () => {
    const { value } = await Preferences.get({ key: "employees" })
    const existing = value ? JSON.parse(value) : []
    setEmployees(existing)
  }

  const filterEmployees = () => {
    let filtered = employees

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    // Filter by presence
    if (filterSegment === "present") {
      filtered = filtered.filter((emp) => emp.isPresent)
    } else if (filterSegment === "absent") {
      filtered = filtered.filter((emp) => !emp.isPresent)
    }

    setFilteredEmployees(filtered)
  }

  const calculateStats = () => {
    const total = employees.length
    const present = employees.filter((emp) => emp.isPresent).length
    const absent = total - present

    const departments: { [key: string]: number } = {}
    employees.forEach((emp) => {
      const dept = emp.department || "Unassigned"
      departments[dept] = (departments[dept] || 0) + 1
    })

    setStats({ total, present, absent, departments })
  }

  const viewDetails = (emp: Employee) => {
    history.push("/employeeDetails", { employee: emp })
  }

  const editEmployee = (emp: Employee) => {
    history.push("/addEmployee", { employee: emp, isEdit: true })
  }

  const handleEmployeeAction = (emp: Employee) => {
    setSelectedEmployee(emp)
    setShowActionSheet(true)
  }

  const deleteEmployee = async () => {
    if (!selectedEmployee) return

    const updatedEmployees = employees.filter((emp) => emp.id !== selectedEmployee.id)
    await Preferences.set({
      key: "employees",
      value: JSON.stringify(updatedEmployees),
    })

    setEmployees(updatedEmployees)
    setToastMessage("Employee deleted successfully")
    setShowToast(true)
    setShowDeleteAlert(false)
    setSelectedEmployee(null)
  }

  const togglePresence = async (emp: Employee) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === emp.id ? { ...employee, isPresent: !employee.isPresent } : employee,
    )

    await Preferences.set({
      key: "employees",
      value: JSON.stringify(updatedEmployees),
    })

    setEmployees(updatedEmployees)
    setToastMessage(`${emp.name} marked as ${emp.isPresent ? "absent" : "present"}`)
    setShowToast(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Employee Management</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Statistics Cards */}
        <IonGrid className="stats-grid">
          <IonRow>
            <IonCol size="4">
              <IonCard className="stat-card total-card">
                <IonCardContent className="stat-content">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard className="stat-card present-card">
                <IonCardContent className="stat-content">
                  <div className="stat-icon">
                    <UserCheck size={24} />
                  </div>
                  <div className="stat-number">{stats.present}</div>
                  <div className="stat-label">Present</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard className="stat-card absent-card">
                <IonCardContent className="stat-content">
                  <div className="stat-icon">
                    <UserX size={24} />
                  </div>
                  <div className="stat-number">{stats.absent}</div>
                  <div className="stat-label">Absent</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Search and Filter */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Search employees..."
          className="custom-searchbar"
        />

        <IonSegment
          value={filterSegment}
          onIonChange={(e) => setFilterSegment(e.detail.value as string)}
          className="filter-segment"
        >
          <IonSegmentButton value="all">
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="present">
            <IonLabel>Present</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="absent">
            <IonLabel>Absent</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Employee Cards */}
        <IonButton
          expand="block"
          onClick={() => history.push("/addEmployee")}
          className="add-button ion-margin-bottom"
          size="large"
        >
          Add New Employee
        </IonButton>

        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <Users size={64} color="#ccc" />
            <h3>No employees found</h3>
            <p>Add your first employee to get started</p>
          </div>
        )}

        {filteredEmployees.map((emp) => (
          <IonCard key={emp.id} button onClick={() => viewDetails(emp)} className="employee-card">
            <IonCardHeader>
              <div className="card-header-content">
                <div className="employee-avatar-section">
                  <IonAvatar className="employee-avatar">
                    <div className="avatar-placeholder">{getInitials(emp.name)}</div>
                  </IonAvatar>
                  <div className="employee-basic-info">
                    <IonCardTitle className="employee-name">{emp.name}</IonCardTitle>
                    <IonCardSubtitle className="employee-role">
                      <Briefcase size={14} />
                      {emp.role}
                    </IonCardSubtitle>
                  </div>
                </div>
                <div className="card-actions">
                  <IonBadge color={emp.isPresent ? "success" : "danger"} className="presence-badge">
                    {emp.isPresent ? "Present" : "Absent"}
                  </IonBadge>
                  <IonButton fill="clear" size="small" onClick={() => handleEmployeeAction(emp)}>
                    <MoreVertical size={18} />
                  </IonButton>
                </div>
              </div>
            </IonCardHeader>

            <IonCardContent className="employee-card-content">
              <div className="employee-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{emp.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{emp.phone}</span>
                </div>
                {emp.department && (
                  <div className="detail-item">
                    <Users size={16} />
                    <span>{emp.department}</span>
                  </div>
                )}
              </div>

              <div className="card-button-group">
                <IonButton size="small" fill="outline" onClick={() => viewDetails(emp)}>
                  <Eye size={16} />
                  View
                </IonButton>
                <IonButton
                  size="small"
                  fill="outline"
                  color={emp.isPresent ? "warning" : "success"}
                  onClick={() => togglePresence(emp)}
                >
                  {emp.isPresent ? "Mark Absent" : "Mark Present"}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/addEmployee")}>
            <Add />
          </IonFabButton>
        </IonFab>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "View Details",
              icon: Eye,
              handler: () => {
                if (selectedEmployee) viewDetails(selectedEmployee)
              },
            },
            {
              text: "Edit Employee",
              icon: Edit,
              handler: () => {
                if (selectedEmployee) editEmployee(selectedEmployee)
              },
            },
            {
              text: "Delete Employee",
              icon: Trash2,
              role: "destructive",
              handler: () => {
                setShowDeleteAlert(true)
              },
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ]}
        />

        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Delete Employee"
          message={`Are you sure you want to delete ${selectedEmployee?.name}?`}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "Delete",
              role: "destructive",
              handler: deleteEmployee,
            },
          ]}
        />

        {/* Toast */}
        <IonToast isOpen={showToast} message={toastMessage} duration={2000} onDidDismiss={() => setShowToast(false)} />
      </IonContent>
    </IonPage>
  )
}

export default EmployeeList
