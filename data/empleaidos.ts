import jsonData from './empleaidos.json';
import type { Empleaido } from '@/types/empleaido';

// Export the data with proper typing
export const empleaidos = jsonData as Empleaido[];

// For backward compatibility, also export as default
export default empleaidos;
