import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  profileBanner: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('banner uploaded', file.url, 'by', metadata.userId)
    }),

  profileLogo: f({
    image: { maxFileSize: '2MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('logo uploaded', file.url, 'by', metadata.userId)
    }),

  serviceBanner: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('service banner uploaded', file.url, 'by', metadata.userId)
    }),

  serviceThumbnail: f({
    image: { maxFileSize: '2MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('service thumbnail uploaded', file.url, 'by', metadata.userId)
    }),

  serviceImages: f({
    image: { maxFileSize: '4MB', maxFileCount: 4 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('service image uploaded', file.url, 'by', metadata.userId)
    }),

  eventThumbnail: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('event thumbnail uploaded', file.url, 'by', metadata.userId)
    }),

  eventBanner: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('event banner uploaded', file.url, 'by', metadata.userId)
    }),

  contactAttachment: f({
    image: { maxFileSize: '8MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('contact image uploaded', file.url, 'by', metadata.userId)
    }),

  contactAttachmentDoc: f({
    blob: { maxFileSize: '8MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('contact document uploaded', file.url, 'by', metadata.userId)
    }),

  messageImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 10 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('message image uploaded', file.url, 'by', metadata.userId)
    }),

  messageFile: f({
    blob: { maxFileSize: '10MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      return { userId: 'anonymous' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('message file uploaded', file.url, 'by', metadata.userId)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
