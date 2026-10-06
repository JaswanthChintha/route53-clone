"use client";

import { useEffect } from "react";

export default function ProfilesPage() {
  useEffect(() => {
    const session = localStorage.getItem("route53_session");

    if (!session) {
      window.location.href = "/login";
    }
  }, []);

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

          <a
            className="nav-item active"
            href="/profiles"
          >
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
            Route 53 / Profiles
          </div>

          <h1>Profiles</h1>

          <p className="page-description">
            Manage DNS configurations and reusable
            Route 53 profiles.
          </p>

          <div className="dashboard-card">
            <h2>Profiles</h2>

            <p>
              Profiles provide reusable DNS configurations
              that can be associated with supported
              resources.
            </p>

            <p>
              This section is available as a mock Route 53
              feature in this application.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}