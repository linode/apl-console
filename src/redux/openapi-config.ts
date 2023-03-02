import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'http://localhost:8080/v1/apiDocs',
  apiFile: './emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './otomiApi.ts',
  exportName: 'otomiApi',
  hooks: true,
}

export default config
