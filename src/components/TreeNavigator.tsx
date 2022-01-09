import { Tree } from 'antd'
import { shortenHash } from '../utils'
import TreeEmpty from './TreeEmpty'

export default function TreeNavigator({
  data,
  handleNodeClick,
  metadata,
}: {
  data: any
  handleNodeClick: any
  metadata: { [key: string]: any }
}) {
  const onSelect = (selectedKeys: any, info: any) => {
    // eslint-disable-next-line no-console
    console.log('selected', selectedKeys, info)
    handleNodeClick(info.node)
  }

  const handleExpand = (e: any) => {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  return (
    <div>
      {data.children ? (
        <>
          <div className="mb-1" style={{ fontSize: '0.875rem' }}>
            <span className="text-gray-800 font-semibold">Manifest</span>
            <span className="ml-2 font-normal text-gray-500">{shortenHash(metadata.hash)}</span>
          </div>
          <Tree
            showLine={{ showLeafIcon: false }}
            autoExpandParent
            defaultExpandParent
            defaultExpandedKeys={['Root']}
            onSelect={onSelect}
            treeData={[data]}
            onExpand={handleExpand}
          />
        </>
      ) : (
        <TreeEmpty />
      )}
    </div>
  )
}
