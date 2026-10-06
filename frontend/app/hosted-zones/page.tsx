"use client";

import { useEffect, useState } from "react";

import {
  getHostedZones,
  createHostedZone,
  updateHostedZone,
  deleteHostedZone,
} from "../../services/api";

interface HostedZone {
  id: number;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
}

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] =
    useState<HostedZone | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("PUBLIC");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const zonesPerPage = 5;

  useEffect(() => {
    const session = localStorage.getItem("route53_session");

    if (!session) {
      window.location.href = "/login";
      return;
    }

    loadZones();
  }, []);

  function showNotification(message: string) {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  }

  async function loadZones() {
    try {
      const data = await getHostedZones();
      setZones(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingZone(null);
    setName("");
    setType("PUBLIC");
    setDescription("");
    setShowModal(true);
  }

  function openEditModal(zone: HostedZone) {
    setEditingZone(zone);
    setName(zone.name);
    setType(zone.type);
    setDescription(zone.description || "");
    setShowModal(true);
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Please enter a domain name");
      return;
    }

    try {
      setSaving(true);

      if (editingZone) {
        const updatedZone = await updateHostedZone(
          editingZone.id,
          {
            name: name.trim(),
            type,
            description: description.trim(),
          }
        );

        setZones((currentZones) =>
          currentZones.map((zone) =>
            zone.id === editingZone.id
              ? updatedZone
              : zone
          )
        );

        showNotification(
          "Hosted zone updated successfully"
        );
      } else {
        const newZone = await createHostedZone({
          name: name.trim(),
          type,
          description: description.trim(),
        });

        setZones((currentZones) => [
          ...currentZones,
          newZone,
        ]);

        showNotification(
          "Hosted zone created successfully"
        );
      }

      setShowModal(false);
      setEditingZone(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save hosted zone");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hosted zone?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteHostedZone(id);

      setZones((currentZones) =>
        currentZones.filter((zone) => zone.id !== id)
      );

      showNotification(
        "Hosted zone deleted successfully"
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete hosted zone");
    }
  }

  const filteredZones = zones.filter((zone) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      zone.name.toLowerCase().includes(searchText) ||
      zone.type.toLowerCase().includes(searchText) ||
      (zone.description || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const totalPages = Math.ceil(
    filteredZones.length / zonesPerPage
  );

  const startIndex =
    (currentPage - 1) * zonesPerPage;

  const paginatedZones = filteredZones.slice(
    startIndex,
    startIndex + zonesPerPage
  );

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="aws-logo">aws</div>

        <div className="service-title">
          <span>Route 53</span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item" href="/">
            Dashboard
          </a>

          <a
            className="nav-item active"
            href="/hosted-zones"
          >
            Hosted zones
          </a>

          <a
            className="nav-item"
            href="/traffic-policies"
          >
            Traffic policies
          </a>

          <a
            className="nav-item"
            href="/health-checks"
          >
            Health checks
          </a>

          <a className="nav-item" href="/resolver">
            Resolver
          </a>

          <a className="nav-item" href="/profiles">
            Profiles
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search hosted zones"
              value={search}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
            />
          </div>

          <div className="header-right">
            <span>Region: Global</span>
            <span>👤 admin@example.com</span>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                localStorage.removeItem(
                  "route53_session"
                );
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          <div className="breadcrumb">
            Route 53 / Hosted zones
          </div>

          <div className="page-header">
            <div>
              <h1>Hosted zones</h1>

              <p className="page-description">
                A hosted zone is a container for records that
                define how you want to route traffic for a
                domain.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openCreateModal}
            >
              Create hosted zone
            </button>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h2>Hosted zones</h2>

              <input
                className="table-search"
                type="text"
                placeholder="Search hosted zones"
                value={search}
                onChange={(e) =>
                  handleSearchChange(e.target.value)
                }
              />
            </div>

            {loading ? (
              <div className="loading">
                Loading hosted zones...
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Domain name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedZones.map((zone) => (
                    <tr key={zone.id}>
                      <td>
                        <a
                          href={`/hosted-zones/${zone.id}`}
                        >
                          {zone.name}
                        </a>
                      </td>

                      <td>{zone.type}</td>

                      <td>
                        {zone.description || "-"}
                      </td>

                      <td>
                        {new Date(
                          zone.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          className="secondary-button"
                          onClick={() =>
                            openEditModal(zone)
                          }
                          style={{
                            marginRight: "8px",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="secondary-button"
                          onClick={() =>
                            handleDelete(zone.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading &&
              filteredZones.length === 0 && (
                <div className="empty-state">
                  No hosted zones found.
                </div>
              )}

            {!loading &&
              filteredZones.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderTop: "1px solid #eaeded",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#5f6b7a",
                    }}
                  >
                    Showing {startIndex + 1}-
                    {Math.min(
                      startIndex + zonesPerPage,
                      filteredZones.length
                    )}{" "}
                    of {filteredZones.length}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="secondary-button"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    <span
                      style={{
                        fontSize: "14px",
                        padding: "0 8px",
                      }}
                    >
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      className="secondary-button"
                      onClick={handleNextPage}
                      disabled={
                        currentPage === totalPages
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "30px",
            background: "#1d8102",
            color: "white",
            padding: "14px 20px",
            borderRadius: "4px",
            boxShadow:
              "0 3px 10px rgba(0,0,0,0.25)",
            zIndex: 2000,
            fontSize: "14px",
          }}
        >
          ✓ {notification}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingZone
                  ? "Edit hosted zone"
                  : "Create hosted zone"}
              </h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label>Domain name</label>

              <input
                type="text"
                placeholder="example.com"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <label>Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="PUBLIC">
                  Public hosted zone
                </option>

                <option value="PRIVATE">
                  Private hosted zone
                </option>
              </select>

              <label>Description</label>

              <textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingZone
                  ? "Save changes"
                  : "Create hosted zone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}