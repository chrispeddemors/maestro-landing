declare module 'vanta/dist/vanta.net.min' {
  const NET: (opts: Record<string, unknown>) => { destroy?: () => void; setOptions?: (opts: Record<string, unknown>) => void };
  export default NET;
} 