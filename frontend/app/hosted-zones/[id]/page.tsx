"use client";

import { useEffect, useState } from "react";

interface DNSRecord {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
  created_at: string;
}

interface HostedZone {
  id: number;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";
const RECORDS_PER_PAGE = 5;

const DNS_RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

export default function HostedZoneDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<DNSRecord | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("300");
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("route53_session");

    if (!session) {
      window.location.href = "/login";
      return;
    }

    params.then((value) => {
      const id = Number(value.id);
      setZoneId(id);
    });
  }, [params]);

  useEffect(() => {
    if (zoneId !== null) {
      loadData();
    }
  }, [zoneId]);

  async function loadData() {
    if (zoneId === null) {
      return;
    }

    try {
      setLoading(true);

      const [zoneResponse, recordsResponse] =
        await Promise.all([
          fetch(`${API_URL}/hosted-zones/${zoneId}`),
          fetch(
            `${API_URL}/hosted-zones/${zoneId}/records`
          ),
        ]);

      if (!zoneResponse.ok || !recordsResponse.ok) {
        throw new Error("Failed to load data");
      }

      const zoneData = await zoneResponse.json();
      const recordsData = await recordsResponse.json();

      setZone(zoneData);
      setRecords(recordsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function showNotification(message: string) {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  }

  function openCreateModal() {
    setEditingRecord(null);
    setName("");
    setType("A");
    setValue("");
    setTtl("300");
    setShowModal(true);
  }

  function openEditModal(record: DNSRecord) {
    setEditingRecord(record);
    setName(record.name);
    setType(record.type);
    setValue(record.value);
    setTtl(String(record.ttl));
    setShowModal(true);
  }

  function getValuePlaceholder() {
    switch (type) {
      case "A":
        return "192.168.1.10";

      case "AAAA":
        return "2001:db8::1";

      case "CNAME":
        return "target.example.com";

      case "TXT":
        return '"v=spf1 include:example.com ~all"';

      case "MX":
        return "10 mail.example.com";

      case "NS":
        return "ns1.example.com";

      case "PTR":
        return "host.example.com";

      case "SRV":
        return "10 5 443 service.example.com";

      case "CAA":
        return '0 issue "letsencrypt.org"';

      default:
        return "Enter record value";
    }
  }

  async function handleSave() {
    if (zoneId === null) {
      return;
    }

    if (!name.trim() || !value.trim()) {
      alert("Please fill all required fields");
      return;
    }

    const normalizedType = type.toUpperCase();
    const ttlNumber = Number(ttl);

    if (!DNS_RECORD_TYPES.includes(normalizedType)) {
      alert("Please select a valid DNS record type");
      return;
    }

    if (
      !Number.isInteger(ttlNumber) ||
      ttlNumber < 1
    ) {
      alert("TTL must be a whole number greater than 0");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        type: normalizedType,
        value: value.trim(),
        ttl: ttlNumber,
      };

      if (editingRecord) {
        const response = await fetch(
          `${API_URL}/hosted-zones/${zoneId}/records/${editingRecord.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update record");
        }

        const updatedRecord = await response.json();

        setRecords((currentRecords) =>
          currentRecords.map((record) =>
            record.id === editingRecord.id
              ? updatedRecord
              : record
          )
        );

        showNotification(
          "DNS record updated successfully"
        );
      } else {
        const response = await fetch(
          `${API_URL}/hosted-zones/${zoneId}/records`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create record");
        }

        const newRecord = await response.json();

        setRecords((currentRecords) => [
          ...currentRecords,
          newRecord,
        ]);

        showNotification(
          "DNS record created successfully"
        );
      }

      setShowModal(false);
      setEditingRecord(null);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("Failed to save DNS record");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(recordId: number) {
    if (zoneId === null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this DNS record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/hosted-zones/${zoneId}/records/${recordId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record.id !== recordId
        )
      );

      showNotification(
        "DNS record deleted successfully"
      );

      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("Failed to delete DNS record");
    }
  }

  const filteredRecords = records.filter((record) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      record.name.toLowerCase().includes(searchText) ||
      record.type.toLowerCase().includes(searchText) ||
      record.value.toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "ALL" ||
      record.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRecords.length / RECORDS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) * RECORDS_PER_PAGE;

  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + RECORDS_PER_PAGE
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleTypeChange(value: string) {
    setTypeFilter(value);
    setCurrentPage(1);
  }

  function handleLogout() {
    localStorage.removeItem("route53_session");
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="loading">
            Loading hosted zone...
          </div>
        </main>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="empty-state">
            Hosted zone not found.
          </div>
        </main>
      </div>
    );
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
              placeholder="Search DNS records"
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
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          <div className="breadcrumb">
            Route 53 / Hosted zones / {zone.name}
          </div>

          <div className="page-header">
            <div>
              <h1>{zone.name}</h1>

              <p className="page-description">
                Manage DNS records for this hosted zone.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openCreateModal}
            >
              Create record
            </button>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h2>DNS records</h2>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  className="table-search"
                  type="text"
                  placeholder="Search records"
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(e.target.value)
                  }
                />

                <select
                  className="table-search"
                  value={typeFilter}
                  onChange={(e) =>
                    handleTypeChange(e.target.value)
                  }
                >
                  <option value="ALL">
                    All types
                  </option>

                  {DNS_RECORD_TYPES.map(
                    (recordType) => (
                      <option
                        key={recordType}
                        value={recordType}
                      >
                        {recordType}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {paginatedRecords.length === 0 ? (
              <div className="empty-state">
                No DNS records found.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>TTL</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.type}</td>
                      <td>{record.value}</td>
                      <td>{record.ttl}</td>

                      <td>
                        {new Date(
                          record.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          className="secondary-button"
                          onClick={() =>
                            openEditModal(record)
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
                            handleDelete(record.id)
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

            {filteredRecords.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
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
                    startIndex + RECORDS_PER_PAGE,
                    filteredRecords.length
                  )}{" "}
                  of {filteredRecords.length}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    className="secondary-button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                  >
                    Previous
                  </button>

                  <span
                    style={{
                      fontSize: "14px",
                      padding: "8px",
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="secondary-button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
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
                {editingRecord
                  ? "Edit DNS record"
                  : "Create DNS record"}
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
              <label>Name</label>

              <input
                type="text"
                placeholder="www.example.com"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <label>Type</label>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setValue("");
                }}
              >
                {DNS_RECORD_TYPES.map(
                  (recordType) => (
                    <option
                      key={recordType}
                      value={recordType}
                    >
                      {recordType}
                    </option>
                  )
                )}
              </select>

              <label>Value</label>

              <textarea
                placeholder={getValuePlaceholder()}
                value={value}
                onChange={(e) =>
                  setValue(e.target.value)
                }
              />

              <label>TTL</label>

              <input
                type="number"
                min="1"
                step="1"
                value={ttl}
                onChange={(e) =>
                  setTtl(e.target.value)
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
                  : editingRecord
                  ? "Save changes"
                  : "Create record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}