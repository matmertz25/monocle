import { ReactElement, useState, useCallback, useEffect } from 'react'
import Tree from 'react-d3-tree'
import GraphNode from './GraphNode'
import { RefreshIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, PlusIcon, MinusIcon } from '@heroicons/react/solid'
import { classNames } from '../utils'

export default function Graph({
  initialDepth,
  data,
  activeNode,
  handleNodeClick,
}: {
  initialDepth: number
  data: any
  activeNode: any
  handleNodeClick: any
}): ReactElement {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [pathStyle, setPathStyle] = useState<'diagonal' | 'step' | 'straight'>('diagonal')
  const [translateX, setTranslateX] = useState<number>(200)
  const [translateY, setTranslateY] = useState<number>(300)
  const [zoom, setZoom] = useState<number>(1)

  useEffect(() => {
    setZoom(data?.children?.length > 4 ? 0.7 : 1)
  }, [data])

  const treeWrapper = useCallback(
    node => {
      if (node !== null) {
        setTranslateX(node.getBoundingClientRect().width / (orientation === 'horizontal' ? 6 : 2))
        setTranslateY(node.getBoundingClientRect().height / (orientation === 'horizontal' ? 2 : 6))
      }
    },
    [orientation],
  )

  const countNodes = (n: any, count = 0) => {
    // Count the current node
    count += 1

    // Base case: reached a leaf node.
    if (!n?.children || n.children.length === 0) {
      return count
    }

    // Keep traversing children while updating `count` until we reach the base case.
    const counter = n.children.reduce((child: any, sum: number) => countNodes(child, sum), count)

    return counter
  }

  return (
    <div
      ref={treeWrapper}
      id="treeWrapper"
      className="border-b border-gray-200 bg-slate-100"
      style={{
        width: '100%',
        height: 'calc(100vh - 350px)',
        position: 'relative',
      }}
    >
      <div className="flex p-4 top-1 left-1 absolute">
        <div>
          <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              onClick={() => setZoom(zoom - 0.1)}
              type="button"
              className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span className="sr-only">Minus</span>
              <MinusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setZoom(zoom + 0.1)}
              type="button"
              className="-ml-px relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span className="sr-only">Plus</span>
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </span>
        </div>
        <div className="mx-3">
          <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              onClick={() => setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')}
              type="button"
              className="relative inline-flex items-center px-2.5 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Orientation
            </button>
            <Menu as="span" className="-ml-px relative block">
              <Menu.Button className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                <span className="sr-only">Open options</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <h3
                      className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      id="projects-headline"
                    >
                      Path Style
                    </h3>
                    <Menu.Item key="diagonal">
                      <div
                        onClick={() => setPathStyle('diagonal')}
                        className={classNames(
                          pathStyle === 'diagonal' ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer',
                        )}
                      >
                        <span className="truncate">Diagonal</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item key="step">
                      <div
                        onClick={() => setPathStyle('step')}
                        className={classNames(
                          pathStyle === 'step' ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer',
                        )}
                      >
                        <span className="truncate">Step</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item key="straight">
                      <div
                        onClick={() => setPathStyle('straight')}
                        className={classNames(
                          pathStyle === 'straight' ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer',
                        )}
                      >
                        <span className="truncate">Straight</span>
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </span>
        </div>
      </div>
      <Tree
        data={data}
        initialDepth={initialDepth}
        orientation={orientation}
        collapsible={true}
        zoomable={true}
        scaleExtent={{ min: 0.1, max: 1 }}
        zoom={zoom}
        translate={{ x: translateX, y: translateY }}
        pathFunc={pathStyle}
        separation={{
          siblings: orientation === 'horizontal' ? 1 : 2,
          nonSiblings: orientation === 'horizontal' ? 2 : 1,
        }}
        renderCustomNodeElement={rd3tProps => GraphNode(rd3tProps, handleNodeClick, orientation, activeNode)}
      />
    </div>
  )
}
