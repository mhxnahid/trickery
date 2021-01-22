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

##### Eloquent static boot() used with boot[TraitName] convention crashes the CLI server (7.4)
Using multiple boot() within the model and in a trait overrrides the one in the trait.
Using Oberserver seems to be better. Event/Listeners can be used as well but that's too much work for simply sending an email upon Model creation.
```php
protected static function boot(){
    //
}

//AppServiceProvider.php
public function boot()
    {
        User::observe(UserObserver::class);
    }
```

##### insert() doesn't check for types, won't fill in timestamps

## Better-do
