# ng2-cache

Client side caching service for Angular2

## Installation

To install this library, run:

```bash
$ npm install ng2-cache --save
```

Usage:

```typescript

import {Component} from 'angular2/core';
import {CacheService} from 'ng2-cache/ng2-cache';

@Component({
    selector: 'some-selector',
    template: '<div>Template</div>'
})
export class ExampleComponent {

    constructor(private _cacheService: CacheService) {}

    public func() {

        //put some data to cache "forever"
        this._cacheService.set('key', ['some data']);

        //put some data to cache for 5 minutes (maxAge - in seconds)
        this._cacheService.set('key', ['some data'], {maxAge: 5 * 60});

        //put some data to cache for 1 hour (expires - timestamp with milliseconds)
        this._cacheService.set('key', ['some data'], {expires: Date.now() + 1000 * 60 * 60});

        //put some data to cache with tag "tag"
        this._cacheService.set('key', ['some data'], {tag: 'tag'});

        //check if data exists in cache
        let exists: boolean = this._cacheService.exists('key');

        //remove all data from cache with tag "tag"
        this._cacheService.removeTag('tag');

        //remove all from cache
        this._cacheService.removeAll();

        //get all data related to tag "tag" :
        // {'key' => 'key data', ...}
        this._cacheService.getTagData('tag');

    }
}

```

By default service store data session storage, you could select one of storages:
 - session storage
 - local storage
 - memory
If current storage is not available - service will choose memory storage.

To change storage to local storage:

```typescript

import {Component, provide} from 'angular2/core';
import {CacheService, CacheStorageAbstract, CacheLocalStorage} from 'ng2-cache/ng2-cache';

@Component({
    selector: 'some-selector',
    template: '<div>Template</div>',
    providers: [
        CacheService,
        provide(CacheStorageAbstract, { useClass: CacheLocalStorage })
    ]
})

```

## License

ISC © [Romanov Evgeny](https://github.com/Jackson88)

