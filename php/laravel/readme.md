## Quirks
##### Empty timestamps array in eloquent results in 00-00-00 in timestamp fields (created_at, updated_at)

```php
public $timestamps = [];
```

##### Eloquent ->create() or ::create() only returns fields that were provided in the input array, along with timestamps
```php
$item = Item::create($data); // some fields
$item = $item->fresh(); // retrieve full record from DB
```

##### insert() doesn't check for types, won't fill in timestamps

## Better-do
