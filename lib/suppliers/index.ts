import { BaseSupplierClient } from './types';
import { PrintfulClient } from './printful';
import { PrintfusionClient } from './printfusion';
import { PrintnodeClient } from './printnode';
import { decryptApiKey } from './encryption';

export class SupplierFactory {
  static createClient(apiType: string, apiKey: string, apiEndpoint?: string): BaseSupplierClient {
    const decryptedKey = decryptApiKey(apiKey);

    switch (apiType.toLowerCase()) {
      case 'printful':
        return new PrintfulClient(decryptedKey);
      case 'printfusion':
        return new PrintfusionClient(decryptedKey);
      case 'printnode':
        return new PrintnodeClient(decryptedKey);
      case 'custom':
        // For custom suppliers, you'd implement a generic client
        throw new Error('Custom supplier implementation required');
      default:
        throw new Error(`Unsupported supplier type: ${apiType}`);
    }
  }
}

export * from './types';
export { PrintfulClient } from './printful';
export { PrintfusionClient } from './printfusion';
export { PrintnodeClient } from './printnode';
export { encryptApiKey, decryptApiKey } from './encryption';
