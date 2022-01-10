import { ReactElement, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DuplicateIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'

interface Props {
  value: string
}

export default function ClipboardCopy({ value }: Props): ReactElement {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => setCopied(!copied)

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="align-middle inline-flex items-center px-2 py-0.5 text-xm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
    >
      <CopyToClipboard text={value}>
        {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <DuplicateIcon className="h-4 w-4" />}
      </CopyToClipboard>
    </button>
  )
}
