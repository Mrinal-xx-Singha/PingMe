import React from 'react'
import {ExternalLink} from "lucide-react"

const LinkPreviewCard = ({preview}) => {
    if(!preview)return null


  return (
    <a
    href={preview.url}
    target='_blank'
    rel='noopener noreferrer'
    className='block mt-2 rounded-lg border border-base-300 overflow-hidden hover:shadow-md transition-shadow bg-base-100 max-w-[280px]'
    >
        {preview.image && (
            <img 
            src={preview.image}
            alt=''
            className='w-full h-32 object-cover'
            />
        )}
        <div className="p-3">
            <h4 className="font-semibold text-sm line-clamp-2">
                {preview.title}
            </h4>
            {preview.description && (
                <p
                className='text-xs text-base-content/60 mt-1 line-clamp-2'
                >{preview.description}</p>
            )}
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <ExternalLink size={12}/>
                <span
                className='truncate'
                >{new URL(preview.url).hostname}</span>
            </div>
        </div>

    </a>
  )
}

export default LinkPreviewCard