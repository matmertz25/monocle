export function convertSwarmFile(file: any, path?: string): any {
  const pth = path || file.path || file.webkitRelativePath || file.name
  file.path = pth.replace(/^\//g, '') // remove the starting slash

  return file as any
}

/**
 * Utility function that is needed to have correct directory structure as webkitRelativePath is read only
 */
export function packageFile(file: any): any {
  return {
    path: file.path,
    fullPath: file.path,
    webkitRelativePath: file.path,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    stream: file.stream,
    slice: file.slice,
    text: file.text,
    arrayBuffer: async () => await file.arrayBuffer(), // This is needed for successful upload and can not simply be { arrayBuffer: file.arrayBuffer }
  }
}
