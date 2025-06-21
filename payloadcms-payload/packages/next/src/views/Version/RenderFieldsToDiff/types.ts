import type { I18nClient } from '@payloadcms/translations'
import type { ClientField, SanitizedFieldPermissions } from 'payload'
import type { DiffMethod } from 'react-diff-viewer-continued'

import type { DiffComponents } from './fields/types.js'

export type Props = {
  readonly comparison: Record<string, any>
  readonly diffComponents: DiffComponents
  readonly fieldPermissions:
    | {
        [key: string]: SanitizedFieldPermissions
      }
    | true
  readonly fields: ClientField[]
  readonly i18n: I18nClient
  readonly locales: string[]
  readonly version: Record<string, any>
}

export type FieldDiffProps = {
  diffMethod: DiffMethod
  field: ClientField
  isRichText: boolean
} & Props
