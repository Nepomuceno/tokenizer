// Declaration for importing wasm assets as URLs via Vite ?url suffix
declare module '*.wasm?url' {
  const url: string
  export default url
}

// Internal glue modules of @dqbd/tiktoken (lite build) we import manually
