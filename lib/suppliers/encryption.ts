import crypto from 'crypto'

// Encrypt sensitive data like API keys
export function encryptApiKey(apiKey: string, secret: string = process.env.ENCRYPTION_SECRET || 'default-secret'): string {
  const cipher = crypto.createCipher('aes-256-cbc', secret)
  let encrypted = cipher.update(apiKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Decrypt API keys
export function decryptApiKey(encryptedKey: string, secret: string = process.env.ENCRYPTION_SECRET || 'default-secret'): string {
  const decipher = crypto.createDecipher('aes-256-cbc', secret)
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Validate supplier configuration
export function validateSupplierConfig(config: any, apiType: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.apiKey) errors.push('API key is required')
  if (!config.apiEndpoint) errors.push('API endpoint is required')

  if (apiType === 'printful') {
    if (!config.apiKey.match(/^[a-z0-9]{32}$/i)) {
      errors.push('Invalid Printful API key format')
    }
  } else if (apiType === 'printfusion') {
    if (!config.apiKey.match(/^[a-z0-9-]+$/i)) {
      errors.push('Invalid Printfusion API key format')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
