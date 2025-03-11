/* eslint-disable no-useless-escape */
import axios from 'axios'

/**
 * Detects Git provider from a URL and extracts repository information.
 * @param {string} url - Git repository or file URL
 * @returns {Object|null} Repository details or null if unsupported
 */
export const detectGitProvider = (url) => {
  if (!url || typeof url !== 'string') return null

  const normalizedUrl = url.replace(/\/*$/, '')

  const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|raw))?\/([^\/]+)\/(.+)/
  const githubRawPattern = /raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
  const gitlabPattern = /gitlab\.com\/([^\/]+)\/([^\/]+)\/(?:\-\/(?:blob|raw))\/([^\/]+)\/(.+)/
  const bitbucketPattern = /bitbucket\.org\/([^\/]+)\/([^\/]+)\/(?:src|raw)\/([^\/]+)\/(.+)/

  let match = normalizedUrl.match(githubRawPattern)
  if (match)
    return { provider: 'github', owner: match[1], repo: match[2], branch: match[3], filePath: match[4], isRaw: true }

  match = normalizedUrl.match(githubPattern)
  if (match) return { provider: 'github', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }

  match = normalizedUrl.match(gitlabPattern)
  if (match) return { provider: 'gitlab', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }

  match = normalizedUrl.match(bitbucketPattern)
  if (match) return { provider: 'bitbucket', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }

  return null
}

/**
 * Converts a GitHub, GitLab, or Bitbucket web URL to a raw content URL.
 * @param {Object} details - Repository details from detectGitProvider
 * @returns {string|null} Raw content URL
 */
export const getGitRawUrl = (details) => {
  if (!details) return null

  if (details.provider === 'github')
    return `https://raw.githubusercontent.com/${details.owner}/${details.repo}/${details.branch}/${details.filePath}`
  if (details.provider === 'gitlab')
    return `https://gitlab.com/${details.owner}/${details.repo}/-/raw/${details.branch}/${details.filePath}`
  if (details.provider === 'bitbucket')
    return `https://bitbucket.org/${details.owner}/${details.repo}/raw/${details.branch}/${details.filePath}`

  return null
}

/**
 * Fetches Chart.yaml content from a Git repository URL using axios (Node.js only)
 * @param {string} url - Git repository or file URL
 * @returns {Promise<string|null>} - YAML content or null on error
 */
export const fetchChartYaml = async (url) => {
  try {
    const details = detectGitProvider(url)
    console.log('details', details)
    if (!details) throw new Error('Unsupported Git provider or invalid URL format')

    const rawUrl = getGitRawUrl(details)
    console.log('rawUrl', rawUrl)
    if (!rawUrl) throw new Error(`Could not generate raw URL for provider: ${details.provider}`)

    const response = await axios.get(rawUrl, { responseType: 'text' })
    console.log('response', response)
    return response.data
  } catch (error) {
    console.error('Error fetching Chart.yaml:', error.message)
    return null
  }
}

// /* eslint-disable no-useless-escape */
// /**
//  * Detects Git provider from a URL and extracts repository information.
//  * @param {string} url - Git repository or file URL
//  * @returns {Object|null} Repository details or null if unsupported
//  */
// export const detectGitProvider = (url) => {
//   if (!url || typeof url !== 'string') return null

//   // Normalize URL (remove trailing slashes)
//   const normalizedUrl = url.replace(/\/*$/, '')

//   // Regex patterns for supported Git providers
//   const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|raw))?\/([^\/]+)\/(.+)/
//   const githubRawPattern = /raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
//   const gitlabPattern = /gitlab\.com\/([^\/]+)\/([^\/]+)\/(?:\-\/(?:blob|raw))\/([^\/]+)\/(.+)/
//   const bitbucketPattern = /bitbucket\.org\/([^\/]+)\/([^\/]+)\/(?:src|raw)\/([^\/]+)\/(.+)/

//   // Check for raw GitHub content
//   let match = normalizedUrl.match(githubRawPattern)
//   if (match) {
//     return {
//       provider: 'github',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//       isRaw: true,
//     }
//   }

//   // Check for GitHub file URLs
//   match = normalizedUrl.match(githubPattern)
//   if (match) {
//     return {
//       provider: 'github',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//     }
//   }

//   // Check for GitLab file URLs
//   match = normalizedUrl.match(gitlabPattern)
//   if (match) {
//     return {
//       provider: 'gitlab',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//     }
//   }

//   // Check for Bitbucket file URLs
//   match = normalizedUrl.match(bitbucketPattern)
//   if (match) {
//     return {
//       provider: 'bitbucket',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//     }
//   }

//   return null
// }

// /**
//  * Gets a CORS-compatible URL for fetching content
//  * @param {Object} details - Repository details from detectGitProvider
//  * @returns {Object} URL information with appropriate method
//  */
// export const getContentUrl = (details) => {
//   if (!details) return null

//   if (details.provider === 'github') {
//     // GitHub content can be fetched directly or through proxy
//     return {
//       url: `https://raw.githubusercontent.com/${details.owner}/${details.repo}/${details.branch}/${details.filePath}`,
//       method: 'direct',
//     }
//   }
//   if (details.provider === 'gitlab') {
//     // For GitLab, use the API which accepts CORS requests
//     const projectPath = encodeURIComponent(`${details.owner}/${details.repo}`)
//     const filePath = encodeURIComponent(details.filePath)
//     return {
//       url: `https://gitlab.com/api/v4/projects/${projectPath}/repository/files/${filePath}/raw?ref=${details.branch}`,
//       method: 'cors-proxy',
//     }
//   }
//   if (details.provider === 'bitbucket') {
//     // Bitbucket also needs CORS proxy
//     return {
//       url: `https://bitbucket.org/${details.owner}/${details.repo}/raw/${details.branch}/${details.filePath}`,
//       method: 'cors-proxy',
//     }
//   }

//   return null
// }

// /**
//  * Fetches content through a CORS proxy when needed
//  * @param {string} url - URL to fetch
//  * @returns {Promise<string>} - Content
//  */
// const fetchWithCorsProxy = async (url) => {
//   // Options for using cors-anywhere or similar service:
//   // 1. Public CORS proxy (not recommended for production)
//   const corsProxy = 'https://corsproxy.io/?'

//   // 2. Alternative: self-hosted proxy using your own serverless function
//   // const corsProxy = 'https://your-own-proxy.vercel.app/api/proxy?url=';

//   const proxiedUrl = `${corsProxy}${encodeURIComponent(url)}`
//   const response = await fetch(proxiedUrl)

//   if (!response.ok) throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`)

//   return response.text()
// }

// /**
//  * Fetches Chart.yaml content from a Git repository URL
//  * @param {string} url - Git repository or file URL (e.g., https://github.com/nats-io/k8s/blob/main/helm/charts/nats/Chart.yaml)
//  * @returns {Promise<string|null>} - YAML content or null on error
//  */
// export const fetchChartYaml = async (url) => {
//   try {
//     const details = detectGitProvider(url)
//     if (!details) throw new Error('Unsupported Git provider or invalid URL format')

//     const contentInfo = getContentUrl(details)
//     if (!contentInfo) throw new Error(`Could not generate content URL for provider: ${details.provider}`)

//     let content

//     if (contentInfo.method === 'direct') {
//       // Direct fetch works for GitHub
//       const response = await fetch(contentInfo.url)

//       if (!response.ok) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)

//       content = await response.text()
//     } else if (contentInfo.method === 'cors-proxy') {
//       // Use CORS proxy for GitLab and Bitbucket
//       content = await fetchWithCorsProxy(contentInfo.url)
//     }

//     return content
//   } catch (error) {
//     console.error('Error fetching Chart.yaml:', error.message)
//     return null
//   }
// }

// // /**
// //  * Converts a GitHub web URL to a raw content URL.
// //  * @param {Object} details - Repository details from detectGitProvider
// //  * @returns {string} Raw content URL
// //  */
// // export const getGitRawUrl = (details) => {
// //   if (!details) return null

// //   if (details.provider === 'github')
// //     return `https://raw.githubusercontent.com/${details.owner}/${details.repo}/${details.branch}/${details.filePath}`
// //   if (details.provider === 'gitlab')
// //     return `https://gitlab.com/${details.owner}/${details.repo}/-/raw/${details.branch}/${details.filePath}`
// //   if (details.provider === 'bitbucket')
// //     return `https://bitbucket.org/${details.owner}/${details.repo}/raw/${details.branch}/${details.filePath}`

// //   return null
// // }

// // /**
// //  * Fetches Chart.yaml content from a Git repository URL
// //  * @param {string} url - Git repository or file URL (e.g., https://github.com/nats-io/k8s/blob/main/helm/charts/nats/Chart.yaml)
// //  * @returns {Promise<string|null>} - YAML content or null on error
// //  */
// // export const fetchChartYaml = async (url) => {
// //   try {
// //     const details = detectGitProvider(url)
// //     console.log('details', details)
// //     if (!details) throw new Error('Unsupported Git provider or invalid URL format')

// //     // For React applications, we'll use the raw URL approach for all providers
// //     // This avoids CORS issues and API rate limits
// //     const rawUrl = getGitRawUrl(details)
// //     console.log('rawUrl', rawUrl)
// //     if (!rawUrl) throw new Error(`Could not generate raw URL for provider: ${details.provider}`)

// //     const response = await fetch(rawUrl)
// //     console.log('response', response)

// //     if (!response.ok) {
// //       if (response.status === 404) throw new Error('Chart.yaml not found at the specified path')

// //       throw new Error(`Failed to fetch Chart.yaml: ${response.status} ${response.statusText}`)
// //     }

// //     const text = await response.text()
// //     return text
// //   } catch (error) {
// //     console.error('Error fetching Chart.yaml:', error.message)
// //     return null
// //   }
// // }

// // /**
// //  * React hook to fetch Chart.yaml content
// //  * @param {string} url - Git repository or file URL
// //  * @returns {Object} - { data, loading, error }
// //  */
// // export const useChartYaml = (url) => {
// //   const [data, setData] = React.useState(null)
// //   const [loading, setLoading] = React.useState(false)
// //   const [error, setError] = React.useState(null)

// //   React.useEffect(() => {
// //     if (!url) return

// //     const fetchData = async () => {
// //       setLoading(true)
// //       try {
// //         const yamlContent = await fetchChartYaml(url)
// //         setData(yamlContent)
// //         setError(null)
// //       } catch (err) {
// //         setError(err.message)
// //         setData(null)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchData()
// //   }, [url])

// //   return { data, loading, error }
// // }
