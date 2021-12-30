import { initManifestNode, Utils as MantaUtils, Reference } from 'mantaray-js'
import { Bee, Utils } from '@ethersphere/bee-js'
import { BEE_HOSTS } from '../constants'

const beeUrl = BEE_HOSTS[0]
const bee = new Bee(beeUrl)
export const createMantaray = (): any => {
  const node = initManifestNode()
  const address1 = MantaUtils.gen32Bytes() // instead of `gen32Bytes` some 32 bytes identifier that later could be retrieved from the storage
  const address2 = MantaUtils.gen32Bytes()
  const address3 = MantaUtils.gen32Bytes()
  const address4 = MantaUtils.gen32Bytes()
  const address5 = MantaUtils.gen32Bytes()
  const path1 = new TextEncoder().encode('path1/valami/elso')
  const path2 = new TextEncoder().encode('path1/valami/masodik')
  const path3 = new TextEncoder().encode('path1/valami/masodik.ext')
  const path4 = new TextEncoder().encode('path1/valami')
  const path5 = new TextEncoder().encode('path2')
  node.addFork(path1, address1)
  node.addFork(path2, address2, { vmi: 'elso' }) // here 'vmi' is a key of metadata and 'elso' is its value
  node.addFork(path3, address3)
  node.addFork(path4, address4, { vmi: 'negy' })
  node.addFork(path5, address5)
  // node.removePath(path3)

  return node
}

export const hexToBytes = (hexString: any): any => {
  return Utils.hexToBytes(hexString)
}

export const bytesToHex = (bytes: any): any => {
  return Utils.bytesToHex(bytes)
}

export const bytesToUtf8 = (bytes: any): any => {
  return new TextDecoder().decode(bytes)
}

export const utf8ToBytes = (value: string): Uint8Array => {
  return new TextEncoder().encode(value)
}

export const saveFunction = async (data: Uint8Array): Promise<Reference> => {
  const hexRef = await bee.uploadData(process.env.BEE_POSTAGE || '', data)

  return hexToBytes(hexRef)
}

export const beeDownload = async (address: string): Promise<Uint8Array> => {
  return await bee.downloadData(address)
}

export const beeDownloadFile = async (address: string, path: string): Promise<any> => {
  return await bee.downloadFile(address, path)
}

export const removeFork = async (address: string): Promise<Uint8Array> => {
  return await bee.downloadData(address)
}

export const loadFunction = async (address: any): Promise<Uint8Array> => {
  return await bee.downloadData(bytesToHex(address))
}
