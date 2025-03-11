export {}

// export const detectGitProvider = (url) => {
//   url = url.replace(/\/$/, '') // Normalize URL (remove trailing `/` if exists)

//   // Regex patterns for supported Git providers
//   const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/blob|\/raw)?\/([^\/]+)\/(.+)/
//   const githubRawRegex = /raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
//   const gitlabRegex = /gitlab\.com\/([^\/]+)\/([^\/]+)\/(?:\-\/blob|raw)\/([^\/]+)\/(.+)/
//   const bitbucketRegex = /bitbucket\.org\/([^\/]+)\/([^\/]+)\/(?:src|raw)\/([^\/]+)\/(.+)/
//   const azureRegex = /dev\.azure\.com\/([^\/]+)\/([^\/]+)\/_git\/([^\/]+)\?path=\/([^&]+)/

//   // Raw content URLs (directly fetchable)
//   if (githubRawRegex.test(url)) {
//     const match = url.match(githubRawRegex)
//     return { provider: 'github', owner: match[1], repo: match[2], branch: match[3], filePath: match[4], isRaw: true }
//   }
//   if ((match = url.match(githubRegex)))
//     return { provider: 'github', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }
//   if ((match = url.match(gitlabRegex)))
//     return { provider: 'gitlab', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }
//   if ((match = url.match(bitbucketRegex)))
//     return { provider: 'bitbucket', owner: match[1], repo: match[2], branch: match[3], filePath: match[4] }
//   if ((match = url.match(azureRegex)))
//     return { provider: 'azure', org: match[1], project: match[2], repo: match[3], filePath: match[4] }

//   // Handle raw content URLs
//   if (url.includes('raw.githubusercontent.com')) return { provider: 'github', isRaw: true, url }
//   if (url.includes('gitlab.com') && url.includes('/raw/')) return { provider: 'gitlab', isRaw: true, url }
//   if (url.includes('bitbucket.org') && url.includes('/raw/')) return { provider: 'bitbucket', isRaw: true, url }

//   // Handle Git repository URLs (assume default branch)
//   const gitRepoRegex = /(github\.com|gitlab\.com|bitbucket\.org)\/([^\/]+)\/([^\/]+)(\.git)?$/
//   if (gitRepoRegex.test(url)) {
//     const match = url.match(gitRepoRegex)
//     return {
//       provider: match[1].split('.')[0],
//       owner: match[2],
//       repo: match[3],
//       branch: 'main',
//       filePath: 'helm/Chart.yaml',
//     }
//   }

//   return null
// }

// export const fetchChartYaml = async (url) => {
//   try {
//     const details = detectGitProvider(url)
//     if (!details) throw new Error('Unsupported Git provider or invalid URL format')

//     let apiUrl

//     if (details.isRaw) apiUrl = details.url // Directly fetch raw content
//     else if (details.provider === 'github')
//       apiUrl = `https://api.github.com/repos/${details.owner}/${details.repo}/contents/${details.filePath}?ref=${details.branch}`
//     else if (details.provider === 'gitlab') {
//       const encodedProject = encodeURIComponent(`${details.owner}/${details.repo}`)
//       apiUrl = `https://gitlab.com/api/v4/projects/${encodedProject}/repository/files/${encodeURIComponent(
//         details.filePath,
//       )}/raw?ref=${details.branch}`
//     } else if (details.provider === 'bitbucket')
//       apiUrl = `https://api.bitbucket.org/2.0/repositories/${details.owner}/${details.repo}/src/${details.branch}/${details.filePath}`
//     else if (details.provider === 'azure') {
//       apiUrl = `https://dev.azure.com/${details.org}/${details.project}/_apis/git/repositories/${
//         details.repo
//       }/items?path=${encodeURIComponent(details.filePath)}&api-version=6.0`
//     }

//     const response = await fetch(apiUrl)
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

//     const text = await response.text()
//     return text // Returns raw YAML content
//   } catch (error) {
//     console.error('Error fetching Chart.yaml:', error)
//     return null
//   }
// }
