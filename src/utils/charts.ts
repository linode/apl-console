export {}

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
//   const patterns = {
//     githubRaw: /raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/,
//     github: /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|raw))?\/([^\/]+)\/(.+)/,
//     gitlab: /gitlab\.com\/([^\/]+)\/([^\/]+)\/(?:\-\/(?:blob|raw))\/([^\/]+)\/(.+)/,
//     bitbucket: /bitbucket\.org\/([^\/]+)\/([^\/]+)\/(?:src|raw)\/([^\/]+)\/(.+)/,
//     azure: /dev\.azure\.com\/([^\/]+)\/([^\/]+)\/_git\/([^\/]+)\?path=\/([^&]+)/,
//     gitRepo: /(github\.com|gitlab\.com|bitbucket\.org)\/([^\/]+)\/([^\/]+)(\.git)?$/,
//   }

//   // Check for raw GitHub content first (directly fetchable)
//   let match = normalizedUrl.match(patterns.githubRaw)
//   if (match) {
//     return {
//       provider: 'github',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//       isRaw: true,
//       rawUrl: normalizedUrl,
//     }
//   }

//   // Check for GitHub file URLs
//   match = normalizedUrl.match(patterns.github)
//   if (match) {
//     return {
//       provider: 'github',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//       isRaw: normalizedUrl.includes('/raw/'),
//     }
//   }

//   // Check for GitLab file URLs
//   match = normalizedUrl.match(patterns.gitlab)
//   if (match) {
//     return {
//       provider: 'gitlab',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//       isRaw: normalizedUrl.includes('/raw/'),
//     }
//   }

//   // Check for Bitbucket file URLs
//   match = normalizedUrl.match(patterns.bitbucket)
//   if (match) {
//     return {
//       provider: 'bitbucket',
//       owner: match[1],
//       repo: match[2],
//       branch: match[3],
//       filePath: match[4],
//       isRaw: normalizedUrl.includes('/raw/'),
//     }
//   }

//   // Check for Azure DevOps URLs
//   match = normalizedUrl.match(patterns.azure)
//   if (match) {
//     return {
//       provider: 'azure',
//       org: match[1],
//       project: match[2],
//       repo: match[3],
//       filePath: match[4],
//     }
//   }

//   // Handle Git repository URLs (assume default branch and path to Chart.yaml)
//   match = normalizedUrl.match(patterns.gitRepo)
//   if (match) {
//     const provider = match[1].split('.')[0]
//     return {
//       provider,
//       owner: match[2],
//       repo: match[3].replace(/\.git$/, ''),
//       branch: provider === 'github' ? 'main' : 'master', // Default branch assumption
//       filePath: 'Chart.yaml', // Default path assumption
//     }
//   }

//   return null
// }

// /**
//  * Fetches Chart.yaml content from a Git repository
//  * @param {string} url - Git repository or file URL
//  * @param {Object} options - Optional parameters (headers, timeout, etc.)
//  * @returns {Promise<string|null>} - YAML content or null on error
//  */
// interface FetchOptions {
//   timeout?: number
//   headers?: Record<string, string>
// }

// export const fetchChartYaml = async (url: string, options: FetchOptions = {}) => {
//   try {
//     const details = detectGitProvider(url)
//     if (!details) throw new Error('Unsupported Git provider or invalid URL format')

//     const { timeout = 10000, headers = {} } = options
//     let apiUrl
//     const fetchOptions = {
//       headers: { ...headers },
//       signal: AbortSignal.timeout(timeout),
//     }

//     // Handle different providers to get raw content
//     if (details.isRaw && details.rawUrl) {
//       // Direct raw URL available
//       apiUrl = details.rawUrl
//     } else {
//       switch (details.provider) {
//         case 'github':
//           apiUrl = `https://api.github.com/repos/${details.owner}/${details.repo}/contents/${details.filePath}?ref=${details.branch}`
//           fetchOptions.headers.Accept = 'application/vnd.github.v3.raw'
//           break

//         case 'gitlab':
//           const encodedProject = encodeURIComponent(`${details.owner}/${details.repo}`)
//           const encodedPath = encodeURIComponent(details.filePath)
//           apiUrl = `https://gitlab.com/api/v4/projects/${encodedProject}/repository/files/${encodedPath}/raw?ref=${details.branch}`
//           break

//         case 'bitbucket':
//           apiUrl = `https://api.bitbucket.org/2.0/repositories/${details.owner}/${details.repo}/src/${details.branch}/${details.filePath}`
//           break

//         case 'azure':
//           apiUrl = `https://dev.azure.com/${details.org}/${details.project}/_apis/git/repositories/${
//             details.repo
//           }/items?path=${encodeURIComponent(details.filePath)}&api-version=6.0`
//           break

//         default:
//           throw new Error(`Unsupported Git provider: ${details.provider}`)
//       }
//     }

//     const response = await fetch(apiUrl, fetchOptions)

//     if (!response.ok) {
//       // Handle specific error cases
//       if (response.status === 404) throw new Error(`Chart.yaml not found at specified path: ${details.filePath}`)

//       if (response.status === 403 && details.provider === 'github')
//         throw new Error('GitHub API rate limit exceeded. Consider using authentication.')

//       throw new Error(`HTTP error! Status: ${response.status}`)
//     }

//     // For GitHub, handle the case where API returns JSON instead of raw content
//     if (details.provider === 'github' && !details.isRaw) {
//       const contentType = response.headers.get('content-type')
//       if (contentType && contentType.includes('application/json')) {
//         const data = await response.json()
//         if (data.content && data.encoding === 'base64') return atob(data.content)
//       }
//     }

//     const text = await response.text()
//     return text
//   } catch (error) {
//     console.error('Error fetching Chart.yaml:', error.message)
//     throw error // Re-throw to allow calling code to handle errors
//   }
// }

// /**
//  * Validates Chart.yaml content structure
//  * @param {string} yamlContent - Chart.yaml content
//  * @returns {Object} - Parsed Chart.yaml with validation result
//  */
// export const validateChartYaml = (yamlContent) => {
//   try {
//     if (!yamlContent) return { valid: false, error: 'Empty content' }

//     // This function is a placeholder - in a real application,
//     // you would use a YAML parser like js-yaml and validate
//     // against the Helm Chart schema

//     // Basic structure check (example)
//     const requiredFields = ['apiVersion', 'name', 'version']
//     const missingFields = []

//     // Simple regex checks for required fields
//     requiredFields.forEach((field) => {
//       if (!new RegExp(`${field}:`, 'i').test(yamlContent)) missingFields.push(field)
//     })

//     if (missingFields.length > 0) {
//       return {
//         valid: false,
//         error: `Missing required fields: ${missingFields.join(', ')}`,
//         content: yamlContent,
//       }
//     }

//     return { valid: true, content: yamlContent }
//   } catch (error) {
//     return { valid: false, error: error.message }
//   }
// }

// /**
//  * Fetches Chart.yaml from various locations in a repository
//  * @param {string} repoUrl - Git repository URL
//  * @returns {Promise<string|null>} - Chart.yaml content or null
//  */
// export const findChartYaml = async (repoUrl) => {
//   const commonPaths = [
//     'Chart.yaml',
//     'charts/Chart.yaml',
//     'helm/Chart.yaml',
//     'helm-chart/Chart.yaml',
//     'kubernetes/helm/Chart.yaml',
//   ]

//   const provider = detectGitProvider(repoUrl)
//   if (!provider) throw new Error('Invalid repository URL')

//   // Try each path in sequence
//   const results = await Promise.all(
//     commonPaths.map(async (path) => {
//       const details = { ...provider, filePath: path }
//       const modifiedUrl = `${repoUrl.replace(/\/*$/, '')}/${path}`
//       try {
//         const content = await fetchChartYaml(modifiedUrl)
//         if (content) {
//           const validation = validateChartYaml(content)
//           if (validation.valid) {
//             return {
//               content,
//               path,
//               provider: details.provider,
//               repository: `${details.owner}/${details.repo}`,
//             }
//           }
//         }
//       } catch (error) {
//         // Ignore error and continue to next path
//       }
//       return null
//     }),
//   )

//   // Return the first valid result
//   return results.find((result) => result !== null) || null
// }
