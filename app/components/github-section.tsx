"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

interface CommitEvent {
  id: string
  type: string
  repo: {
    name: string
    url: string
  }
  payload: {
    commits?: Array<{
      message: string
      sha: string
    }>
  }
  created_at: string
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [commits, setCommits] = useState<CommitEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch repositories
        const reposResponse = await fetch(
          "https://api.github.com/users/chasesdev/repos?sort=updated&per_page=6"
        )

        if (!reposResponse.ok) {
          throw new Error(`GitHub API error: ${reposResponse.status}`)
        }

        const reposData = await reposResponse.json()

        if (Array.isArray(reposData)) {
          setRepos(reposData)
        } else {
          console.error("Invalid repos data:", reposData)
          setError("Failed to load repositories")
        }

        // Fetch recent events (commits)
        const eventsResponse = await fetch(
          "https://api.github.com/users/chasesdev/events?per_page=10"
        )

        if (!eventsResponse.ok) {
          throw new Error(`GitHub API error: ${eventsResponse.status}`)
        }

        const eventsData = await eventsResponse.json()

        // Filter only push events (commits)
        if (Array.isArray(eventsData)) {
          const pushEvents = eventsData.filter(
            (event: CommitEvent) => event.type === "PushEvent"
          ).slice(0, 5)
          setCommits(pushEvents)
        } else {
          console.error("Invalid events data:", eventsData)
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error)
        setError(error instanceof Error ? error.message : "Failed to load GitHub data")
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-gray-400">Loading GitHub data...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-red-400">{error}</div>
          </div>
        </div>
      </section>
    )
  }

  if (repos.length === 0 && commits.length === 0) {
    return (
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-gray-400">No GitHub data available</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 bg-black">
      <div ref={ref} className="container mx-auto px-4">
        {/* Latest Repositories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
            Latest Repositories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {repo.name}
                  </h3>
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {repo.stargazers_count}
                    </div>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                  {repo.description || "No description provided"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Recent Commits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
            Recent Activity
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {commits.map((event, index) => (
              <motion.div
                key={event.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={`https://github.com/${event.repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-400 hover:underline"
                    >
                      {event.repo.name}
                    </a>
                    {event.payload.commits && event.payload.commits.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {event.payload.commits.slice(0, 3).map((commit) => (
                          <p key={commit.sha} className="text-sm text-gray-400">
                            <span className="font-mono text-xs text-gray-500">
                              {commit.sha.substring(0, 7)}
                            </span>{" "}
                            {commit.message.split("\n")[0]}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(event.created_at)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
