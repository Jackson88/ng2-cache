import {CacheOptionsInterface} from './cache-options.interface';

export interface StorageValueInterface {

    /**
     * Cached data
     */
    value: any;

    /**
     * Cached options
     */
    options: CacheOptionsInterface;
}
