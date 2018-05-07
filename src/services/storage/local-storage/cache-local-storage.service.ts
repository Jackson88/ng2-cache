import {Injectable} from '@angular/core';
import {CacheStorageAbstract} from '../cache-storage-abstract.service';
import {CacheStoragesEnum} from '../../../enums/cache-storages.enum';
import {StorageValueInterface} from '../../../interfaces/storage-value.interface';

/**
 * Service for storing data in local storage
 */
@Injectable()
export class CacheLocalStorage extends CacheStorageAbstract {

    public getItem(key: string) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public setItem(key: string, value: StorageValueInterface) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    public removeItem(key: string) {
        localStorage.removeItem(key);
    }

    public clear() {
        localStorage.clear();
    }

    public type() {
        return CacheStoragesEnum.LOCAL_STORAGE;
    }

    public isEnabled() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
}
