import QRCode from "qrcode"

export function generateQR(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      data,
      { width: 320, margin: 1 },
      (err, url) => {
        if (err) reject(err)
        else resolve(url)
      }
    )
  })
}
