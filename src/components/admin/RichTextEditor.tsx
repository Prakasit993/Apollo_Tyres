'use client'

import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
        ],
    }

    return (
        <div className={className}>
            <style jsx global>{`
                .ql-container {
                    font-family: inherit;
                    font-size: 1rem;
                    min-height: 300px;
                }
                .ql-editor {
                    min-height: 300px;
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="bg-white rounded-md"
            />
        </div>
    )
}
