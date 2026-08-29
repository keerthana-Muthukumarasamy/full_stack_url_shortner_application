import { useEffect,useState } from 'react'
import './App.css'
import {
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
} from 'recharts'




interface Url {
  id: number
  original_url: string
  short_code: string
  click_count: number
  created_at: string
}
interface Activity {
  date: string
  clicks: number
  creations: number
}

interface Analytics {
  total_urls: number
  total_clicks: number
  today_clicks: number
  activity: Activity[]
}
interface ClickEvent {
  clicked_at: string
}
interface URLAnalytics {
  id: number
  original_url: string
  short_code: string
  created_at: string
  click_count: number
  clicks: ClickEvent[]
}
function App() {
    const [url, setUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [urls, setUrls] = useState<Url[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const urlsPerPage = 5
    const [analytics, setAnalytics] = useState<Analytics>({
      total_urls: 0,
      total_clicks: 0,
      today_clicks: 0,
      activity: [],
  })
  const [selectedAnalytics, setSelectedAnalytics] = useState<URLAnalytics | null>(null)
  const [error, setError] = useState('')
    
    useEffect(() => {
      async function loadUrls() {
        const response = await fetch(
          'http://127.0.0.1:8000/api/urls'
        )

        const data = await response.json()

        setUrls(data)
      }
      async function loadAnalytics() {
    const response = await fetch(
      'http://127.0.0.1:8000/api/analytics'
    )

    const data = await response.json()

    setAnalytics(data)
  }

  loadUrls()
  loadAnalytics()
}, [])





    async function handleSubmit() {
      if (!url.trim()) {
        setError('Please enter a valid URL.')
        return
      }
      try {
    new URL(url)
  } catch {
    setError('Please enter a valid URL.')
    return
  }
      setError('')

      const response = await fetch(
      'http://127.0.0.1:8000/api/urls',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: url,
        }),
      }
    )


    const data = await response.json()

    setShortUrl(data.short_url)

    const urlsResponse = await fetch(
    'http://127.0.0.1:8000/api/urls'
  )

    const urlsData = await urlsResponse.json()

    setUrls(urlsData)

  }



    async function copyUrl(shortCode: string) {
      const shortUrl = `http://localhost:8000/${shortCode}`

      await navigator.clipboard.writeText(shortUrl)
}

    async function handleViewAnalytics(id: number) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/urls/${id}/analytics`
  )

  const data = await response.json()

  setSelectedAnalytics(data)
}
const totalPages = Math.ceil(urls.length / urlsPerPage)

const startIndex = (currentPage - 1) * urlsPerPage

const currentUrls = urls.slice(
  startIndex,
  startIndex + urlsPerPage
)
const clickActivity =
  selectedAnalytics?.clicks.map((event) => ({
    time: new Date(event.clicked_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    clicks: 1,
  })) ?? []

    
  return (
    <div className="app">
      <header className="header">
        <h1>Easy URL Shortener</h1>
      </header>

      <section className="hero">
        <h2>Simplify your URL</h2>

        <div className="url-form">
          <input
            type="text"
            placeholder="Enter your original URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button type="button" onClick={handleSubmit}>
            Shorten URL
          </button>
        </div>
        {error && (
  <p className="error-message">
    {error}
  </p>
)}

        <p>
          All the Shorted URL and their analytics are public. </p>
          {shortUrl && (
            <div className="short-result">
              <p>Your shortened URL:</p>
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
            </div>
            )}
      
              </section>
              <section className="recent-urls">
          <h2>Recent URLs</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Created on</th>
                  <th>Clicks</th>
                  <th>Analytics</th>
                </tr>
              </thead>

              <tbody>
                {currentUrls.map((item) => (
                  <tr key={item.id}>
                    <td>{item.original_url}</td>

                    <td>
                       <div className="short-url-cell">
                        <a
                          href={`http://localhost:8000/${item.short_code}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {`http://localhost:8000/${item.short_code}`}
                        </a>

                        <button
                          type="button"
                          onClick={() => copyUrl(item.short_code)}
                        >
                          Copy
                        </button>
                      </div>
                    </td>

                    <td>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td>{item.click_count}</td>

                    <td>
                      <button type="button" onClick={() => handleViewAnalytics(item.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-container">
  <table>
    ...
  </table>
</div>

<div className="pagination">
  <button
    type="button"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    type="button"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
          </div>
</section>
{selectedAnalytics && (
  <section className="url-analytics">
    <h2>URL Analytics</h2>

    <div className="analytics-details">
      <p>
        <strong>Original URL:</strong>{' '}
        {selectedAnalytics.original_url}
      </p>

      <p>
        <strong>Short URL:</strong>{' '}
        {selectedAnalytics.short_code}
      </p>

      <p>
        <strong>Created:</strong>{' '}
        {new Date(
          selectedAnalytics.created_at
        ).toLocaleString()}
      </p>

      <p>
        <strong>Total Clicks:</strong>{' '}
        {selectedAnalytics.click_count}
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
<section className="statistics">
  <div className="statistics-header">
    <h2>Statistics</h2>
  </div>

  <div className="chart-container">
    <h3>Recent Statistics of Click Counts</h3>

    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={analytics.activity}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis
  domain={[0, 'auto']}
  allowDecimals={false}
/>

        <Tooltip />

        <Legend />

        <Bar
  dataKey="creations"
  name="URL Creations"
  fill="#3498db"
/>

<Line
  type="monotone"
  dataKey="clicks"
  name="URL Clicks"
  stroke="#4db6b6"
  strokeWidth={2}
  dot={{ r: 3 }}
/>
      </ComposedChart>
    </ResponsiveContainer>
  </div>
</section>
    </div>
  )
}

export default App