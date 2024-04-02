import { format } from "date-fns"
import Cookies from "js-cookie"

export const cookieOptions = {
  path: "/",
  maxAge: 864 * 100,
  secure: true,
}

// + Function To Validate Mobile Number of Bangladesh
export const validateBangladeshMobileNumber = (input: string): { status: boolean; message: string } => {
  const bangladeshMobileNumberRegex = /^(\+?8801|01)[1-9][0-9]{8}$/

  if (input?.trim().length === 0) {
    return { status: false, message: "This field is required!" }
  } else {
    if (bangladeshMobileNumberRegex.test(input)) {
      return { status: true, message: "" }
    } else {
      return { status: false, message: "Invalid Phone Number!" }
    }
  }
}

// + Function To Get Latest Date from Array of Timestamp
export function findLatestDate(timestamps: string[]): string {
  // Given input should be in this format "2023-09-09T06:33:04"

  if (timestamps.length === 0) {
    return "No timestamps provided"
  }

  let latestDate = new Date(timestamps[0])

  for (let i = 1; i < timestamps.length; i++) {
    const currentDate = new Date(timestamps[i])

    if (currentDate > latestDate) {
      latestDate = currentDate
    }
  }

  const year = latestDate.getFullYear()
  const month = (latestDate.getMonth() + 1).toString().padStart(2, "0") // Month is 0-based
  const day = latestDate.getDate().toString().padStart(2, "0")
  return `${day}/${month}/${year}`

  // return latestDate.toISOString();
}

// + Function To Get Current Timestamp
export const getCurrentTimestamp = (): string => {
  const now = new Date()

  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, "0") // Month is 0-based
  const day = now.getDate().toString().padStart(2, "0")
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const seconds = now.getSeconds().toString().padStart(2, "0")

  const timestamp = `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`

  return timestamp
}

// + Function To Convert Timestamp To 12 Hour format
export const convertTo12HourFormat = (timestamp: string): string => {
  // Given input should be in this format "2023-09-09T06:33:04"
  const date = new Date(timestamp)

  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")

  let amOrPm = "AM"

  // Determine whether it's AM or PM
  if (hours >= 12) {
    amOrPm = "PM"
  }

  // Convert to 12-hour format
  let hours12 = hours % 12
  if (hours12 === 0) {
    hours12 = 12
  }

  const formattedTimestamp = `${hours12}:${minutes}:${seconds} ${amOrPm}`

  return formattedTimestamp
}

// + Function To Get Date from a Timestamp
export const formatDate = (inputDate: string): string => {
  // Given input should be in this format "2023-09-09T06:33:04"
  const date = new Date(inputDate)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // Month is 0-based
  const day = date.getDate().toString().padStart(2, "0")

  const formattedDate = `${day}/${month}/${year}`

  // Output: "09/09/2023"
  return formattedDate
}

// + Function To Format Date
export const formatDateString = (dateString: string, outputDataFormat = "dd-MM-yyyy") => {
  const outputFormat = outputDataFormat
  const dateObj = new Date(dateString)
  return format(dateObj, outputFormat)
}

// + Function To Get Day Difference from The Given Date Time
export const calculateDaysDifference = (inputDate: string): number => {
  // Given input should be in this format "2023-09-09T06:33:04"

  const currentDate = new Date() // Get the current date
  const targetDate = new Date(inputDate) // Convert the input date string to a Date object

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate.getTime() - currentDate.getTime()

  // Calculate the number of days by dividing milliseconds by milliseconds per day
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  return daysDifference
}

// + Function To Convert a String into Slug
export const slugify = (str: string): string => {
  const slug = str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9&-]/g, "-") // Replace non-alphanumeric characters with dashes

  return slug
}

// + Function To Get Data From Service Worker Cache
export const getServiceWorkerCachedData = async (
  cacheStorageName: string,
  cacheName: string
): Promise<any | null> => {
  try {
    const cache = await caches.open(cacheStorageName)
    const response = await cache.match(cacheName)

    if (response) {
      const cachedData = await response.json()
      return cachedData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching cached data:", error)
    return null
  }
}

// + Function To Cache Data on Service Worker
export const cacheDataOnServiceWorker = (cacheStorageName: string, cacheName: string, data: any) => {
  caches.open(cacheStorageName).then((cache) => {
    cache.put(cacheName, new Response(JSON.stringify(data)))
  })
}

// + Function to open the IndexedDB database
export const openIndexedDatabase = async (databaseName: string) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1)

    request.onerror = (event) => {
      if (event.target != null) {
        const idbRequest = event.target as IDBRequest
        console.error("Error opening database:", idbRequest.error)
        reject(idbRequest.error)
      }
    }

    request.onsuccess = (event) => {
      if (event.target != null) {
        const idbRequest = event.target as IDBRequest
        const db = idbRequest.result
        resolve(db)
      }
    }

    request.onupgradeneeded = (event) => {
      if (event.target != null) {
        const idbRequest = event.target as IDBRequest
        const db = idbRequest.result

        // Create an object store (if it doesn't exist)
        if (!db.objectStoreNames.contains(databaseName)) {
          db.createObjectStore(databaseName, { keyPath: "id" })
        }
      }
    }
  })
}

// + Function To Add data to IndexedDB
export const addDataToIndexedDB = async (databaseName: string, data: any) => {
  const db: any = await openIndexedDatabase(databaseName)

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([databaseName], "readwrite")
    const store = transaction.objectStore(databaseName)
    console.log("Debug", store)
    const request = store.add(data)

    request.onsuccess = () => {
      resolve("Data added successfully.")
    }

    request.onerror = (event: any) => {
      console.error("Error adding data:", event.target.error)
      reject(event.target.error)
    }
  })
}

// + Function To Get all data from IndexedDB
export const getDataFromIndexedDB = async (databaseName: string) => {
  const db: any = await openIndexedDatabase(databaseName)

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([databaseName], "readonly")
    const store = transaction.objectStore(databaseName)
    const request = store.getAll()

    request.onsuccess = (event: any) => {
      resolve(event.target.result)
    }

    request.onerror = (event: any) => {
      console.error("Error getting data:", event.target.error)
      reject(event.target.error)
    }
  })
}

// + Function To Remove data from IndexedDB by key
export const removeDataFromIndexedDB = async (databaseName: string, key: string) => {
  const db: any = await openIndexedDatabase(databaseName)

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([databaseName], "readwrite")
    const store = transaction.objectStore(databaseName)
    const request = store.delete(key)

    request.onsuccess = () => {
      resolve("Data deleted successfully.")
    }

    request.onerror = (event: any) => {
      console.error("Error deleting data:", event.target.error)
      reject(event.target.error)
    }
  })
}

export const getAPIResponse = async (
  basePath: string,
  apiPath: string,
  token: string | null = null,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body: FormData | string | null = null,
  addMultipartHeader = false,
  revalidationTime = 0 //Cache the data that is fetched for 1 second
) => {
  const headers: Record<string, string> = {
    ...(token ? { Authorization: token } : {}),
    "Access-Control-Allow-Origin": "*",
  }

  if (body) {
    if (body instanceof FormData && addMultipartHeader) {
      // If body is a FormData object, set Content-Type to multipart/form-data
      headers["Content-Type"] = "multipart/form-data"
    } else if (typeof body === "string") {
      // If body is a string, assume it's JSON and set Content-Type to application/json
      headers["Content-Type"] = "application/json"
    }
  }

  const apiHeader = {
    method: `${method}`,
    headers: headers,
    body: body != null ? body : null,
  }

  if (revalidationTime == 0) {
    // Adding ts-ignore because the next property is not defined in the type definition file
    /* @ts-ignore */
    apiHeader["next"] = { cache: "no-store" } //Disable Cache;
  } else {
    /* @ts-ignore */
    apiHeader["next"] = { revalidate: revalidationTime } //Cache the data that is fetched for 1 second
  }

  console.log(apiHeader)
  const results = await fetch(`${basePath + apiPath}`, apiHeader)
  return results.json()
}

/**
 * * Remove all cookies using this function
 */
export const removeAllCookies = () => {
  const cookies = Cookies.get()
  for (const cookieName in cookies) {
    Cookies.remove(cookieName)
  }
}

export const tableURLWithParams = (basePath: string, apiPath: string, token: string) => {
  console.log(basePath + apiPath)
  return {
    apiUrl: `${basePath}${apiPath}`,
    headerOptions: {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: String(token),
      },
    },
  }
}
