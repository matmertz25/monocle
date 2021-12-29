export default function NodeEmpty() {
  return (
    <div className="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No node</h3>
      <p className="mt-1 text-sm text-gray-500">Select a node to display and edit</p>
    </div>
  )
}
