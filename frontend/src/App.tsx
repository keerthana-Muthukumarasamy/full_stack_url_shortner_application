import "./App.css";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MdContentCopy,
  MdOpenInNew,
  MdBarChart,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useEffect, useState } from "react";

interface Url {
  id: number;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
}

interface Activity {
  date: string;
  clicks: number;
  creations: number;
}

interface Analytics {
  total_urls: number;
  total_clicks: number;
  today_clicks: number;
  activity: Activity[];
}

interface ClickEvent {
  clicked_at: string;
}

interface URLAnalytics {
  id: number;
  original_url: string;
  short_code: string;
  created_at: string;
  click_count: number;
  clicks: ClickEvent[];
}

function formatCreatedDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });

  return `${weekday} ${String(day).padStart(2, "0")}${suffix} ${month}, ${date.getFullYear()}`;
}

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  // Use mock data instead of backend
  const [urls, setUrls] = useState<Url[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const urlsPerPage = 10;

  const [analytics, setAnalytics] = useState<Analytics>({
    total_urls: 0,
    total_clicks: 0,
    today_clicks: 0,
    activity: [],
  });

  const [selectedAnalytics, setSelectedAnalytics] =
    useState<URLAnalytics | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUrls() {
      const response = await fetch("http://127.0.0.1:8000/api/urls");

      const data = await response.json();

      setUrls(data);
    }

    async function loadAnalytics() {
      const response = await fetch("http://127.0.0.1:8000/api/analytics");

      const data = await response.json();

      setAnalytics(data);
    }

    loadUrls();
    loadAnalytics();
  }, []);

  // ---------------- SHORTEN URL ----------------
  async function handleSubmit() {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");

    const response = await fetch("http://127.0.0.1:8000/api/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_url: url,
      }),
    });

    const data = await response.json();

    setShortUrl(data.short_url);

    const urlsResponse = await fetch("http://127.0.0.1:8000/api/urls");

    const urlsData = await urlsResponse.json();

    setUrls(urlsData);
  }

  // ---------------- COPY URL ----------------

  async function copyUrl(shortCode: string) {
    const shortUrl = `http://localhost:8000/${shortCode}`;

    await navigator.clipboard.writeText(shortUrl);
  }

  // ---------------- VIEW ANALYTICS ----------------
  async function handleViewAnalytics(id: number) {
    const response = await fetch(
      `http://127.0.0.1:8000/api/urls/${id}/analytics`,
    );

    const data = await response.json();

    setSelectedAnalytics(data);
  }
  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(urls.length / urlsPerPage);

  const startIndex = (currentPage - 1) * urlsPerPage;

  const currentUrls = urls.slice(startIndex, startIndex + urlsPerPage);

  // ---------------- CLICK ACTIVITY ----------------

  const clickActivity =
    selectedAnalytics?.clicks.map((event) => ({
      time: new Date(event.clicked_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clicks: 1,
    })) ?? [];

  return (
    <div className="app">
      {/* HEADER */}

      <header className="header">
        <h1>Easy URL Shortener</h1>
      </header>

      {/* HERO */}

      <section className="hero">
        <h2>Simplify your URL</h2>

        <div className="url-form">
          <input
            id="original-url"
            name="original-url"
            type="url"
            placeholder="Enter your original URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button type="button" onClick={handleSubmit}>
            Shorten URL
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <p>All the Shorted URL and their analytics are public.</p>

        {shortUrl && (
          <div className="short-result">
            <p>Your shortened URL:</p>

            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </section>

      {/* RECENT URLS */}

      <section className="recent-urls">
        <h2>Recent URLs</h2>

        <div className="url-table-wrapper">
          <table className="url-table">
            <thead>
              <tr>
                <th className="original-column">Original URL</th>
                <th className="short-column">Short URL</th>
                <th className="action-column"></th>
                <th className="action-column"></th>
                <th className="created-column">Created on</th>
                <th className="clicks-column">Clicks</th>
                <th className="analytics-column"></th>
              </tr>
            </thead>

            <tbody>
              {currentUrls.map((item) => {
                const shortUrl = `http://localhost:8000/${item.short_code}`;

                return (
                  <tr key={item.id}>
                    {/* ORIGINAL URL */}
                    <td className="original-url">{item.original_url}</td>

                    {/* SHORT URL */}
                    <td className="short-url">
                      <a href={shortUrl} target="_blank" rel="noreferrer">
                        <MdOpenInNew className="short-url-icon" />

                        <span>
                          http://demos.nellinewine.net
                          <br />
                          /URLShortener/{item.short_code.split("/")[1]}
                        </span>
                      </a>
                    </td>

                    {/* GREEN COPY BUTTON */}
                    <td className="action-cell">
                      <button
                        className="green-action"
                        type="button"
                        onClick={() => copyUrl(item.short_code)}
                        title="Copy URL"
                      >
                        <MdContentCopy size={18} />
                      </button>
                    </td>

                    {/* BLUE ACTION BUTTON */}
                    <td className="action-cell">
                      <button
                        className="blue-action"
                        type="button"
                        title="Open URL"
                        onClick={() => window.open(shortUrl, "_blank")}
                      >
                        <MdOpenInNew size={18} />
                      </button>
                    </td>

                    {/* CREATED */}
                    <td className="created-date">
                      {formatCreatedDate(item.created_at)}
                    </td>

                    {/* CLICKS */}
                    <td className="click-count">{item.click_count}</td>

                    {/* ANALYTICS */}
                    <td className="analytics-cell">
                      <button
                        className="analytics-button"
                        type="button"
                        onClick={() => handleViewAnalytics(item.id)}
                      >
                        <MdBarChart size={16} />
                        Analytics
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <MdChevronLeft size={22} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {String(page).padStart(2, "0")}
              </button>
            ),
          )}

          <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <MdChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* URL ANALYTICS */}

      {selectedAnalytics && (
        <section className="url-analytics">
          <h2>URL Analytics</h2>

          <div className="analytics-details">
            <p>
              <strong>Original URL:</strong> {selectedAnalytics.original_url}
            </p>

            <p>
              <strong>Short URL:</strong> {selectedAnalytics.short_code}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(selectedAnalytics.created_at).toLocaleString()}
            </p>

            <p>
              <strong>Total Clicks:</strong> {selectedAnalytics.click_count}
            </p>

            <div className="url-click-chart">
              <h3>Click Activity</h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={clickActivity}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#4db6b6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* STATISTICS */}
      <div className="statistics-wrapper">
        <section className="statistics">
          <div className="statistics-header">
            <h2>Statistics</h2>
          </div>

          <div className="chart-container">
            <h3>Recent Statistics of Click Counts</h3>

            <ResponsiveContainer width="100%" height={650}>
              <ComposedChart
                data={analytics.activity}
                margin={{
                  top: 55,
                  right: 45,
                  left: 45,
                  bottom: 25,
                }}
              >
                <CartesianGrid
                  stroke="#d9d9d9"
                  strokeDasharray="0"
                  vertical={true}
                  horizontal={true}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 14,
                    fill: "#666",
                  }}
                  tickLine={{
                    stroke: "#999",
                  }}
                  axisLine={{
                    stroke: "#999",
                  }}
                  interval={0}
                />

                <YAxis
                  domain={[0, 12]}
                  ticks={[0, 2, 4, 6, 8, 10, 12]}
                  allowDecimals={false}
                  tick={{
                    fontSize: 14,
                    fill: "#666",
                  }}
                  tickLine={{
                    stroke: "#999",
                  }}
                  axisLine={{
                    stroke: "#999",
                  }}
                />

                <Tooltip />

                <Legend
                  verticalAlign="top"
                  align="center"
                  height={50}
                  iconType="square"
                  wrapperStyle={{
                    fontSize: "16px",
                    color: "#666",
                  }}
                />

                {/* URL CLICKS - GRAY AREA + TEAL LINE */}
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="URL Clicks"
                  stroke="#55b7b7"
                  strokeWidth={3}
                  fill="#e5e5e5"
                  fillOpacity={1}
                  dot={{
                    r: 4,
                    fill: "#e5e5e5",
                    stroke: "#55b7b7",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                  isAnimationActive={false}
                />

                {/* URL CREATIONS - BLUE BARS */}
                <Bar
                  dataKey="creations"
                  name="URL Creations"
                  fill="#349fe0"
                  barSize={72}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
