export function readFileAsBase64(file: File): Promise<{ base64: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const [header, base64] = dataUrl.split(',')
      const contentType = header?.match(/:(.*?);/)?.[1]?.trim() ?? 'image/jpeg'
      if (!base64) {
        reject(new Error('Falha ao ler o arquivo'))
        return
      }
      resolve({ base64, contentType })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
