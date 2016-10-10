import {CacheStoragesEnum} from '../../enums/cache-storages.enum';
import {StorageValueInterface} from '../../interfaces/storage-value.interface';

/**
 * Abstract cache storage
 */
export abstract class CacheStorageAbstract {

    /**
     * Get item from storage
     * @param key
     */
    public abstract getItem(key: string): StorageValueInterface;

    /**
     * Set item to storage
     * @param key
     * @param value
     */
    public abstract setItem(key: string, value: StorageValueInterface): boolean;

    /**
     * Remove item from storage
     * @param key
     */
    public abstract removeItem(key: string): void;

    /**
     * Clear item in storage
     */
    public abstract clear(): void;

    /**
     * Get current storage type
     */
    public abstract type(): CacheStoragesEnum;

    /**
     * Check if storage is enabled
     */
    public abstract isEnabled(): boolean;

}
