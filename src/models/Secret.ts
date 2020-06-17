enum SecretType {
  'docker-registry',
  'generic',
  'tls',
}

export default interface Service {
  id?: string
  type: SecretType
  teamId: string
  name: string
  value: any
}
