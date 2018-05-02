import {Injectable, Optional} from '@angular/core';
import {CacheOptionsInterface} from '../interfaces/cache-options.interface';
import {CacheStoragesEnum} from '../enums/cache-storages.enum';
import {CacheStorageAbstract} from './storage/cache-storage-abstract.service';
import {CacheSessionStorage} from './storage/session-storage/cache-session-storage.service';
import {CacheLocalStorage} from './storage/local-storage/cache-local-storage.service';
import {CacheMemoryStorage} from './storage/memory/cache-memory.service';
import {StorageValueInterface} from '../interfaces/storage-value.interface';

const CACHE_PREFIX = 'CacheService';

const DEFAULT_STORAGE = CacheStoragesEnum.SESSION_STORAGE;
const DEFAULT_ENABLED_STORAGE = CacheStoragesEnum.MEMORY;

@Injectable()
export class CacheService {

    /**
     * Default cache options
     */
    private _defaultOptions: CacheOptionsInterface = {
        expires: Number.MAX_VALUE,
        maxAge : Number.MAX_VALUE
    };

    /**
     * Cache prefix
     */
    private _prefix: string = CACHE_PREFIX;

    public constructor(@Optional() private _storage: CacheStorageAbstract) {
        this._validateStorage();
    }

    /**
     * Set data to cache
     * @param key
     * @param value
     * @param options
     */
    public set(key: string, value: any, options?: CacheOptionsInterface) {
        let storageKey = this._toStorageKey(key);
        options = options ? options : this._defaultOptions;
        if (this._storage.setItem(storageKey, this._toStorageValue(value, options))) {
            if (!this._isSystemKey(key) && options.tag) {
                this._saveTag(options.tag, storageKey);
            }
            return true;
        }
        return false;
    }


    /**
     * Get data from cache
     * @param key
     * @returns any
     */
    public get(key: string): any {
        let storageValue = this._storage.getItem(this._toStorageKey(key)),
            value: any = null;
        if (storageValue) {
            if (this._validateStorageValue(storageValue)) {
                value = storageValue.value;
            } else {
                this.remove(key);
            }
        }
        return value;
    }

    /**
     * Check if value exists
     * @param key
     * @returns boolean
     */
    public exists(key: string): boolean {
        return !!this.get(key);
    }

    /**
     * Remove item from cache
     * @param key
     */
    public remove(key: string) {
        this._storage.removeItem(this._toStorageKey(key));
        this._removeFromTag(this._toStorageKey(key));
    }

    /**
     * Remove all from cache
     */
    public removeAll() {
        this._storage.clear();
    }

    /**
     * Get all tag data
     * @param tag
     * @returns Array
     */
    public getTagData(tag: string) {
        let tags = this.get(this._tagsStorageKey()) || {},
            result : {[key: string]: any} = {};
        if (tags[tag]) {
            tags[tag].forEach((key: string) => {
                let data = this.get(this._fromStorageKey(key));
                if (data) {
                    result[this._fromStorageKey(key)] = data;
                }
            });
        }
        return result;
    }

    /**
     * Create a new instance of cache with needed storage
     * @param type
     * returns CacheService
     */
    public useStorage(type: CacheStoragesEnum) {
        let service = new CacheService(this._initStorage(type));
        service.setGlobalPrefix(this._getCachePrefix());
        return service;
    }

    /**
     * Remove all by tag
     * @param tag
     */
    public removeTag(tag: string) {
        let tags = this.get(this._tagsStorageKey()) || {};
        if (tags[tag]) {
            tags[tag].forEach((key: string) => {
                this._storage.removeItem(key);
            });
            delete tags[tag];
            this.set(this._tagsStorageKey(), tags);
        }
    }

    /**
     * Set global cache key prefix
     * @param prefix
     */
    public setGlobalPrefix(prefix: string) {
        this._prefix = prefix;
    }

    /**
     * Validate cache storage
     */
    private _validateStorage() {
        if (!this._storage) {
            this._storage = this._initStorage(DEFAULT_STORAGE);
        }
        if (!this._storage.isEnabled()) {
            this._storage = this._initStorage(DEFAULT_ENABLED_STORAGE);
        }
    }

    /**
     * Remove key from tags keys list
     * @param key
     */
    private _removeFromTag(key: string) {
        let tags = this.get(this._tagsStorageKey()) || {},
            index: number;
        for (let tag in tags) {
            index = tags[tag].indexOf(key);
            if (index !== -1) {
                tags[tag].splice(index, 1);
                this.set(this._tagsStorageKey(), tags);
                break;
            }
        }
    }

    /**
     * Init storage by type
     * @param type
     * @returns CacheStorageAbstract
     */
    private _initStorage(type: CacheStoragesEnum) {
        let storage: CacheStorageAbstract;
        switch (type) {
            case CacheStoragesEnum.SESSION_STORAGE:
                storage = new CacheSessionStorage();
                break;
            case CacheStoragesEnum.LOCAL_STORAGE:
                storage = new CacheLocalStorage();
                break;
            default: storage = new CacheMemoryStorage();
        }
        return storage;
    }

    private _toStorageKey(key: string) {
        return this._getCachePrefix() + key;
    }

    private _fromStorageKey(key: string) {
        return key.replace(this._getCachePrefix(), '');
    }

    /**
     * Prepare value to set to storage
     * @param value
     * @param options
     * returns {value: any, options: CacheOptionsInterface}
     */
    private _toStorageValue(value: any, options: CacheOptionsInterface): StorageValueInterface {
        return {
            value: value,
            options: this._toStorageOptions(options)
        };
    }

    /**
     * Prepare options to set to storage
     * @param options
     * @returns CacheOptionsInterface
     */
    private _toStorageOptions(options: CacheOptionsInterface): CacheOptionsInterface {
        var storageOptions: CacheOptionsInterface = {};
        storageOptions.expires = options.expires ? options.expires :
            (options.maxAge ? Date.now() + (options.maxAge * 1000) : this._defaultOptions.expires);
        storageOptions.maxAge = options.maxAge ? options.maxAge : this._defaultOptions.maxAge;
        return storageOptions;
    }

    /**
     * Validate storage value
     * @param value
     * @returns boolean
     */
    private _validateStorageValue(value: StorageValueInterface) {
        return !!value.options.expires && value.options.expires > Date.now();
    }

    /**
     * check if its system cache key
     * @param key
     * returns boolean
     */
    private _isSystemKey(key: string) {
        return [this._tagsStorageKey()].indexOf(key) !== -1;
    }

    /**
     * Save tag to list of tags
     * @param tag
     * @param key
     */
    private _saveTag(tag: string, key: string) {
        let tags = this.get(this._tagsStorageKey()) || {};
        if (!tags[tag]) {
            tags[tag] = [key];
        } else {
            tags[tag].push(key);
        }
        this.set(this._tagsStorageKey(), tags);
    }

    /**
     * Get global cache prefix
     * returns {string}
     * private
     */
    private _getCachePrefix() {
        return this._prefix;
    }

    private _tagsStorageKey() {
        return 'CacheService_tags';
    }

}
