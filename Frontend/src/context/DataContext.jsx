import React, { createContext, useContext, useState, useEffect } from "react";
import { getInitialData, dummyThreats, dummyIncidents, dummyAlerts, dummyUsers, dummyVulnerabilities } from "../data/dummy";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [threats, setThreats] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);

  useEffect(() => {
    setThreats(getInitialData("cs_threats", dummyThreats));
    setIncidents(getInitialData("cs_incidents", dummyIncidents));
    setAlerts(getInitialData("cs_alerts", dummyAlerts));
    setUsers(getInitialData("cs_users", dummyUsers));
    setVulnerabilities(getInitialData("cs_vulnerabilities", dummyVulnerabilities));
  }, []);

  // Helpers to update local storage and state
  const addThreat = (threat) => {
    const updated = [threat, ...threats];
    setThreats(updated);
    localStorage.setItem("cs_threats", JSON.stringify(updated));
  };

  const addIncident = (incident) => {
    const updated = [incident, ...incidents];
    setIncidents(updated);
    localStorage.setItem("cs_incidents", JSON.stringify(updated));
  };

  const updateIncident = (id, updates) => {
    const updated = incidents.map(i => i.id === id ? { ...i, ...updates } : i);
    setIncidents(updated);
    localStorage.setItem("cs_incidents", JSON.stringify(updated));
  };

  const addAlert = (alert) => {
    const updated = [alert, ...alerts];
    setAlerts(updated);
    localStorage.setItem("cs_alerts", JSON.stringify(updated));
  };

  const markAlertAsRead = (id) => {
    const updated = alerts.map(a => a.id === id ? { ...a, isRead: true } : a);
    setAlerts(updated);
    localStorage.setItem("cs_alerts", JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{
      threats, addThreat,
      incidents, addIncident, updateIncident,
      alerts, addAlert, markAlertAsRead,
      users,
      vulnerabilities
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
