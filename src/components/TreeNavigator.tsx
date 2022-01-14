import { Tree } from 'antd'

export default function TreeNavigator({ data, handleNodeClick }: { data: any; handleNodeClick: any }) {
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
    <>
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
  )
}
