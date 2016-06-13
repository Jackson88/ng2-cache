import {CacheStoragesEnum} from '../enums/cache-storages.enum';

export interface CacheOptionsInterface {

    /**
     * Expires timestamp
     */
    expires?: number

    /**
     * Max age in seconds
     */
    maxAge?: number

    /**
     * Tag for this key
     */
    tag?: string

}