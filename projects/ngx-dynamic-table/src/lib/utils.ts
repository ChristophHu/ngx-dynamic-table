// import * as shajs from 'sha.js'
import { Buffer } from 'buffer/' // npm install buffer

export function isMobile(): boolean {
    var ua = navigator.userAgent
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        return true
    } else {
        return false
    }
}

export function checkStateForEmptyArrays(value: any): any[] {
    if (isArray(value)) {
        return value
    } else {
        return []
    }
}

export function dateToLocalISOString(dt: Date): string {
    dt.setHours(new Date().getHours()+1)
    return dt.toISOString().substring(0,16)
}

export function dateToRamon(dt: string): string {
    if (dt.length > 0) {
        if (dt.length == 16) dt = dt.replace('T', ' ') + ':00.000'
        if (dt.length == 19) dt = dt.replace('T', ' ') + '.000'
        if (dt.length == 22) dt = dt.replace('T', ' ')
    } else {
        dt = ''
    }
    return dt
}

/*
sort an array of objects by a property
*/
export function orderBy(input: any, byProperty: string, asc?: boolean ): any {
    if (input != null && input.length > 0 && Array.isArray(input)) {
      let result = [...input]
      if (asc) result.sort((a, b) => (a[byProperty] < b[byProperty] ? -1 : 1))
      if (!asc) result.sort((a, b) => (a[byProperty] > b[byProperty] ? -1 : 1))
      return result
    }
    return []
}

export function downscaleImage(dataUrl: any, newWidth: number, imageType: any, imageArguments: any) {
    "use strict"
    var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl

    // Provide default values
    imageType = imageType || "image/jpeg"
    imageArguments = imageArguments || 0.7

    // Create a temporary image so that we can compute the height of the downscaled image.
    image = new Image()
    image.src = dataUrl
    oldWidth = image.width
    oldHeight = image.height
    newHeight = Math.floor(oldHeight / oldWidth * newWidth)

    // Create a temporary canvas to draw the downscaled image on.
    canvas = document.createElement("canvas")
    canvas.width = newWidth
    canvas.height = newHeight

    // Draw the downscaled image on the canvas and return the new data URL.
    ctx = canvas.getContext("2d")
    if (ctx) ctx.drawImage(image, 0, 0, newWidth, newHeight)
    newDataUrl = canvas.toDataURL(imageType, imageArguments)
    return newDataUrl
}

export function isUndefined(value: any): value is undefined {
    return typeof value === 'undefined'
}
  
export function isNull(value: any): value is null {
    return value === null
}

export function isNumber(value: any): value is number {
    return typeof value === 'number'
}

export function isNumberFinite(value: any): value is number {
    return isNumber(value) && isFinite(value)
}

// Not strict positive
export function isPositive(value: number): boolean {
    return value >= 0
}

export function isInteger(value: number): boolean {
    // No rest, is an integer
    return value % 1 === 0
}

export function isNil(value: any): value is null | undefined {
    return value === null || typeof value === 'undefined'
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isObject(value: any): boolean {
    return value !== null && typeof value === 'object'
}

export function isArray(value: any): boolean {
    return Array.isArray(value)
}

export function isFunction(value: any): boolean {
    return typeof value === 'function'
}

export function toDecimal(value: number, decimal: number): number {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
}

export function testFunction(cb: any) {
    console.time('duration')
    for (var i = 0; i < 1000; i++) {
        // this.funcToTest()
        cb // callbackFunction
    };
    console.timeEnd('duration')
}

// time
export function diffToNow(time: number): number {
    const now: number = ~~(new Date().getTime() / 1000)
    const diff: number = time - now
    return diff
}
export function diff() {
    const n = new Date(now() - timezoneoffset())
}

export function getLocalISO(val: string = ''): string {
    let date: Date | string
    switch(val) {
    case 'lastyear':
        date = new Date(lastyear() - timezoneoffset())
        break

    case 'year':
        date = new Date(year() - timezoneoffset())
        break

    case 'lastmonth':
        date = new Date(lastmonth() - timezoneoffset())
        break

    case 'month':
        date = new Date(month() - timezoneoffset())
        break

    case 'lastweek':
        date = new Date(lastweek() - timezoneoffset())
        break

    case 'week':
        date = new Date(week() - timezoneoffset())
        break

    case 'yesterday':
        date = new Date(yesterday() - timezoneoffset())
        break

    case 'today':
        date = new Date(today() - timezoneoffset())
        break

    case 'tomorrow':
        date = new Date(tomorrow() - timezoneoffset())
        break

    case 'now':
        date = new Date(now() - timezoneoffset())
        break

    default:
        date = new Date()
    }
    const result: string = date.toISOString().slice(0, -1).replace('T', ' ')

    return result
}

export function timezoneoffset(): any {
    return new Date().getTimezoneOffset() * 60000
}
function lastyear(): any {
    return new Date(new Date().getFullYear()-1, 0, 1)
}
function year(): any {
    return new Date(new Date().getFullYear(), 0, 1)
}
function lastmonth(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)
}
function month(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
}
function lastweek(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1) - 7
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function week(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1)
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function yesterday(): number {
    return new Date().setHours(-24,0,0,0)
}
function today(): number {
    return new Date().setHours(0,0,0,0)
}
function now(): number {
    return new Date().getTime()
}
function tomorrow(): number {
    return new Date().setHours(24,0,0,0)
}

export function dateDiffByProperty(date1: Date, date2: Date, prop: string): boolean {
    switch (prop) {
        case 'year':
            return date1.getFullYear() === date2.getFullYear()
        case 'month':
            return date1.getMonth() === date2.getMonth()
        case 'day':
            return date1.getDate() === date2.getDate()
        case 'hour':
            return date1.getHours() === date2.getHours()
        case 'minute':
            return date1.getMinutes() === date2.getMinutes()
        case 'second':
            return date1.getSeconds() === date2.getSeconds()
        default:
            return false
    }
}

// hash
// npm i sha.js
// npm i --save-dev @types/sha.js
// export function sha256Hash(value: string): string {
//     return shajs('sha256').update(value).digest('hex')
// }

// token
export function getExpiration(token: string): number {
    if (!token) return 0 
    return JSON.parse(myatob(token.split('.')[1])).exp * 1000
}
export function isExpired(token: string): boolean {
    return (getExpiration(token) - new Date().getTime()) < 0
}
export function getExpirationCount(token: string): number {
    return (getExpiration(token) - new Date().getTime())
}

// alt
export function myatob(payload: string): string {
    try {
        return atob(payload);
    } catch(e) {
        return atob(base64UrlDecode(payload))
    }
}

// alt
export function base64UrlDecode(input: string): string {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4
    if(pad) {
        if(pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding')
        }
        input += new Array(5-pad).join('=')
    }

    return input
}

// npm install buffer
export function encodeBase64(data: string): string {
    return Buffer.from(data).toString('base64')
}
export function decodeBase64(data: string): string {
    return Buffer.from(data, 'base64').toString('ascii')
}

export function getUserFromToken(token: string): string | undefined {
    let jwtarr = token.split('\.');
    let decodedPart = myatob(jwtarr[1]);
    let payload = JSON.parse(decodedPart);
  
    let val;
    let sub = payload['sub'];
    let upn = payload['upn'];
    let unique_name = payload['unique_name'];
    let persnr = payload['persnr'];
    if (persnr&&new RegExp(/[0-9]{8}.*/ig).test(persnr))
    {
      val = persnr;
    }
    else {
      
      if (!val&&sub&&new RegExp(/[0-9]{8}.*/ig).test(sub))
      {
        val = sub;
      }
        
      if (!val&&upn&&new RegExp(/[0-9]{8}.*/ig).test(upn))
      {
        if (upn.indexOf("@"))
        {
          val = upn.substring(0,upn.indexOf("@"));
        }
      }
  
         
      if (!val&&unique_name&&new RegExp(/.*(\\|\\\\\\)[0-9]{8}(-.*)?/ig).test(unique_name))
      {      
        val = unique_name.substring(unique_name.lastIndexOf("\\")+1);      
      }
    }
    
    return val;
}

// export function convertArray(arr: any[], col: string, sort: boolean = true): any {
//     if (arr) {
//         let cleared: { label: string, value: string}[] = []
//         arr.forEach(el => {
//             cleared.push({ label: el[col], value: el.id })
//         })
//         if (sort) {
//             cleared = cleared.sort((obj1, obj2) => {
//                 if (obj1.label > obj2.label) return 1
//                 if (obj1.label < obj2.label) return -1
//                 return 0
//             })
//         }
//         return cleared
//     }
// }