import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Field, TabAsField } from '../../config/types.js'

import { promise } from './promise.js'

type Args<T> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: T
  /**
   * The original data (not modified by any hooks)
   */
  doc: T
  fields: (Field | TabAsField)[]
  global: null | SanitizedGlobalConfig
  id?: number | string
  operation: 'create' | 'update'
  overrideAccess: boolean
  path: (number | string)[]
  req: PayloadRequest
  schemaPath: string[]
  siblingData: JsonObject
  /**
   * The original siblingData (not modified by any hooks)
   */
  siblingDoc: JsonObject
}

export const traverseFields = async <T>({
  id,
  collection,
  context,
  data,
  doc,
  fields,
  global,
  operation,
  overrideAccess,
  path,
  req,
  schemaPath,
  siblingData,
  siblingDoc,
}: Args<T>): Promise<void> => {
  const promises = []
  fields.forEach((field, fieldIndex) => {
    promises.push(
      promise({
        id,
        collection,
        context,
        data,
        doc,
        field,
        fieldIndex,
        global,
        operation,
        overrideAccess,
        parentPath: path,
        parentSchemaPath: schemaPath,
        req,
        siblingData,
        siblingDoc,
      }),
    )
  })
  await Promise.all(promises)
}
