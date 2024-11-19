'use client';

import { Category } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createNews } from '@/app/lib/actions';
import { useState } from 'react';

export default function Form({ categories }: { categories: Category[] }) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form action={createNews}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter news title"
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            placeholder="Enter news content here..."
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Attachments
          </label>
          <input
            type="file"
            multiple
            accept=".docx,.xlsx,.pptx,.pdf,image/*,video/*"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList) {
                setFiles(Array.from(fileList));
              }
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#e8eff6] file:text-[#2a4a62]
              hover:file:bg-[#cddeea]"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/news"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Publish News</Button>
      </div>
    </form>
  );
} 