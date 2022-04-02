export const h = {
  // http errors:
  400: 'Bad Request',
  401: 'Unauthorized', // RFC 7235
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required', // RFC 7235
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed', // RFC 7232
  413: 'Payload Too Large', // RFC 7231
  414: 'URI Too Long', // RFC 7231
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable', // RFC 7233
  417: 'Expectation Failed',
  418: "I'm a teapot", // RFC 2324
  421: 'Misdirected Request', // RFC 7540
  426: 'Upgrade Required',
  428: 'Precondition Required', // RFC 6585
  429: 'Too Many Requests', // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  451: 'Unavailable For Legal Reasons', // RFC 7725
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', // RFC 2295
  510: 'Not Extended', // RFC 2774
  511: 'Network Authentication Required', // RFC 6585
}

export const k = {
  CREATE_MODEL_FOR_TEAM: 'CREATE_MODEL_FOR_TEAM',
  CREATE_MODEL: 'CREATE_MODEL',
  ERROR: 'ERROR',
  POLICY: 'POLICY',
  SELECT_TEAM: 'SELECT_TEAM',
  TITLE_APP: 'TITLE_APP',
  TITLE_APPS: 'TITLE_APPS',
  TITLE_DASHBOARD: 'TITLE_DASHBOARD',
  TITLE_JOBS: 'TITLE_JOBS',
  TITLE_JOB: 'TITLE_JOB',
  TITLE_POLICIES: 'TITLE_POLICIES',
  TITLE_SECRET: 'TITLE_SECRET',
  TITLE_SECRETS: 'TITLE_SECRETS',
  TITLE_SERVICE: 'TITLE_SERVICE',
  TITLE_SERVICES: 'TITLE_SERVICES',
  TITLE_SETTING: 'TITLE_SETTING',
  TITLE_SHORTCUTS: 'TITLE_SHORTCUTS',
  TITLE_TEAM: 'TITLE_TEAM',
  TITLE_TEAMS: 'TITLE_TEAMS',
  WELCOME_DASHBOARD: 'WELCOME_DASHBOARD',
}

// custom otomi errors:
export const e = {
  'Git error occured': 'Git error occured',
  'Invalid values detected': 'Invalid values detected',
  'Service name already exists': 'Service name already exists',
  'The api could not be reached': 'The api could not be reached',
  'The route does not exist': 'The route does not exist',
  'The URL is already in use': 'The URL is already in use',
  'Unauthorized: The user may not be assigned to any team.': 'Unauthorized. The user may not be assigned to any team.',
  Unknown: 'Unknown',
}
