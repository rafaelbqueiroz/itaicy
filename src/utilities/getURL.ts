export const getServerSideURL = (): string => {
  if (process.env.PAYLOAD_PUBLIC_SERVER_URL) return process.env.PAYLOAD_PUBLIC_SERVER_URL
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000'
  return 'http://localhost:3000'
}
