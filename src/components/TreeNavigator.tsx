import { Tree } from 'antd'
import TreeEmpty from './TreeEmpty'

export default function TreeNavigator({ data, handleNodeClick }: { data: any; handleNodeClick: any }) {
  const onSelect = (selectedKeys: any, info: any) => {
    // eslint-disable-next-line no-console
    console.log('selected', selectedKeys, info)
    handleNodeClick(info.node)
  }

  // eslint-disable-next-line no-console
  console.log(data)

  return (
    <div>
      {data.children ? (
        <>
          <div className="mb-1" style={{ color: 'rgba(17,24,39,1)', fontWeight: 600, fontSize: '0.875rem' }}>
            Manifest
          </div>
          <Tree
            showLine={{ showLeafIcon: false }}
            autoExpandParent
            defaultExpandParent
            defaultExpandedKeys={['Root']}
            onSelect={onSelect}
            treeData={[data]}
          />
        </>
      ) : (
        <TreeEmpty />
      )}
    </div>
  )
}
