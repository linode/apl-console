import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'http://localhost:3000/api/v1/apiDocs',
  apiFile: './emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './otomi.ts',
  exportName: 'otomiApi',
  hooks: true,
}

export default config
