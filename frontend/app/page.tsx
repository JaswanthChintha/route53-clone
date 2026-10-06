"use client";

import { useEffect, useState } from "react";
import { getHostedZones } from "../services/api";

interface HostedZone {
  id: number;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
}

export default function Home() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("route53_session");

    if (!session) {
      window.location.href = "/login";
      return;
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

    loadZones();
  }, []);

  function handleLogout() {
    localStorage.removeItem("route53_session");
    window.location.href = "/login";
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="aws-logo">aws</div>

        <div className="service-title">
          <span>Route 53</span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="/">
            Dashboard
          </a>

          <a className="nav-item" href="/hosted-zones">
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
              placeholder="Search"
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
            Route 53
          </div>

          <h1>Route 53</h1>

          <p className="page-description">
            A scalable Domain Name System (DNS) web service.
          </p>

          <div className="dashboard-card">
            <h2>Welcome to Amazon Route 53</h2>

            <p>
              Manage your hosted zones, DNS records,
              health checks, and routing policies.
            </p>
          </div>

          <div
            className="table-card"
            style={{ marginTop: "30px" }}
          >
            <div className="table-header">
              <h2>Hosted zones overview</h2>

              <a
                href="/hosted-zones"
                className="primary-button"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View hosted zones
              </a>
            </div>

            {loading ? (
              <div className="loading">
                Loading...
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Domain name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {zones.slice(0, 5).map((zone) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && zones.length === 0 && (
              <div className="empty-state">
                No hosted zones found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}