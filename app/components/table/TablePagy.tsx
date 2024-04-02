"use client"

import type { MRT_ColumnDef } from "material-react-table"
import MaterialReactTable from "material-react-table"
import { memo, useEffect, useMemo, useRef, useState, Fragment } from "react"
import Button from "../global/Button"
import ButtonIcon from "../global/ButtonIcon"
import Flyout from "../Flyout"
import { createTheme, PaletteColorOptions, ThemeProvider, useTheme } from "@mui/material"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import variables from "@variables/variables.module.scss"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { utils, writeFile } from "xlsx"
import Icon from "../global/Icon"
import { ModelObjectProps } from "./ApiResponseProps"
import { PrintProps, TableComponentProps } from "./TableProps"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useRouter } from "next/navigation"
import { v4 as uuid } from "uuid"

export const printDefaultConfig: PrintProps = {
  enablePrint: true,
  enablePdf: true,
  enableCsv: false,
  enableExcel: true,
  fileName: "table",
}

const TablePagy = memo(function Component({
  columnHeadersLabel,
  url,
  method = "GET",
  body = null,
  enableRowSelection = false,
  enableRowNumbers = false,
  addPaginationIndexToUrl = false,
  manualSorting = false,
  enableGlobalFilter = false,
  enablePagination = true,
  rawData = [],
  sizeName = "size",
  startName = "start",
  totalRowName = "total_row",
  pageSize = 10,
  rowPerPageOptions = [10, 20, 50, 100, 150, 200, 300, 500, 1000],
  onRowClick,
  onRowSelectionChange,
  printOptions = { ...printDefaultConfig },
  onLoading,
  density = "comfortable",
  dataAccessorKey = "results",
  queryParameters,
  redirectLinks,
}: TableComponentProps) {
  const router = useRouter()
  const componentRef = useRef(null)
  const globalTheme = useTheme()
  const columnHeaders = useMemo<MRT_ColumnDef<ModelObjectProps>[]>(
    () => columnHeadersLabel,
    [columnHeadersLabel]
  )
  const primaryColor: PaletteColorOptions = {
    light: variables.primary100,
    main: variables.primary500,
    dark: variables.primary700,
    contrastText: variables.gray200,
  }
  // * table theme config
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: primaryColor, //swap in the secondary color as the primary for the table
          info: {
            main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "#fff" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
        },
        typography: {
          fontFamily: "inherit",
          allVariants: {
            color: `${variables.gray500}`,
          },
          button: {
            textTransform: "none",
            fontSize: ".875rem",
          },
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: `${variables.gray100} !important`,
                overflow: "initial !important",
                zIndex: "initial !important",
              },
            },
          },

          // * Main Table [Parent]
          MuiPaper: {
            styleOverrides: {
              elevation: {
                boxShadow: "none !important",
                borderRadius: "8px !important",
                border: `1px solid ${variables.gray200} !important`,
                overflow: "hidden",
              },
            },
          },

          MuiTableRow: {
            styleOverrides: {
              root: {
                boxShadow: "none !important",
              },
            },
          },
          // MuiTableHead: {
          // 	styleOverrides: {
          // 		root: {
          // 			fontWeight: '500',
          // 			backgroundColor: 'red !important',
          // 		},
          // 	},
          // },
          MuiTableCell: {
            styleOverrides: {
              stickyHeader: {
                fontWeight: "400 !important",
                fontSize: ".75rem",
                textTransform: "uppercase",
                color: `${variables.gray500}`,
                letterSpacing: "2px",
              },
              head: {
                backgroundColor: `${variables.gray100} !important`,
              },
              body: {
                color: `${variables.gray700}`,
                borderColor: `${variables.gray200}`,
                boxShadow: "none",
                fontSize: "1rem",
                fontWeight: "400",
              },
            },
          },

          // * FORMS //
          MuiFormControl: {
            styleOverrides: {
              root: {
                fontFamily: "inherit",
                color: `${variables.gray400}`,
                letterSpacing: "0",
              },
            },
          },
          //  - Input //
          MuiInputBase: {
            styleOverrides: {
              root: {
                ":hover": {
                  ":before": {
                    // borderColor: `${variables.primary500} !important`,
                    borderBottom: `1px solid ${variables.primary500} !important`,
                  },
                },
                ":after": {
                  // borderColor: `${variables.primary500} !important`,
                  borderBottom: `1px solid ${variables.primary500} !important`,
                },
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              input: {
                ":focus": {
                  borderColor: "transparent !important",
                  outline: "none !important",
                  boxShadow: "none !important",
                },
                ":hover": {
                  borderColor: `${variables.primary500} !important`,
                },
              },
            },
          },

          MuiDivider: {
            styleOverrides: {
              fullWidth: {
                borderColor: `{variables.primary500} !important`,
              },
              root: {
                borderColor: `{variables.primary500} !important`,
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                color: `${variables.primary500}`,
                backgroundColor: `${variables.gray200}`,
                outline: "none",
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: ".875rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              track: {
                backgroundColor: `${variables.primary300} !important`,
              },
              thumb: {
                color: `${variables.primary500}`,
              },
            },
          },
        },
      }),
    [globalTheme]
  )
  const defaultColumn = { minSize: 40, maxSize: 1000, size: 180 }
  const [globalFilter, setGlobalFilter] = useState("")

  const [rowCount, setRowCount] = useState(0)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRowArray, setSelectedRowArray] = useState<any>([])
  const [selectedData, setSelectedData] = useState<{ row: never[] | {}; data: never[]; pageIndex: number }[]>(
    []
  )
  const [rowData2, setRowData2] = useState<any>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  })

  /**
   * This function exports Material Table data in the specified format (CSV or PDF).
   * It takes into account various print options for better customization.
   *
   * @param {("excel" | "csv" | "pdf")} format - The desired export format, either "csv" or "pdf". Defaults to "csv".
   */
  const exportData = (format: "excel" | "csv" | "pdf" = "excel") => {
    if (format === "excel") {
      // Create a new workbook object
      const workbook = utils.book_new()

      // Convert the data array to an array of arrays, including headers
      const dataWithHeaders = [
        columnHeaders.map((col) => col.header ?? col.accessorKey),
        ...data.map((row: any) => columnHeaders.map((col) => row[col.accessorKey ?? col.header] ?? "")),
      ]

      // Create a new worksheet from the data with headers
      const worksheet = utils.aoa_to_sheet(dataWithHeaders)

      // Append the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, "Sheet1")

      // Write the workbook to an XLSX file and trigger a download

      writeFile(workbook, printOptions.fileName + ".xlsx" ?? "table-data.xlsx", {
        bookType: "xlsx",
      })
    } else if (format === "csv") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,
      const csvContent: ModelObjectProps[] = data
        .map((row: any) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          columnHeaders
            .map((col: any) => {
              // escape comma if it is in the value
              console.log(col.accessorKey)
              console.log(row)

              console.log(row[col.accessorKey ?? col.header])
              const headerItem = row[col.accessorKey ?? col.header]
                ? String(row[col.accessorKey ?? col.header]).replace(/,/g, " ")
                : ""

              console.log(headerItem)
              return headerItem
            })
            .join(",")
        )
        .join("\n")
      console.log(csvContent)
      const header = columnHeaders.map((col) => col.header).join(",") + "\n"
      console.log(header)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const mergedData = header + csvContent
      const csvData = new Blob([mergedData], {
        type: "text/csv;charset=utf-8;",
      })
      console.log("Here")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      saveAs(csvData, printOptions.fileName + ".csv" ?? "table-data" + ".csv")
    } else if (format === "pdf") {
      // Parse the CSV data into an array of objects
      const headers: string[] = columnHeaders.map((col) => {
        //length of the header text is long, then make ellipsis
        const headerText = col.header ?? col.accessorKey
        return headerText
      })

      //get the number of header items
      const headerLength = headers.length

      const printOrientation = printOptions.pdfOptions?.pdfOrientation
        ? printOptions.pdfOptions?.pdfOrientation
        : headerLength > 7
          ? "landscape"
          : "portrait"

      const pdfDmn = printOptions.pdfOptions?.pdfDimensions
        ? printOptions.pdfOptions?.pdfDimensions
        : headerLength > 20
          ? [3508, 2480]
          : [841.89, 595.28]

      const doc = new jsPDF(printOrientation, "pt", pdfDmn)

      const fontSize = printOptions.pdfOptions?.pdfFontSize
        ? printOptions.pdfOptions?.pdfFontSize
        : headerLength > 20
          ? 8
          : 12
      doc.setFontSize(fontSize)

      const dataItems: string[] = data.map((row: any) => {
        const rowItem = columnHeaders.map((col, index) => {
          const rowData = row[col.accessorKey ?? col.header] ? String(row[col.accessorKey ?? col.header]) : ""
          return rowData
        })
        return rowItem
      })

      // as we have too much data, we need to split the data into different pages
      // split data object for 50 rows per page
      const dataChunk = fontSize > 8 ? 50 : 100
      const dataLength = dataItems.length
      const pageCount = Math.ceil(dataLength / dataChunk)
      for (let i = 0; i < pageCount; i++) {
        // create a page
        if (i > 0) {
          doc.addPage()
        }
        // add table header
        autoTable(doc, {
          head: [headers],
          body: dataItems as any,
          startY: 60,
          // theme: "grid",
          styles: {
            fontSize: fontSize,
            // cellPadding: 1,
            // cellWidth: "wrap",
            overflow: "linebreak",
          },
        })
      }
      doc.save(printOptions.fileName + ".pdf" ?? "table-data" + ".pdf")
    }
  }

  // * flyout items & state management
  const [isDownloadFlyoutOpen, setIsDownloadFlyoutOpen] = useState(false)
  const flyOutItems = () => {
    let childrenItems: any = []

    if (printOptions.enablePdf) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download PDF"
          clicked={() => void exportData("pdf")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      )
    }
    if (printOptions.enableCsv) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download CSV"
          clicked={() => void exportData("csv")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      )
    }
    if (printOptions.enableExcel) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download Excel"
          clicked={() => void exportData("excel")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      )
    }
    return childrenItems
  }

  // + table pagy data fetcher function
  const fetchData = async () => {
    if (!url) {
      // => pagination of raw data (TBD)
      // return rawData

      console.log("rawData", rawData)
      setRowCount(rawData.length)

      return enablePagination && rawData.length > 0
        ? rawData.slice(
            pagination.pageIndex * pagination.pageSize,
            (pagination.pageIndex + 1) * pagination.pageSize
          )
        : rawData
    }

    const apiUrl = new URL(url.apiUrl + `${addPaginationIndexToUrl ? `/${pagination.pageIndex + 1}` : ""}`)
    apiUrl.searchParams.set(
      startName,
      `${startName == "start" ? pagination.pageIndex * pagination.pageSize : pagination.pageIndex}`
    )
    apiUrl.searchParams.set(sizeName, `${pagination.pageSize}`)

    try {
      console.log(url)
      const options: RequestInit = {
        ...url.headerOptions,
        method: method,
        next: { revalidate: 0 },
        body: body ? JSON.stringify(body) : null,
      }

      const response = await fetch(apiUrl.href, options)

      if (process.env.NODE_ENV === "production" && response.status !== 200) {
        // * redirect to error page based on response status in production
        console.error(
          "TablePagy response status >>> ",
          response.status,
          " TablePagy response >>> ",
          response.text()
        )

        router.push(redirectLinks?.[response.status] ?? `/error?code=${response.status}`)
      } else if (process.env.NODE_ENV === "development" && response.status !== 200) {
        // * just log in development
        console.error(
          "TablePagy response status >>> ",
          response.status,
          " TablePagy response >>> ",
          response.text()
        )
      }

      const json = await response.json()
      console.log("Fetched data of TablePagy >>> ", json)

      const isExpectedDataDefined =
        dataAccessorKey?.split(".").reduce((acc, key) => acc?.[key], json) !== undefined

      if (isExpectedDataDefined) {
        // * if response is successful and the response returns data, then return the data
        setRowCount(json[totalRowName])

        // accessing nested object using dot notation
        return dataAccessorKey.split(".").reduce((acc, key) => {
          return acc[key]
        }, json) as any[]
      } else {
        // * if response is successful but the response returns no data, then return empty array
        setRowCount(0)
        return []
      }
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const qk = [uuid()] /** unique quey key if no query keys provided */

  // * defaults query parameters for useQuery hook
  const mergedQueryParameters = {
    enabled: url != undefined || rawData.length > 0,
    retry: 3,
    refetchInterval: 1000 * 60 * 5, // 5 mins
    ...queryParameters, // above queryKey will be overwritten by this parameter, below ones will be appended
    queryKey: [
      ...(queryParameters?.queryKey.length ? queryParameters.queryKey : qk),
      pagination.pageIndex,
      pagination.pageSize,
      // sorting
    ],
    queryFn: fetchData,
    placeholderData: (previousData: any) => previousData ?? [],
    ...(rawData.length ? { initialData: rawData } : {}),
  }

  // + useQuery hook for fetching data
  const { data, isError, isLoading, isRefetching, isFetching, isPending, status, fetchStatus } = useQuery({
    ...mergedQueryParameters,
  })

  // * defining array length as per to total page number to store each page selected row index
  useEffect(() => {
    if (pagination.pageIndex > 0) {
      for (let index = 0; index < pagination.pageIndex; index++) {
        setSelectedData((prev) => {
          return [...prev, { row: [], data: [], pageIndex: index }]
        })
      }
    }
  }, [pagination.pageIndex])

  // * storing selected row id
  useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection, data, selectedRowArray)
    }
    if (selectedData.length > 0) {
      selectedData.map((dataSelected, index) => {
        if (index == pagination.pageIndex) {
          if (rowSelection) {
            selectedData[index]["row"] = rowSelection
            selectedData[index]["data"] = rowData2
          }
        }
      })
    }

    let arrayData: any = []
    // storing row data to data array
    if (rowSelection) {
      Object.keys(rowSelection).map((row, index) => {
        data?.filter((dataObj: any, id: any) => {
          if (id == parseInt(row)) {
            setRowData2((prev: any) => {
              return [...prev]
            })
            arrayData.push(dataObj)
            if (arrayData.length > 0) {
              setRowData2(arrayData)
            }
          }
        })
      })
    }
  }, [rowSelection])

  // * appending stored row data to main array
  useEffect(() => {
    if (selectedData.length > 0) {
      selectedData.map((dataSelected, index) => {
        if (index == pagination.pageIndex) {
          if (rowSelection) {
            selectedData[index]["data"] = rowData2
          }
        }
      })
    }

    if (selectedData && selectedData.length > 0) {
      setSelectedRowArray([])

      selectedData.map((data, index) => {
        data["data"].map((element) => {
          setSelectedRowArray((prev: any) => {
            return [...prev, element]
          })
        })
      })
    }
  }, [rowData2])

  // * while page changing,getting a specific page selected row id and data from the page specific index
  useEffect(() => {
    if (selectedData && rowSelection && pagination) {
      selectedData.map((data, index) => {
        if (selectedData[index]["pageIndex"] == pagination.pageIndex) {
          setRowSelection(selectedData[index]["row"])
          setRowData2(selectedData[index]["data"])
        }
      })
    }
  }, [pagination])

  // * returning rowSelection(selected row's index),data(full dataset),selectedRowArray(selected rows data) to the parent
  useEffect(() => {
    if (onRowSelectionChange) {
      let indexes = Object.keys(rowSelection)
      onRowSelectionChange(rowSelection, data, selectedRowArray)
    }
  }, [selectedRowArray])

  // * returning loading state to the parent via callback
  useEffect(() => {
    onLoading?.(isLoading)
  }, [isLoading, onLoading])

  // * flyout close on outside click handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", () => {
        if (isDownloadFlyoutOpen) {
          setIsDownloadFlyoutOpen(false)
        }
      })
    }
  }, [isDownloadFlyoutOpen])

  // * refetching data when pagination or page size changes
  // useEffect(() => {
  //   if (!rawData.length && url) {
  //     fetchData()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pagination.pageIndex, pagination.pageSize])

  //=> sorting Via API (TBD)
  // useEffect(() => {
  //   if (manualSorting && !rawData.length) {
  //     fetchData()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sorting])

  // useEffect(() => {
  //   // ! Use this useEffects to handle globalFilter via the API using fetch method. TBD
  //   console.log(globalFilter)
  // }, [globalFilter])

  // + return skeleton loader on loading state
  if (!data.length && isLoading)
    return (
      <div className="rounded-md border">
        {/* // + header */}
        <div className="space-y-10 overflow-hidden border-b bg-slate-100 px-10 py-16">
          <div className="grid lg:grid-cols-2">
            {/* // - error text */}
            <div className="hidden lg:block">
              <Skeleton height={20} width={520} />
            </div>
            {/* // - buttons */}
            <div className="flex justify-end">
              <Skeleton
                containerClassName="flex gap-8"
                className="rounded-md"
                width={20}
                height={20}
                count={5}
              />
            </div>
          </div>

          {/* // - column headers */}
          <div className="flex gap-20 overflow-hidden pt-6">
            {columnHeaders.map(() => {
              return (
                <Fragment key={uuid()}>
                  <div className="flex w-full items-center justify-between space-x-8">
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={20} className="mr-10" enableAnimation={false} />
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* // + content */}
        <div className="flex gap-20 overflow-hidden px-10 py-16">
          {columnHeaders.map(() => {
            const randomWidth = () => {
              const min = 70
              const max = 150

              return Math.floor(Math.random() * (max - min + 1)) + min
            }

            return (
              <Fragment key={uuid()}>
                <div className="flex w-full items-center justify-between space-x-8">
                  <Skeleton
                    height={12}
                    width={randomWidth()}
                    count={6}
                    className="!rounded-3xl"
                    containerClassName="flex flex-col gap-12"
                  />
                  {/* // - hidden to match layout */}
                  <Skeleton
                    height={20}
                    width={20}
                    className="mr-10 !bg-transparent"
                    enableAnimation={false}
                  />
                </div>
              </Fragment>
            )
          })}
        </div>

        {/* // + footer */}
        <div className="border-t bg-slate-100">
          <div className="px-10 py-16">
            <div className="flex items-center justify-end space-x-16 overflow-auto">
              <Skeleton height={20} width={130} />
              <Skeleton height={20} width={40} />
              <Skeleton height={20} width={60} />
              <Skeleton height={20} width={20} />
              <Skeleton height={20} width={20} />
            </div>
          </div>
        </div>
      </div>
    )

  // + return table on success
  return (
    data && (
      <>
        <div ref={componentRef}>
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columnHeaders}
              data={data}
              defaultColumn={defaultColumn}
              enableColumnOrdering={true}
              enableColumnFilters={true}
              enablePagination={enablePagination}
              enableRowSelection={enableRowSelection}
              enableRowNumbers={enableRowNumbers} //needed for lazy loading
              muiTablePaginationProps={{
                rowsPerPageOptions: enableRowSelection ? [] : rowPerPageOptions,
                showFirstButton: false,
                showLastButton: false,
              }}
              renderTopToolbarCustomActions={() => {
                const items: Array<any> = flyOutItems()

                return (
                  <div className="flex w-full justify-end">
                    {printOptions.enablePrint && (
                      <>
                        <Flyout
                          controllingComponent={[
                            <ButtonIcon
                              key={uuid()}
                              iconName="download-01"
                              iconColor={variables.gray400}
                              className="!relative !top-6 !mr-6"
                              clicked={() => {
                                if (!isDownloadFlyoutOpen) {
                                  setIsDownloadFlyoutOpen(true)
                                } else {
                                  setIsDownloadFlyoutOpen(false)
                                }
                              }}
                            />,
                          ]}
                          isOpen={isDownloadFlyoutOpen}
                          items={items}
                        />
                      </>
                    )}
                  </div>
                )
              }}
              // getRowId={(row) => row.id}
              initialState={{ showColumnFilters: false, density: density }}
              manualFiltering={false}
              manualPagination
              manualSorting={manualSorting}
              muiToolbarAlertBannerProps={
                isError
                  ? {
                      color: "error",
                      children: "An error occurred while loading data. Please try again later.",
                    }
                  : undefined
              }
              onPaginationChange={setPagination}
              globalFilterModeOptions={["fuzzy", "startsWith"]}
              onSortingChange={(e) => {
                setSorting(e)
              }}
              onRowSelectionChange={(e) => {
                console.log("Selected row value", e, "Selected row array", selectedRowArray)
                setRowSelection(e)
              }}
              rowCount={rowCount}
              muiTableBodyRowProps={({ row }) => ({
                onClick: (event) => {
                  // if (!enableRowSelection) {
                  onRowClick?.(row)
                  // }
                },
                sx: {
                  cursor: "pointer", //you might want to change the cursor too when adding an onClick
                },
              })}
              // muiLinearProgressProps={({ isTopToolbar }) => ({
              //   color: "primary",
              //   variant: "determinate",
              // })}
              state={{
                // columnFilters,
                // globalFilter,
                isLoading: isFetching,
                showProgressBars: isRefetching,
                pagination,
                showAlertBanner: isError,
                sorting,
                rowSelection,
              }}
              enableColumnResizing={true}
              enableStickyHeader={true}
              enablePinning={true}
              columnResizeMode="onChange"
              enableGrouping={true}
              enableGlobalFilter={enableGlobalFilter}
              enableGlobalFilterModes={true}
              onGlobalFilterChange={setGlobalFilter}
              icons={{
                ArrowDownwardIcon: (props: any) => <Icon iconName="chevron-up" {...props} iconSize="16" />,
                FullscreenIcon: (props: any) => <Icon iconName="maximize-02" {...props} />,
                FullscreenExitIcon: (props: any) => <Icon iconName="minimize-02" {...props} />,
                ViewColumnIcon: (props: any) => <Icon iconName="columns-03" {...props} />,
                DragHandleIcon: (props: any) => <Icon iconName="menu-05" {...props} />,
                MoreHorizIcon: (props: any) => <Icon iconName="dots-horizontal" {...props} />,
                MoreVertIcon: (props: any) => <Icon iconName="dots-vertical" {...props} />,
                DensityLargeIcon: (props: any) => <Icon iconName="rows-03" {...props} />,
                DensityMediumIcon: (props: any) => <Icon iconName="rows-03" {...props} />,
                DensitySmallIcon: (props: any) => <Icon iconName="rows-03" {...props} />,
                CloseIcon: (props: any) => <Icon iconName="x" {...props} />,
                SaveIcon: (props: any) => <Icon iconName="save-02" {...props} />,
                SearchIcon: (props: any) => <Icon iconName="search-lg" {...props} />,
                // FilterAltIcon: (props: any) => <Icon iconName='filter-line' {...props} />,
                // FilterListOffIcon: (props: any) => <Icon iconName='equal-not' {...props} />,
              }}
            />
          </ThemeProvider>
        </div>
      </>
    )
  )
})

export default TablePagy
