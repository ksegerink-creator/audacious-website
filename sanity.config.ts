import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  name: 'audacious-studio',
  title: 'Audacious CMS',
  projectId: 'wehjzlhm',
  dataset: 'production',
  plugins: [
    structureTool({structure}),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
})
