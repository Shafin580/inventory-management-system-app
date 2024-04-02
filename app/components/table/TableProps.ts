import { ModelObjectProps } from "./ApiResponseProps"
import { QueryKey, UndefinedInitialDataOptions } from "@tanstack/react-query"
import { MRT_DensityState, MRT_ColumnDef, MRT_Row } from "material-react-table"

export interface TableComponentProps {
  // data: ModelObjectInterface[];
  columnHeadersLabel: MRT_ColumnDef<ModelObjectProps>[]
  // defaultColumn: Object;
  url?: TableUrlParameterProps
  method?: "GET" | "POST"
  body?: any | null
  addPaginationIndexToUrl?: boolean
  onRowClick?: (event: MRT_Row<ModelObjectProps>) => void
  enableRowSelection?: boolean
  revalidationTime?: number
  onRowSelectionChange?: (event: any, data?: any, selectedData?: any) => void
  enablePagination?: boolean
  pageSize?: number
  density?: MRT_DensityState
  enableRowNumbers?: boolean
  manualSorting?: boolean
  enableGlobalFilter?: boolean
  rawData?: Array<any>
  sizeName?: string
  startName?: string
  totalRowName?: string
  printOptions?: PrintProps
  rowPerPageOptions?: Array<number>
  onLoading?: (isLoading: boolean) => void
  /**
   * @description
   * This is the key (supports deep key dot notation) that will be used to access the
   * data from the response.
   * @example
   * If the response is like this:
   * ```json
   * {
   *   "status": 200,
   *   "results": {
   *     "content": [...],
   *     "pageable": {...},
   *     "last": true,
   *     "totalPages": 1,
   *     "totalElements": 4,
   *     "size": 50,
   *     "number": 0,
   *     "first": true,
   *     "empty": false
   *   },
   *   "totalRows": null
   * }
   * ```
   * The dataAccessorKey will be `results.content`
   */
  dataAccessorKey?: string
  /**
   * @description
   * The options to pass to the useQuery hook
   * @example
   * ```tsx
   * <TablePagy
   * // other props
   *  queryParameters={{
   *   staleTime: 1000 * 60 * 5, // 5 minutes
   *   refetchOnWindowFocus: false,
   * }}
   * />
   * ```
   */
  queryParameters?: Omit<UndefinedInitialDataOptions<unknown, Error, any, QueryKey>, "queryFn">
  /**
   * @description
   * The URLs to redirect based on status codes
   */
  redirectLinks?: { default: string; [key: number]: string }
}

export interface TableUrlParameterProps {
  apiUrl: string
  headerOptions: RequestInit | undefined
}

export interface PrintProps {
  enablePrint?: boolean
  enablePdf?: boolean
  enableCsv?: boolean
  enableExcel?: boolean
  fileName?: string
  pdfOptions?: {
    pdfDimensions: number[]
    pdfFontSize: number
    pdfOrientation: "landscape" | "portrait"
  }
}
